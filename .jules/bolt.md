## 2024-05-17 - Scroll Event Throttling and DOM Caching
**Learning:** Vanilla JS apps often have event listeners (like `scroll`) that trigger synchronously. If these contain DOM queries (`getElementById`), it forces layout thrashing on every tick.
**Action:** Always cache DOM elements outside event listeners and use `requestAnimationFrame` to throttle scroll/resize events to 60fps.
