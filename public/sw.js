importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (!workbox) {
  console.error('Workbox não carregou. App pode não funcionar offline.');
} else {
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'poker-images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    ({ url }) =>
      url.origin === 'https://fonts.googleapis.com' ||
      url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.StaleWhileRevalidate({ cacheName: 'poker-fonts' })
  );

  workbox.routing.registerRoute(
    ({ request }) =>
      ['script', 'style', 'document'].includes(request.destination),
    new workbox.strategies.NetworkFirst({ cacheName: 'poker-app-core' })
  );
}