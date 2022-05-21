
const OFFLINE_VERSION = 1;
const CACHE_NAME = `OFFLINE_${OFFLINE_VERSION}`;
const OFFLINE_URL = "./offline.html";

self.addEventListener("install", function (event) {
  console.log("[ServiceWorker] Install");

  event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        cache.addAll([
          '/',
          '/styles/styles.css',
          '/script/webpack-bundle.js',
          '/static/js/bundle.js',
          '/static/js/0.chunk.js',
          '/static/js/main.chunk.js',
          'favicon.ico'
        ])
      })
  )


      //await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
      //console.log("offline page cached");
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

});

self.addEventListener("fetch", function (event) {
  console.log("[Service Worker] Fetch", event.request.url);

  self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage(
        "Hi client " + client.id + ". You requested:" + event.request.url
      );
    });
  });

  //if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.log(
            "[Service Worker] Fetch failed; returning offline page instead.",
            error
          );

          self.clients.matchAll().then(function (clients) {
            clients.forEach(function (client) {
              client.postMessage(
                { error: "You are offline. Please reconnect!" }
              );
            });
          });

          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(event.request);
          return cachedResponse;
        }
      })()
    );
  //}
});

self.addEventListener("message", function (event) {
  console.log(event.data)
  self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage(
        { todos: event.data }
      );
    });
  });
});


self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage(
        { notification: event.data.text() }
      );
    });
  });

  const title = 'Push Codelab';
  const options = {
    body: 'Yay it works.',
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
      clients.openWindow('https://developers.google.com/web/')
  );
});