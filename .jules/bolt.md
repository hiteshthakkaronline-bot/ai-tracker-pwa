## 2024-05-17 - [Optimized scroll event listener]
**Learning:** Calling `document.getElementById('fab-top')` inside the `scroll` event listener and triggering DOM updates without requestAnimationFrame causes layout thrashing and negatively impacts scrolling performance.
**Action:** Always cache DOM elements outside the event listener and wrap DOM updates in `requestAnimationFrame` with a state tracker for scroll events.
