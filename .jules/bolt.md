## 2024-05-15 - Optimize scroll listener layout thrashing
**Learning:** In Vanilla JS, adding scroll event listeners directly to window can cause layout thrashing if DOM queries and updates are not optimized.
**Action:** Always cache DOM elements outside the listener and wrap DOM updates in `requestAnimationFrame` with a visibility state tracker.