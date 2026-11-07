
## 2024-05-24 - [Scroll Event Layout Thrashing]
**Learning:** [Vanilla JS scroll event listeners in this PWA were querying the DOM (getElementById) and mutating classLists directly on every scroll tick, causing layout thrashing and main thread blocking.]
**Action:** [Always cache DOM elements outside the listener, throttle execution with requestAnimationFrame, and track state (e.g. isFabVisible) to only apply class mutations when a state change actually occurs.]
