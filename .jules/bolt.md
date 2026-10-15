## 2024-05-19 - Vanilla JS Scroll Event Optimization
**Learning:** In Vanilla JS, repeatedly querying the DOM (e.g., `getElementById`) and updating classes directly within a high-frequency event listener like `scroll` can cause significant layout thrashing and jank.
**Action:** Always cache DOM elements outside of high-frequency event listeners, and wrap layout updates inside `requestAnimationFrame`. Use state variables to avoid applying the same class updates repeatedly.
