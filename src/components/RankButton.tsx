'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Rank } from '@/constants/poker';

interface RankButtonProps {
  rank: Rank;
  onClick: () => void;
  featured?: boolean;
  disabled?: boolean;
}

export const RankButton = memo(function RankButton({ rank, onClick, featured, disabled }: RankButtonProps) {
  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.91 } : undefined}
      onClick={!disabled ? onClick : undefined}
      className={`flex items-center justify-center font-serif font-bold rounded-[11px] transition-all
        ${featured
          ? 'col-span-4 text-[24px] font-black text-emerald-300 border border-emerald-500/30'
          : 'text-[20px] text-white/80 border border-white/[0.07]'}
        ${disabled ? 'opacity-20 cursor-not-allowed saturate-0' : 'cursor-pointer'}
      `}
      style={{
        background: featured && !disabled
          ? 'linear-gradient(145deg, rgba(52,211,153,0.14), rgba(16,185,129,0.06))'
          : 'rgba(255,255,255,0.04)',
        boxShadow: featured && !disabled ? '0 0 16px rgba(52,211,153,0.08), inset 0 1px 0 rgba(52,211,153,0.15)' : 'inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {rank === 'T' ? '10' : rank}
    </motion.button>
  );
});