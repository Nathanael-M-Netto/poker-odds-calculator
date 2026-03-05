'use client';

import { useEffect } from 'react';

export function PWA() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('✨ Poker Odds PWA Ativo:', registration.scope);
        } catch (err) {
          console.error('❌ Falha ao registrar PWA:', err);
        }
      };

      // Só registra em produção para não atrapalhar seu desenvolvimento
      if (window.location.hostname !== 'localhost') {
        window.addEventListener('load', registerSW);
      }
    }
  }, []);

  return null;
}