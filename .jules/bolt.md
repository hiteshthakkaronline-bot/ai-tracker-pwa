## 2024-03-20 - [Scroll Performance Optimization]
**Learning:** Frequent unthrottled DOM queries inside a scroll listener can cause main thread blocking and noticeable scroll jank, especially in a PWA running on mobile devices.
**Action:** Always cache DOM references outside of scroll/resize event listeners, and wrap state changes in `requestAnimationFrame` to throttle updates to once per frame.