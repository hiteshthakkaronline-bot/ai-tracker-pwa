## 2024-05-24 - [Scroll Event Optimization]
**Learning:** [In Vanilla JS projects, handling scroll events directly can lead to layout thrashing and poor performance due to synchronous DOM updates. This codebase had a scroll listener without throttling or state tracking, causing unnecessary class mutations on every scroll tick.]
**Action:** [When adding or modifying scroll event listeners in this Vanilla JS project, always cache DOM elements outside the listener and wrap DOM updates in `requestAnimationFrame` with a visibility state tracker to prevent layout thrashing.]
