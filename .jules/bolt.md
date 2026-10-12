## 2024-11-20 - [Scroll Event Layout Thrashing]
**Learning:** Extracting DOM queries outside scroll listeners and wrapping visibility state changes within `requestAnimationFrame` significantly reduces layout thrashing, especially important for Vanilla JS PWAs where React/Vue virtualization patterns aren't available.
**Action:** When adding or modifying scroll event listeners in Vanilla JS projects, always cache DOM elements outside the listener and wrap DOM updates in `requestAnimationFrame` with a visibility state tracker.
