const CACHE_NAME = 'the-home-pipo-cache-v2';
const OFFLINE_URL = '/offline.html';

const ESSENTIAL_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/manifest.webmanifest',
  '/icon-192.svg',
  '/icon-512.svg'
];

// Install Event - Pre-cache core shell & offline fallback
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching essential assets and offline fallback');
      return cache.addAll(ESSENTIAL_ASSETS).catch((err) => {
        console.warn('[SW] Cache addAll warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean old caches & take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache version:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Handle network requests with offline fallbacks
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // Skip chrome-extension, internal schemes, and server API mutations
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // 1. Navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Cache a fresh copy of the page
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // If network fails, try to return cached page or fallback to offline.html
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          const offlineFallback = await caches.match(OFFLINE_URL);
          if (offlineFallback) {
            return offlineFallback;
          }
          return new Response('<h1>Sin conexión</h1><p>THE HOME PIPO Pizzería</p>', {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        })
    );
    return;
  }

  // 2. Static Assets (CSS, JS, Fonts, Images, Icons)
  // Use Stale-While-Revalidate strategy for lightning fast load and offline resilience
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed, nothing extra needed if cachedResponse was returned
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// ==========================================
// PUSH NOTIFICATIONS & INTERACTIVITY
// ==========================================

// Push Event - Received from Push Server / Web Push Protocol
self.addEventListener('push', (event) => {
  let data = {
    title: 'THE HOME PIPO 🔥 Pizzería',
    body: '¡Hay una actualización en tu pedido artesanal!',
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    url: '/',
    tag: 'pipo-order-update',
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.svg',
    badge: data.badge || '/icon-192.svg',
    vibrate: [200, 100, 200, 100, 300],
    data: {
      url: data.url || '/',
      orderId: data.orderId,
      promoCode: data.promoCode,
      timestamp: Date.now(),
    },
    tag: data.tag || 'pipo-notification',
    renotify: true,
    actions: data.actions || [
      { action: 'open_app', title: '🍕 Ver Estado' },
      { action: 'dismiss', title: 'Cerrar' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Event - Navigation & Window Focus
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there is already a window open
      for (const client of clientList) {
        if ('focus' in client) {
          if (client.url && client.url.includes(self.location.origin)) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Message Event - Receive direct notification dispatch from client scripts
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data.payload;
    self.registration.showNotification(title, {
      icon: '/icon-192.svg',
      badge: '/icon-192.svg',
      vibrate: [200, 100, 200],
      ...options
    });
  }
});

