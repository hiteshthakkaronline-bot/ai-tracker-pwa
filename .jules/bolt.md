## 2024-03-24 - [Unoptimized Scroll Listener in Vanilla JS PWA]
**Learning:** Found an anti-pattern in the scroll event listener where `document.getElementById` and class mutations are executed on every single scroll event tick without throttling or `requestAnimationFrame`. This causes unnecessary layout thrashing and DOM querying overhead.
**Action:** When working on scroll listeners in this Vanilla JS project, always cache DOM elements outside the listener and wrap DOM updates in `requestAnimationFrame` with a visibility state tracker to prevent layout thrashing and excessive DOM mutations.
