## 2024-05-14 - [Scroll Event Layout Thrashing]
**Learning:** Found a scroll event listener in `index.html` (lines 324-336) that queries the DOM (`document.getElementById('fab-top')`) and mutates DOM classes synchronously inside the scroll event without `requestAnimationFrame`. This causes layout thrashing and poor scroll performance in this Vanilla JS app.
**Action:** Always cache DOM elements outside the listener and wrap DOM updates in `requestAnimationFrame` with a state tracker to prevent layout thrashing on scroll.
