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
        }).catch(err => console.error(err))
      );
    }
  }
});

// 3. CACHE SETUP
const CACHE_NAME = 'ai-tracker-tailwind-v5.03';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js'
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

// 6. Fetch Event (Optimized Stale-While-Revalidate with OneSignal & CDN Passthroughs)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return; 
  
  const url = new URL(event.request.url);
  
  // 🚀 CRITICAL ONE-SIGNAL BYPASS RULE:
  // If the request is bound for OneSignal endpoints or subdomains, exit immediately and let 
  // the browser handle it natively over the live internet. This stops the button from resetting!
  if (url.origin.includes('onesignal') || url.href.includes('onesignal.com')) {
    return; 
  }
  
  // Allow external layout engine scripts (Tailwind & Chart.js CDNs) to be served from cache offline
  const isTargetCDN = url.href === 'https://cdn.tailwindcss.com' || url.href === 'https://cdn.jsdelivr.net/npm/chart.js';
  
  // Guard clause for other cross-origin background requests
  if (url.origin !== self.location.origin && !isTargetCDN) return; 

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          let responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      }).catch(() => {});
      
      return cachedResponse || fetchPromise;
    })
  );
});
