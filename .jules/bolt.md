
## 2026-11-02 - [Scroll Event Layout Thrashing Prevention]
**Learning:** [Vanilla JS scroll event listeners manipulating the DOM without requestAnimationFrame and state-tracking cause layout thrashing]
**Action:** [Always cache DOM elements and use requestAnimationFrame coupled with visibility tracking for scroll-based class toggles]
