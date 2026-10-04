## 2024-05-18 - [Optimized Scroll Listener DOM Queries and Layout Thrashing]
**Learning:** Found an unoptimized scroll event listener in Vanilla JS triggering DOM queries (`document.getElementById`) on every scroll tick.
**Action:** Always extract DOM queries outside of high-frequency event listeners (like scroll/mousemove) and wrap DOM updates in `requestAnimationFrame` with a visibility state tracker (`isFabVisible`) to avoid unnecessary DOM reflows/repaints.
