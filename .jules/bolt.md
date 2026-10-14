## 2026-10-14 - Scroll Event Optimization
**Learning:** In Vanilla JS PWAs, attaching `scroll` event listeners that query the DOM (`document.getElementById`) and modify classes on every scroll event causes significant layout thrashing and unnecessary reflows.
**Action:** Always cache DOM elements outside the listener, wrap DOM updates in `requestAnimationFrame`, and use a visibility state tracker to ensure classes are only modified when the state actually changes.
