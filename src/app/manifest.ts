import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Poker Odds Calculator',
    short_name: 'Poker Odds',
    description: 'Calculadora de probabilidade de Poker Texas Hold\'em em tempo real.',
    start_url: '/',
    display: 'standalone', // Isso tira a barra de endereços do navegador
    background_color: '#060a12',
    theme_color: '#060a12', // A cor da barra de status do celular
    orientation: 'portrait', // Trava o app na vertical
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}