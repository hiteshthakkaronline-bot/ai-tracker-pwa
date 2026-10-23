import re
from playwright.sync_api import sync_playwright, expect

def run_cuj(page):
    page.goto("http://localhost:8000")

    # We need to unlock first using the secret pin or sessionStorage trick
    page.evaluate("sessionStorage.setItem('isUnlocked', 'true')")
    page.reload()

    page.wait_for_timeout(1000)

    # Make sure we have a scrollable area. The page might not have enough content by default.
    # Let's add some dummy content just to verify the scroll listener logic.
    page.evaluate('''
        const dummy = document.createElement('div');
        dummy.style.height = '2000px';
        document.body.appendChild(dummy);
    ''')

    page.wait_for_timeout(500)

    # Initial state: FAB should be invisible (opacity-0, translate-y-4)
    fab_locator = page.locator('#fab-top')
    # Use re.compile to match classes properly
    expect(fab_locator).to_have_class(re.compile(r'.*opacity-0.*'))
    expect(fab_locator).to_have_class(re.compile(r'.*translate-y-4.*'))

    # Scroll down past the 150px threshold
    page.evaluate('window.scrollTo(0, 500)')
    page.wait_for_timeout(1000)

    # Check FAB visibility: should have opacity-100 and translate-y-0
    expect(fab_locator).to_have_class(re.compile(r'.*opacity-100.*'))
    expect(fab_locator).to_have_class(re.compile(r'.*translate-y-0.*'))

    # Take screenshot at the visible state
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")

    # Scroll back up to verify it hides again
    page.evaluate('window.scrollTo(0, 0)')
    page.wait_for_timeout(1000)

    # Final state check: should be invisible again
    expect(fab_locator).to_have_class(re.compile(r'.*opacity-0.*'))
    expect(fab_locator).to_have_class(re.compile(r'.*translate-y-4.*'))

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()  # MUST close context to save the video
            browser.close()
