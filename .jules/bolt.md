## 2023-10-25 - Scroll Event Optimization
**Learning:** In a vanilla JS/HTML project, adding unoptimized scroll event listeners that constantly query the DOM (e.g. `document.getElementById`) and modify classes can cause severe layout thrashing and jank.
**Action:** When adding or modifying scroll event listeners, always cache DOM elements outside the listener and wrap DOM updates in `requestAnimationFrame` along with a visibility state tracker to only update when necessary.
