## 2024-05-19 - [Scroll Event Layout Thrashing Fix]
**Learning:** Found a scroll event listener in `index.html` querying the DOM (`document.getElementById('fab-top')`) on every scroll event, which causes layout thrashing and poor performance on scroll.
**Action:** When adding or modifying scroll event listeners, always cache DOM elements outside the listener and wrap DOM updates in `requestAnimationFrame` with a visibility state tracker to prevent layout thrashing.
