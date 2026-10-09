## 2024-10-24 - Scroll Event Optimization Pattern
**Learning:** In this Vanilla JS project, attaching raw scroll event listeners that query the DOM repeatedly (e.g., `document.getElementById('fab-top')`) and make synchronous class list changes causes layout thrashing and unnecessary performance degradation.
**Action:** When adding or modifying scroll event listeners, always cache DOM elements outside the listener, track the visibility state, and wrap DOM updates in `requestAnimationFrame` to prevent layout thrashing.
