## 2026-09-13 - [Throttling scroll event]
**Learning:** Vanilla JS apps heavily relying on `scroll` events to toggle UI elements like FABs often fail to throttle updates. Running `classList` mutations inside a tight `scroll` event loops causes layout recalculations which hurts smooth scrolling.
**Action:** When inspecting similar frontend codebases, look for un-throttled scroll handlers querying the DOM. Extract DOM lookups outside the loop, use a visibility boolean check, and wrap with `requestAnimationFrame`.
