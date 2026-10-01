## 2024-05-18 - [Optimize Scroll Listener]
**Learning:** Scroll event listeners for things like back-to-top buttons should not query the DOM (`document.getElementById`) on every single scroll event, and should debounce/throttle DOM class mutations using `requestAnimationFrame` to avoid layout thrashing and blocking the main thread.
**Action:** When adding or encountering scroll listeners in Vanilla JS projects, always cache DOM elements outside the listener and wrap DOM updates in `requestAnimationFrame` with a state tracker.
