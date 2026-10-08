## 2024-06-25 - Scroll Event Layout Thrashing
**Learning:** Found a performance bottleneck in the Vanilla JS architecture where scroll event listeners were updating the DOM synchronously without tracking state or throttling, leading to layout thrashing.
**Action:** Always cache DOM elements outside the event listener, use a visibility state tracking boolean to prevent redundant updates, and wrap the DOM manipulation in `requestAnimationFrame` with a ticking variable to throttle rapid events.
