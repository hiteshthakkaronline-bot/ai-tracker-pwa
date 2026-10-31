## 2024-10-31 - [Scroll Event Layout Thrashing]
**Learning:** Adding a scroll event listener that queries the DOM (`document.getElementById`) and modifies classes (causing layout/paint) unconditionally on every scroll tick causes layout thrashing and severely degrades scrolling performance.
**Action:** When adding or modifying scroll event listeners, always cache DOM elements outside the listener and wrap DOM updates in `requestAnimationFrame` with a state tracker (e.g., `isFabVisible`) to prevent redundant updates.
