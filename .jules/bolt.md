
## 2024-05-24 - Memoize Date parsing in FD/NCD tables
**Learning:** Redundantly instantiating `Date` objects inside Array.sort() or reduce() turns parsing into an O(N log N) or repetitive O(N) operation, blocking the main thread for large datasets in Javascript.
**Action:** Pre-calculate date-derived values (timestamps, formatted strings, specific components) when parsing JSON network payloads, converting comparison and rendering functions from redundant computations to O(1) property access.
