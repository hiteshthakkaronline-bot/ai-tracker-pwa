## 2024-05-18 - Avoid JSON.parse and localStorage reads in render loops
**Learning:** Calling `JSON.parse` or reading from `localStorage` within rendering loops creates severe O(N) bottlenecks in vanilla JavaScript architectures.
**Action:** Always extract `localStorage.getItem` and `JSON.parse` operations to a higher scope, executing them once before a loop, and pass the parsed object (snapshot) down as an argument to the functions inside the loop.
