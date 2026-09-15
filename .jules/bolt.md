## 2023-11-20 - Throttling Scroll Events and Caching DOM Queries

**Learning:** Scrolling can trigger events synchronously, executing layout-blocking logic multiple times per frame. If a DOM node query (`getElementById`) is inside that loop, it causes performance overhead. Caching the node outside the listener and wrapping layout-heavy logic in `requestAnimationFrame` decouples visual updates from raw scroll event frequency.

**Action:** Whenever attaching scroll listeners, use `requestAnimationFrame` to limit the firing rate to the display refresh rate (throttling), and always cache DOM nodes that exist statically to prevent repeated queries during high-frequency events.
