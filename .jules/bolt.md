## 2024-10-24 - Unthrottled DOM Queries in Scroll Listener
**Learning:** `window.addEventListener('scroll')` was performing a synchronous DOM query (`document.getElementById`) and manipulating DOM classes on every single scroll tick. This is a common performance anti-pattern that causes layout thrashing and jank on mobile devices.
**Action:** Cache DOM elements outside scroll listeners and use `requestAnimationFrame` with a ticking flag to throttle visual updates to the device's native refresh rate.
