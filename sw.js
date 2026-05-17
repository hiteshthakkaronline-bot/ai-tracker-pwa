// 1. IMPORT ONESIGNAL SDK SAFELY (MUST BE LINE 1)
try {
  importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
} catch (e) {
  console.log("[Service Worker] Offline mode: OneSignal bypassed.");
}

// 2. INTERCEPT THE BACKGROUND BUTTON CLICK
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
      event.waitUntil(
        fetch(`${GOOGLE_SCRIPT_URL}?action=markCompleted&rows=${rowsToUpdate}`, {
            method: 'GET',
            mode: 'no-cors' 
        })
        .catch(err => console.error(err))
      );
    }
  }
});

// 3. CACHE SETUP (Fixed Vercel Paths)
const CACHE_NAME = 'ai-tracker-v2.95';
const ASSETS_TO_CACHE = [
  '/',
  '/styles.css', 
  '/manifest.json'
];

// 4. INSTALL EVENT
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 5. ACTIVATE EVENT
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

// 6. FETCH EVENT (The Golden Rule Routing)
self.addEventListener('fetch', (event) => {
  
  // RULE 1: Never intercept POST requests (This fixes the OneSignal rubber-banding!)
  if (event.request.method !== 'GET') {
    return; 
  }

  // RULE 2: Only intercept requests for our own Vercel files.
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return; 
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
