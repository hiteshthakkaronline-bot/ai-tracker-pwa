
## 2026-10-23 - [Scroll Event Layout Thrashing]
**Learning:** Synchronous DOM querying and manipulation in high-frequency scroll events can lead to layout thrashing and poor performance.
**Action:** When adding or modifying scroll event listeners, always cache DOM elements outside the listener, track state with a boolean flag, and wrap DOM updates in `requestAnimationFrame` with a ticking flag to prevent layout thrashing.
