## 2024-05-24 - Scroll Event Optimization
**Learning:** Attaching heavy DOM queries and property modifications inside a scroll listener negatively impacts performance since scroll events fire constantly.
**Action:** Extract DOM queries outside of scroll event listener scopes, and introduce state flags to ensure DOM manipulations only happen when visual changes are needed.
