// 1. IMPORT ONESIGNAL SDK SAFELY AT THE VERY TOP
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// 2. INTERCEPT THE BACKGROUND BUTTON CLICK
self.addEventListener('notificationclick', function(event) {
  if (event.action && event.action.startsWith('btn_completed|')) {
    
    event.stopImmediatePropagation();
    event.preventDefault();
    event.notification.close();

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

// 3. CACHE SETUP (WITH THE MISSING QUOTE FIXED!)
const CACHE_NAME = 'ai-tracker-v3.03';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/main.css',
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

// 6. Fetch Event (Golden Rule Routing to protect OneSignal)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return; 
  
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; 

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      
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
