## 2024-05-18 - Avoid synchronous localStorage I/O in render loops
**Learning:** `localStorage.getItem` and `JSON.parse` were being called inside array map/forEach loops during DOM string construction (`renderDashboard` and `renderHome`). This blocks the main thread on every iteration, leading to noticeable performance drops, especially when the arrays grow large. This is a common performance anti-pattern.
**Action:** Extract synchronous operations like `localStorage.getItem` and `JSON.parse` so they execute once outside the loop, passing the parsed result into the loop instead.
