## 2024-05-24 - Optimize Scroll Event Handlers
**Learning:** High-frequency event handlers like `scroll` can cause significant jank and layout thrashing in PWAs if they perform synchronous DOM queries (like `document.getElementById`) and redundant class mutations on every tick.
**Action:** Always cache DOM elements outside of high-frequency event listeners, track visibility/state to prevent redundant DOM updates, and use `window.requestAnimationFrame` to debounce layout-affecting changes.
