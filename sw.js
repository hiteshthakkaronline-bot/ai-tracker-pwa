// 1. CUSTOM ACTION LISTENER MUST BE AT THE VERY TOP
// This prevents OneSignal from hijacking the button click and opening the app
self.addEventListener('notificationclick', function(event) {
  if (event.action === 'markCompleted') {
    
    // CRITICAL: Stop OneSignal from seeing this click!
    event.stopImmediatePropagation();
    event.preventDefault();
    
    event.notification.close();

    // Safely extract the row ID (handles standard Web Push and OneSignal formats)
    const data = event.notification.data || {};
    const rowId = (data.additionalData && data.additionalData.row) ? data.additionalData.row : data.row;

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzk4LUBXFiVq3U-8ojdCe5Xni9_yYqlPCBb_4X-F6afbJM9S-lV1-2N_ukVxUYYzQytTg/exec";

    // Run the fetch in the background without launching the UI
    event.waitUntil(
      fetch(`${GOOGLE_SCRIPT_URL}?action=markCompleted&rows=${rowId}`)
        .then(() => console.log("Task marked completed successfully in background"))
        .catch(err => console.error("Background update failed", err))
    );
  }
});

// 2. NOW IMPORT ONESIGNAL
// It will handle all other normal taps on the notification body
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// 3. BUMP CACHE TO FORCE PHONE TO DOWNLOAD THE NEW LOGIC
const CACHE_NAME = 'ai-tracker-v5.08';
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
