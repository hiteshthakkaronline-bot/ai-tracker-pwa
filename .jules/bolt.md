## 2026-09-01 - Cached Intl.DateTimeFormat for Date Rendering
**Learning:** Calling `toLocaleDateString()` and `toLocaleString()` inside array iteration and render loops instantiates expensive `Intl.DateTimeFormat` objects on every iteration, leading to unnecessary overhead and garbage collection.
**Action:** Always pre-initialize and cache `Intl.DateTimeFormat` instances globally (just like `Intl.NumberFormat`) and use their `.format()` method to render dates inside loops.
