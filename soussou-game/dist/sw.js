// Simple service worker to prevent cache errors
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // N'intercepter que les requêtes same-origin (Vite/Frontend)
  const url = new URL(event.request.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin) {
    // Laisser passer les requêtes externes (ex: API Laravel)
    return;
  }

  // Encapsuler dans try/catch pour éviter Uncaught (in promise)
  event.respondWith((async () => {
    try {
      return await fetch(event.request);
    } catch (err) {
      // Retourner une réponse d'erreur au lieu de rejeter la promesse
      return Response.error();
    }
  })());
});

// Handle message events to prevent channel closure errors
self.addEventListener('message', (event) => {
  // Respond to messages to prevent "message channel closed" errors
  if (event.ports && event.ports[0]) {
    event.ports[0].postMessage({ success: true });
  }
});