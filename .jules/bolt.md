## 2024-06-03 - Scroll Event Handler Optimization
**Learning:** High-frequency events like `scroll` running synchronous DOM queries (e.g. `document.getElementById`) and style updates can severely block the main thread and cause jank, especially on mobile devices.
**Action:** Always move static DOM queries outside of the event listener, and use `requestAnimationFrame` (with a ticking boolean) to throttle style/class changes so they align with the browser's render cycle.
