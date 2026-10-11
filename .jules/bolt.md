## 2024-05-20 - Scroll Event Listener Thrashing
**Learning:** Vanilla JS scroll event listeners updating the DOM without `requestAnimationFrame` and state tracking can cause severe layout thrashing.
**Action:** Always cache DOM elements outside the listener and wrap DOM updates in `requestAnimationFrame` with a visibility state tracker.
