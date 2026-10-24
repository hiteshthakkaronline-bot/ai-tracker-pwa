
## 2024-05-15 - Scroll Event Throttling
**Learning:** Vanilla JS scroll event listeners doing unfiltered DOM API queries block the main thread and cause layout thrashing when triggering visual changes like hiding/showing a Floating Action Button.
**Action:** Always extract static DOM element selectors (like `getElementById`) out of the event listener and throttle the scroll handling callback using `requestAnimationFrame` and a state variable to minimize repaints.
