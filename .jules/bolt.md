## 2024-03-24 - [Scroll Event Optimization]
**Learning:** Vanilla JS scroll event listeners on `window` execute synchronously on the main thread and can fire dozens of times per second. Accessing DOM properties (like `classList.remove`) directly inside the listener without debouncing, throttling, or `requestAnimationFrame` causes layout thrashing and high CPU usage.
**Action:** Always cache DOM elements outside the event listener and wrap visual updates inside `requestAnimationFrame`. Use a state tracker variable to prevent redundant DOM updates when the visual state hasn't changed.
