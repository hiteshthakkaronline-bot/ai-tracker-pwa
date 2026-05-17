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

// 3. BUMP CACHE TO FORCE YOUR PHONE TO DOWNLOAD THIS NEW UPDATE
const CACHE_NAME = 'ai-tracker-v2.58';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css', // <--- ADDED THIS LINE!
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

// 6. Fetch Event - The Traffic Cop
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // LANE 1: GOOGLE APPS SCRIPT DATA (Network First, Offline Fallback)
  if (url.hostname.includes('script.google.com')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // If we successfully got fresh data from Google, save a backup in the cache
          const responseToCache = networkResponse.clone();
          caches.open('ai-tracker-data-v1').then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // If the user has NO mobile data, gracefully serve the last known data from memory!
          console.log("[Service Worker] Offline! Serving fallback data.");
          return caches.match(event.request);
        })
    );
    return; // Stop here so it doesn't run the static asset logic
  }

  // LANE 2: STATIC ASSETS (Stale-While-Revalidate)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If we have the file (like styles.css) in the cache, instantly serve it to the screen
      if (cachedResponse) {
        
        // ...but also silently fetch the newest version from Vercel in the background!
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => { 
            // Completely ignore background fetch errors if we are offline
        });

        return cachedResponse; 
      }
      
      // If it's the very first time downloading the app and the cache is empty, fetch it normally
      return fetch(event.request);
    })
  );
});
