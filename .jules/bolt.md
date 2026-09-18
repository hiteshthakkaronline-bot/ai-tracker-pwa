## 2024-05-18 - Caching Intl API Formatters
**Learning:** `Intl.DateTimeFormat` or `Date.prototype.toLocaleString()` inside high-frequency loops are significant performance bottlenecks as creating formatters is expensive. In JavaScript, caching formatters instance or using simpler alternatives (like `Array` index mapping for months) yields huge speedups.
**Action:** Always cache instances of `Intl.NumberFormat`, `Intl.DateTimeFormat`, or any other formatters in the global scope instead of instantiating them within map/reduce/forEach iterations.
