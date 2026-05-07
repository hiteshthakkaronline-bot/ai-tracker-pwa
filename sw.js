// 1. INTERCEPT THE BACKGROUND BUTTON CLICK
self.addEventListener('notificationclick', function(event) {
  
  // Check if the button ID starts with our specific action
  if (event.action && event.action.startsWith('btn_completed|')) {
    
    // INSTANTLY kill the notification and stop the browser from trying to open
    event.stopImmediatePropagation();
    event.preventDefault();
    event.notification.close();

    // Extract the row numbers from the button ID (e.g., "btn_completed|2" becomes "2")
    const rowsToUpdate = event.action.split('|')[1];
    
    if (rowsToUpdate) {
      // Your actual Google Script URL
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzk4LUBXFiVq3U-8ojdCe5Xni9_yYqlPCBb_4X-F6afbJM9S-lV1-2N_ukVxUYYzQytTg/exec";
      
      // Execute the fetch completely in the background without waking up the app
      event.waitUntil(
        fetch(`${GOOGLE_SCRIPT_URL}?action=markCompleted&rows=${rowsToUpdate}`)
          .then(response => response.json())
          .then(data => console.log("[Service Worker] Background Sheet update success:", data))
          .catch(err => console.error("[Service Worker] Background update failed:", err))
      );
    }
  }
});

// 2. IMPORT ONESIGNAL SDK
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// 3. BUMP CACHE TO FORCE YOUR PHONE TO DOWNLOAD THIS NEW UPDATE
const CACHE_NAME = 'ai-tracker-v2.35';

// REMOVED the Tailwind CDN from here!
const ASSETS_TO_CACHE = [
  './',
  './index.html',
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

// 6. Fetch Event
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

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
