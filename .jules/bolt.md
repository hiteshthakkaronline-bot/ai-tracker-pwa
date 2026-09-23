## 2024-05-18 - Hoisting synchronous localStorage reads from rendering loops
**Learning:** Found a performance bottleneck where `localStorage.getItem` and `JSON.parse` were called synchronously inside `forEach` loops during UI rendering (in `renderDashboard` and `renderHome`), leading to O(N) disk I/O and parsing time on every render.
**Action:** Hoist the `localStorage.getItem` and parsing logic outside of loops, storing the result in a variable, and passing the parsed object down to the functions that need it.
