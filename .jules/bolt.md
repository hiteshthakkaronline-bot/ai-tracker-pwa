
## 2026-11-10 - [Scroll Event Optimization with requestAnimationFrame]
**Learning:** [In a Vanilla JS PWA like this, naive scroll event listeners that directly query the DOM and mutate class lists on every scroll tick can cause significant Main Thread blocking and layout thrashing. Bypassing the PIN overlay programmatically via `sessionStorage.setItem('isUnlocked', 'true')` is an effective testing strategy for this specific application.]
**Action:** [Always cache DOM elements outside of high-frequency event listeners (like scroll or resize), and debounce/throttle DOM updates using `requestAnimationFrame` with a visibility state tracker to minimize layout thrashing and maintain smooth rendering performance.]
