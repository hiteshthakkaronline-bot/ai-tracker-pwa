## 2024-05-24 - Avoiding O(N) Synchronous Operations inside Render Loops

**Learning:** When generating lists iteratively (e.g. `forEach`), performing synchronous operations like `JSON.parse(localStorage.getItem(...))` inside the loop turns an O(1) operation into an O(N) bottleneck, causing rendering to block and degrading the application's performance.

**Action:** Extract expensive synchronous operations (such as `localStorage` reads and JSON parsing) out of the iterative loops. Perform the operation once before the loop and pass the resulting structured data down as an argument.
