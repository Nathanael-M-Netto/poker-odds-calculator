export type Suit = 's' | 'h' | 'd' | 'c';
export type Rank = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

export const ALL_RANKS: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

export const SUITS_CONFIG: Record<Suit, { symbol: string; label: string; textColor: string; bg: string; border: string; glow: string; shimmer: string }> = {
  s: { symbol: '♠', label: 'Espadas', textColor: '#f8fafc', bg: 'linear-gradient(145deg, rgba(15,22,40,0.98), rgba(10,14,28,0.95))',  border: 'rgba(255,255,255,0.1)', glow: '0 4px 20px rgba(0,0,0,0.5)', shimmer: 'rgba(255,255,255,0.05)' },
  c: { symbol: '♣', label: 'Paus',    textColor: '#f8fafc', bg: 'linear-gradient(145deg, rgba(15,22,40,0.98), rgba(10,14,28,0.95))',  border: 'rgba(255,255,255,0.1)', glow: '0 4px 20px rgba(0,0,0,0.5)', shimmer: 'rgba(255,255,255,0.05)' },
  h: { symbol: '♥', label: 'Copas',   textColor: '#0c1220', bg: 'linear-gradient(145deg, rgba(239,68,68,0.95), rgba(185,28,28,0.9))', border: 'rgba(239,68,68,0.5)', glow: '0 4px 20px rgba(239,68,68,0.3)', shimmer: 'rgba(255,180,180,0.2)' },
  d: { symbol: '♦', label: 'Ouros',   textColor: '#0c1220', bg: 'linear-gradient(145deg, rgba(239,68,68,0.95), rgba(185,28,28,0.9))', border: 'rgba(239,68,68,0.5)', glow: '0 4px 20px rgba(239,68,68,0.3)', shimmer: 'rgba(255,180,180,0.2)' },
};