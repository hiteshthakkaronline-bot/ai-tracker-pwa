## 2024-06-05 - [Scroll Thrashing in Vanilla JS]
**Learning:** Performing DOM queries (`getElementById`) and unconditional `classList` updates inside a raw `scroll` event handler causes significant main thread blocking and layout thrashing, particularly on mobile devices where PWAs typically run.
**Action:** When adding or modifying scroll event listeners in this Vanilla JS project, always cache DOM elements outside the listener and wrap DOM updates in `requestAnimationFrame` with a visibility state tracker to prevent layout thrashing.
