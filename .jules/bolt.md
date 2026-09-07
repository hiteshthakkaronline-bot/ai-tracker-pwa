## 2024-05-24 - Prevent Scroll Jank with State Tracking
**Learning:** Continuous DOM queries (`document.getElementById`) and DOM mutations (`classList.add/remove`) inside high-frequency event listeners like `scroll` can cause significant scroll jank, especially on mobile devices.
**Action:** Always cache DOM elements outside the event listener and use state variables (e.g., `isFabVisible`) to ensure DOM updates are only triggered when the state actually changes.
