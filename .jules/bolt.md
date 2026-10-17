## 2026-10-17 - [Optimize Scroll Event Listeners]
**Learning:** [In this Vanilla JS project, scroll event listeners that query the DOM inside the callback and modify classes on every tick cause layout thrashing and high CPU usage.]
**Action:** [When adding or modifying scroll event listeners, always cache DOM elements outside the listener and wrap DOM updates in `requestAnimationFrame` with a visibility state tracker to prevent layout thrashing.]
