## 2024-05-19 - Scroll Event Listener Optimization
**Learning:** Found an unoptimized scroll event listener in `index.html` that queried the DOM (`document.getElementById`) and mutated `classList` on every scroll tick.
**Action:** Always cache DOM elements accessed inside high-frequency event listeners like `scroll`. Also track state (e.g., `isFabVisible`) to avoid redundant DOM writes/mutations.
