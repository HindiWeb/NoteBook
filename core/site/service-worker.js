const CACHE_NAME = 'HindiWeb-IN-Devs-Notes-v5';
const offlineImagePattern = /\/pastedImage_[0-9a-f]{64}\.png$/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        // Add URLs of assets you want to cache during installation
        'manifest.json',
        // Add more URLs as needed
      ]);
    })
  );
});

// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       // If the request matches the offline image pattern, try to serve it from cache
//       if (offlineImagePattern.test(event.request.url) && cachedResponse) {
//         return cachedResponse;
//       }
        
//       // Skip caching for POST requests
//       if (event.request.method === 'POST') {
//         return fetch(event.request);
//       }

//       // Otherwise, try to fetch the resource from the network
//       return fetch(event.request).then((response) => {
//         // Check if the response is valid
//         if (!response || response.status !== 200 || response.type !== 'basic') {
//           return response;
//         }

//         // Clone the response to use it and also cache it
//         const responseToCache = response.clone();

//         caches.open(CACHE_NAME).then((cache) => {
//           cache.put(event.request, responseToCache);
//         });

//         return response;
//       }).catch(() => {
//         // If the user is offline and the resource is not in the cache, serve a fallback
//         if (cachedResponse) {
//           return cachedResponse;
//         }
//       });
//     })
//   );
// });

// self.addEventListener('activate', (event) => {
//   // Remove old caches that do not match the offline image pattern
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((name) => {
//           if (name !== CACHE_NAME && !offlineImagePattern.test(name)
//           ) {
//             return caches.delete(name);
//           }
//         })
//       );
//     })
//   );
// });