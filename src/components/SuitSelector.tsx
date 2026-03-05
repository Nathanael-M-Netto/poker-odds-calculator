'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Suit, Rank, SUITS_CONFIG } from '@/constants/poker';

interface SuitSelectorProps {
  pendingRank: Rank;
  availableSuits: [Suit, typeof SUITS_CONFIG[Suit]][];
  onSelect: (suit: Suit) => void;
  onBack: () => void;
}

export const SuitSelector = memo(function SuitSelector({ pendingRank, availableSuits, onSelect, onBack }: SuitSelectorProps) {
  return (
    <motion.div 
      key="suits" 
      initial={{ opacity: 0, x: 16 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: 16 }} 
      transition={{ duration: 0.16 }} 
      className="flex-1 flex flex-col min-h-0"
    >
      <div className="flex items-center justify-between mb-4 shrink-0">
        <button onClick={onBack} className="font-mono text-[10px] uppercase tracking-wider font-medium text-white/40 py-2">
          ← Voltar
        </button>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-medium text-white/30">
          Naipe — <span className="text-white/60">{pendingRank === 'T' ? '10' : pendingRank}</span>
        </span>
        <div className="w-12" />
      </div>
      
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
        {availableSuits.map(([suit, cfg], i) => (
          <motion.button 
            key={suit} 
            initial={{ opacity: 0, scale: 0.92 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 340, damping: 24 }} 
            whileTap={{ scale: 0.94 }} 
            onClick={() => onSelect(suit)} 
            className="relative overflow-hidden rounded-[20px] flex flex-col items-center justify-center gap-1" 
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, boxShadow: `${cfg.glow}, inset 0 1px 0 ${cfg.shimmer}` }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.13) 0%, transparent 50%)' }} />
            <span className="text-[48px] leading-none relative z-10 drop-shadow-md" style={{ color: cfg.textColor }}>{cfg.symbol}</span>
            <span className="font-mono text-[9px] font-medium uppercase tracking-[0.16em] relative z-10" style={{ color: cfg.textColor, opacity: 0.6 }}>{cfg.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
});