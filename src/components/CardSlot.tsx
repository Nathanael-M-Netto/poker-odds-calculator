'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Suit, SUITS_CONFIG } from '@/constants/poker';

interface CardSlotProps {
  card?: { rank: string; suit: Suit };
  label?: string;
  size?: 'sm' | 'md';
}

export const CardSlot = memo(function CardSlot({ card, label, size = 'md' }: CardSlotProps) {
  const cfg = card ? SUITS_CONFIG[card.suit] : null;
  const isSmall = size === 'sm';

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/30 h-3 flex items-center font-medium">
        {label || ''}
      </span>
      <motion.div
        initial={{ scale: 0.75, opacity: 0, rotateY: -90 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
        className={`relative overflow-hidden flex flex-col items-center justify-center shrink-0
          ${isSmall ? 'w-[50px] h-[68px] rounded-[10px]' : 'w-[58px] h-[78px] rounded-[12px]'}
        `}
        style={{
          background: cfg ? cfg.bg : 'rgba(255,255,255,0.03)',
          border: `1px solid ${cfg ? cfg.border : 'rgba(255,255,255,0.08)'}`,
          boxShadow: cfg ? `${cfg.glow}, inset 0 1px 0 ${cfg.shimmer}` : 'inset 0 1px 0 rgba(255,255,255,0.05)',
          willChange: 'transform, opacity',
        }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)' }} />
        {cfg && card ? (
          <>
            <span className={`font-serif font-black leading-none ${isSmall ? 'text-[19px]' : 'text-[22px]'}`} style={{ color: cfg.textColor }}>
              {card.rank === 'T' ? '10' : card.rank}
            </span>
            <span className={`leading-none mt-[2px] ${isSmall ? 'text-[24px]' : 'text-[28px]'}`} style={{ color: cfg.textColor }}>
              {cfg.symbol}
            </span>
          </>
        ) : (
          <span className="text-white/10 text-xl font-light">+</span>
        )}
      </motion.div>
    </div>
  );
});