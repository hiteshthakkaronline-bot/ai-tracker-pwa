## 2024-05-15 - Scroll Event Performance
**Learning:** In this Vanilla JS app, the scroll event listener was repeatedly updating DOM classes which caused layout thrashing.
**Action:** When adding or modifying scroll event listeners, cache DOM elements outside the listener, wrap DOM class updates in `requestAnimationFrame`, and use a visibility state tracker to prevent redundant DOM updates.
