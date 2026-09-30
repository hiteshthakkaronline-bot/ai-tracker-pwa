
## 2024-05-19 - [O(n) synchronous localStorage reads in rendering loops]
**Learning:** Found that `localStorage.getItem` and `JSON.parse` were being called inside loops within the `renderDashboard` and `renderHome` functions (via `getAssetDeltaBadge` and `getIndividualAssetDeltaBadge`). This results in O(n) synchronous blocking reads and JSON parsing, which scales poorly with the number of assets.
**Action:** Lifted `localStorage` reads and JSON parsing outside of rendering loops, caching the parsed snapshot once and passing it to the rendering functions as an argument.
