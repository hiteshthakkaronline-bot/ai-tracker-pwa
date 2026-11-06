
## 2026-11-06 - [Scroll Event Throttling in Vanilla JS]
**Learning:** High-frequency events like `scroll` can cause severe layout thrashing if they repeatedly query the DOM and update classes directly, especially in a single-page Vanilla JS app.
**Action:** When adding or modifying scroll event listeners, always cache DOM elements outside the listener and wrap DOM updates in `requestAnimationFrame` with a visibility state tracker.
