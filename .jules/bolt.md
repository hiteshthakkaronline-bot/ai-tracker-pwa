## 2024-05-24 - Throttling High-Frequency Events with requestAnimationFrame
**Learning:** Performing synchronous DOM queries (like `document.getElementById`) and manipulating `classList` inside high-frequency event listeners (like `scroll` or `mousemove`) can cause excessive layout thrashing and jank, especially on mobile devices.
**Action:** Always cache DOM elements outside the listener. Use `window.requestAnimationFrame()` combined with a state flag to throttle DOM updates so they only occur when the layout state actually changes and align with the browser's render cycle.
