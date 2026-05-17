importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

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
