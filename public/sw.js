importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
  // Cache de imagens (ícones e cartas)
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'poker-images',
    })
  );

  // Cache das fontes do Google (Cormorant e DM Mono)
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'poker-fonts',
    })
  );

  // Cache das páginas e scripts (Estratégia: Tenta rede, se falhar usa cache)
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'script' || request.destination === 'style' || request.destination === 'document',
    new workbox.strategies.NetworkFirst({
      cacheName: 'poker-app-core',
    })
  );
}