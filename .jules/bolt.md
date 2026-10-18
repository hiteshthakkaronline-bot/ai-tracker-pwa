## 2026-10-18 - Optimize scroll listener for FAB

**Learning:** Unoptimized scroll event listeners that query the DOM and update classes on every scroll tick can cause layout thrashing and performance degradation.
**Action:** Always cache DOM elements outside scroll listeners and wrap DOM updates in `requestAnimationFrame` with a visibility state tracker.
