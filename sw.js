// 1. INTERCEPT THE BACKGROUND BUTTON CLICK
self.addEventListener('notificationclick', function(event) {

  if (event.action && event.action.startsWith('btn_completed|')) {

    // Kill the notification and keep the app closed
    event.stopImmediatePropagation();
    event.preventDefault();
    event.notification.close();

    // Extract row numbers from the button ID
    const rowsToUpdate = event.action.split('|')[1];

    if (rowsToUpdate) {
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzk4LUBXFiVq3U-8ojdCe5Xni9_yYqlPCBb_4X-F6afbJM9S-lV1-2N_ukVxUYYzQytTg/exec";

      // THE FIX: "mode: 'no-cors'" forces a fire-and-forget request that bypasses Google's security blocks
      event.waitUntil(
        fetch(`${GOOGLE_SCRIPT_URL}?action=markCompleted&rows=${rowsToUpdate}`, {
            method: 'GET',
            mode: 'no-cors' 
        })
        .then(() => console.log("[Service Worker] Sent blind update to Google Sheets."))
        .catch(err => console.error("[Service Worker] Network failed:", err))
      );
    }
  }
});

// 2. IMPORT ONESIGNAL SDK SAFELY (THIS PREVENTS THE OFFLINE CRASH)
try {
  importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
} catch (e) {
  console.log("[Service Worker] Offline mode: OneSignal bypassed.");
}

// 3. BUMP CACHE TO FORCE YOUR PHONE TO DOWNLOAD THIS NEW UPDATE
const CACHE_NAME = 'ai-tracker-v2.62';

const ASSETS_TO_CACHE = [
  '/',
  '/styles.css',
  '/manifest.json'
];

// 4. Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 5. Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});


// 6. Fetch Event - The Traffic Cop
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // LANE 1: GOOGLE APPS SCRIPT DATA (Network First, Offline Fallback)
  if (url.hostname.includes('script.google.com')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const responseToCache = networkResponse.clone();
          caches.open('ai-tracker-data-v1').then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          console.log("[Service Worker] Offline! Serving fallback data.");
          return caches.match(event.request);
        })
    );
    return; 
  }

  // LANE 2: STATIC ASSETS (Stale-While-Revalidate)
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {

      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {}); 
        return cachedResponse; 
      }

      // THE BULLETPROOF FALLBACK (Forces the app to load if the browser is confused)
      return fetch(event.request).catch((error) => {
        if (event.request.mode === 'navigate' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
          return caches.match('/');
        }
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
