## 2023-10-27 - [Optimizing Scroll Event Listeners]
**Learning:** In Vanilla JS PWAs without virtual DOM overhead, naive scroll event listeners performing multiple DOM reads/writes cause severe layout thrashing.
**Action:** When adding or modifying scroll event listeners, always cache DOM elements outside the listener and wrap DOM updates in `requestAnimationFrame` with a visibility state tracker to prevent redundant class updates.
