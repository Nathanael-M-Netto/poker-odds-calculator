import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Essencial para jogos/calculadoras no mobile
  themeColor: '#060a12',
};

export const metadata: Metadata = {
  title: 'Poker Odds | Calculadora Mobile',
  description: 'Calculadora de probabilidade de Poker em tempo real.',
  manifest: '/manifest.json', // Já deixando pronto para o Passo 3 (PWA)
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Poker Odds',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#060a12] text-white overflow-hidden antialiased">
        {children}
      </body>
    </html>
  );
}