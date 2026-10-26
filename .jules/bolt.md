
## 2026-10-26 - [Scroll Event Throttling and State Tracking]
**Learning:** Vanilla JS scroll listeners in this app can cause main thread layout thrashing if DOM queries and classList modifications occur on every scroll tick.
**Action:** When adding or modifying scroll events, always cache DOM elements outside the listener, wrap DOM updates in `requestAnimationFrame`, and add a state flag (like `isFabVisible`) to skip redundant classList mutations.
