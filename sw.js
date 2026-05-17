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

// 2. IMPORT ONESIGNAL SDK
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// 3. BUMP CACHE TO FORCE YOUR PHONE TO DOWNLOAD THIS STABLE ROLLBACK
const CACHE_NAME = 'ai-tracker-v2.85';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css', 
  './manifest.json',
  './icons/AI PWA.png'
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

// 6. Fetch Event (The Golden Rule Routing)
self.addEventListener('fetch', (event) => {
  
  // RULE 1: Never intercept POST requests (This fixes the OneSignal crash!)
  if (event.request.method !== 'GET') {
    return; // Let the browser handle it normally
  }

  // RULE 2: Only intercept requests for our own Vercel files.
  // Completely ignore OneSignal, Google, and any other external websites!
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) {
    return; // Let the browser handle it normally
  }

  // RULE 3: Cache our local Vercel files safely
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) { return cachedResponse; }
      
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
        }
        let responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch((error) => console.error(error));
    })
  );
});
