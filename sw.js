// 1. CUSTOM BACKGROUND LISTENER
self.addEventListener('notificationclick', function(event) {
  const clickedAction = event.action;

  // Check if the clicked button ID starts with our custom prefix
  if (clickedAction && clickedAction.startsWith('btn_completed|')) {
    
    // CRITICAL: Stop OneSignal from opening the app
    event.stopImmediatePropagation();
    event.preventDefault();
    event.notification.close();

    // Extract the row numbers from the button ID (e.g., "btn_completed|15,16" -> "15,16")
    const rowId = clickedAction.split('|')[1];

    // If we successfully found the rows, hit the Google Sheet quietly
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
// It will handle all other normal taps on the notification body
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// 3. FORCE CACHE UPDATE (Bumped to v5.11 to ensure immediate update)
const CACHE_NAME = 'ai-tracker-v5.11';
const ASSETS_TO_CACHE = ['/', '/index.html', '/manifest.json'];

// 4. Install and activate immediately
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// 5. Fetch: Pass through OneSignal calls, cache everything else
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (url.origin.includes('onesignal')) return; 
    
    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});
