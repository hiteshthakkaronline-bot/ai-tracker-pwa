// 1. CUSTOM BACKGROUND LISTENER
self.addEventListener('notificationclick', function(event) {
  const clickedAction = event.action;

  if (clickedAction && clickedAction.startsWith('btn_completed|')) {
    event.stopImmediatePropagation();
    event.preventDefault();
    event.notification.close();

    const rowId = clickedAction.split('|')[1];

    if (rowId) {
      const GOOGLE_SCRIPT_URL = `https://script.google.com/macros/s/AKfycbzk4LUBXFiVq3U-8ojdCe5Xni9_yYqlPCBb_4X-F6afbJM9S-lV1-2N_ukVxUYYzQytTg/exec?action=markCompleted&rows=${rowId}`;
      
      event.waitUntil(
        fetch(GOOGLE_SCRIPT_URL, { method: 'GET', mode: 'no-cors' })
          .then(() => console.log("Tasks marked completed successfully in background"))
          .catch(err => console.error("Background update failed", err))
      );
    }
  }
});

// 2. IMPORT ONESIGNAL SDK
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// 3. FORCE CACHE UPDATE 
const CACHE_NAME = 'ai-tracker-v5.28';
const ASSETS_TO_CACHE = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)));
});

// 4. CACHE CLEANUP (Deletes old versions automatically)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName.startsWith('ai-tracker-v')) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    event.waitUntil(clients.claim());
});

// 5. DYNAMIC FETCH LISTENER (The Slow Network Fix)
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Ignore OneSignal requests
    if (url.origin.includes('onesignal')) return; 
    
    // Bypass cache for Google Apps Script AND its redirect URL
    if (url.origin.includes('script.google.com') || url.origin.includes('script.googleusercontent.com')) return; 
    
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // 1. Return the cached version instantly if we have it (e.g., Tailwind/Chart.js)
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // 2. If it's not in the cache, fetch it from the network
            return fetch(event.request).then((networkResponse) => {
                // Don't cache bad responses or non-GET requests
                if (!networkResponse || networkResponse.status !== 200 || event.request.method !== 'GET') {
                    return networkResponse;
                }
                
                // 3. Clone and save external scripts to the cache dynamically for next time
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                
                return networkResponse;
            });
        })
    );
});
