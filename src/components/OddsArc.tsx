'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

interface OddsArcProps {
  value: number;
  tie: number;
}

export const OddsArc = memo(function OddsArc({ value, tie }: OddsArcProps) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const progress = (value / 100) * circ;
  const color = value > 65 ? '#34d399' : value > 40 ? '#fbbf24' : '#f87171';
  const shadowColor = value > 65 ? 'rgba(52,211,153,0.5)' : value > 40 ? 'rgba(251,191,36,0.5)' : 'rgba(248,113,113,0.5)';

  return (
    <div className="relative w-[92px] h-[92px] flex items-center justify-center">
      <svg width="92" height="92" className="absolute inset-0 -rotate-90" style={{ filter: `drop-shadow(0 0 6px ${shadowColor})` }}>
        <circle cx="46" cy="46" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4.5" />
        <motion.circle
          cx="46" cy="46" r={r} fill="none" stroke={color}
          strokeWidth="4.5" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - progress }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <motion.span
          key={value.toFixed(1)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-serif font-black leading-none tracking-tight"
          style={{ fontSize: 24, color }}
        >
          {value.toFixed(1)}
        </motion.span>
        <span className="font-mono text-[8px] text-white/30 tracking-wider uppercase mt-[3px] font-medium">vitória</span>
        <span className="font-mono text-[7px] text-white/20 mt-[2px] font-medium">{tie.toFixed(1)}% emp.</span>
      </div>
    </div>
  );
});