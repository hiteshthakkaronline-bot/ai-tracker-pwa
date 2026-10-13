## 2026-10-13 - Scroll Event Listener Throttling
**Learning:** Raw scroll event listeners in vanilla JS can cause severe layout thrashing and main-thread blocking when DOM lookups and class manipulations are performed on every scroll tick.
**Action:** Always cache DOM elements outside the event listener, decouple logic using `requestAnimationFrame`, and use state trackers (e.g., `isFabVisible`) to only manipulate the DOM when visual state actually changes.
