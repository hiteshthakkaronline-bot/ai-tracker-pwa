// 1. MUST BE LINE 1: OneSignal needs its own SDK to manage the token
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

const CACHE_NAME = 'ai-tracker-v5.06';
const ASSETS_TO_CACHE = ['/', '/index.html', '/manifest.json'];

// 2. Install and activate immediately
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// 3. Fetch: Pass through OneSignal calls, cache everything else
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (url.origin.includes('onesignal')) return; 
    
    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});
