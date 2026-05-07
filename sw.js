// 1. INTERCEPT THE BACKGROUND BUTTON CLICK (Must be at the very top!)
self.addEventListener('notificationclick', function(event) {
  // Check if they clicked our specific action button
  if (event.action === 'btn_completed') {
    
    // Stop OneSignal from opening the browser window and close the notification
    event.stopImmediatePropagation();
    event.preventDefault();
    event.notification.close();

    // Extract the hidden row data we passed from Google Apps Script
    const notificationData = event.notification.data;
    
    if (notificationData && notificationData.rows) {
      // Your Google Apps Script Web App URL
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzk4LUBXFiVq3U-8ojdCe5Xni9_yYqlPCBb_4X-F6afbJM9S-lV1-2N_ukVxUYYzQytTg/exec";
      
      // Execute the fetch completely in the background
      event.waitUntil(
        fetch(`${GOOGLE_SCRIPT_URL}?action=markCompleted&rows=${notificationData.rows}`)
          .then(response => response.json())
          .then(data => console.log("[Service Worker] Background update success:", data))
          .catch(err => console.error("[Service Worker] Background update failed:", err))
      );
    }
  }
});

// 2. IMPORT ONESIGNAL SECOND
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// Bumped version to force the browser to update
const CACHE_NAME = 'ai-tracker-v2.33';

// REMOVED the Tailwind CDN from here!
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/AI PWA.png'
];

// 3. Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 4. Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing Old Cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 5. Fetch Event
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request).then((networkResponse) => {
        // Only cache valid standard responses (this naturally ignores the blocked Tailwind CDN)
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
        }
        
        // Clone and cache the response
        let responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return networkResponse;
      }).catch((error) => {
        console.error('[Service Worker] Network request failed:', error);
      });
    })
  );
});
