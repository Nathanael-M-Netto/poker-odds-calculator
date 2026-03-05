'use client';

import { motion } from 'framer-motion';

interface StartScreenProps {
  onStart: () => void;
  playerCount: number;
  onOpenPicker: () => void;
}

export function StartScreen({ onStart, playerCount, onOpenPicker }: StartScreenProps) {
  return (
    <motion.div 
      key="start-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#060a12]"
    >
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)`, backgroundSize: '22px 22px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}
        className="flex flex-col items-center text-center z-10"
      >
        
        {/* CORREÇÃO DO FALSO PNG AQUI: Removido o overlay e aplicado textShadow direto */}
        <div className="mb-4">
          <span 
            className="text-[110px] leading-none text-emerald-400 font-serif block"
            style={{ textShadow: '0 0 40px rgba(52,211,153,0.4)' }}
          >
            ♠
          </span>
        </div>
        
        <h1 className="font-serif text-5xl sm:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-lg">Poker Odds</h1>
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-white/40 mb-10 font-medium">Calculadora Mobile</p>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpenPicker}
          className="mb-6 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/80 font-mono text-[11px] uppercase tracking-widest flex items-center gap-3 active:bg-white/10 transition-colors shadow-lg backdrop-blur-md"
        >
          {playerCount} Jogadores na Mesa
          <span className="text-white/30 ml-1">▾</span>
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-14 py-[18px] rounded-[24px] font-serif text-[22px] font-bold text-white tracking-wide relative overflow-hidden group"
          style={{
            background: 'linear-gradient(145deg, rgba(52,211,153,0.15), rgba(16,185,129,0.05))',
            border: '1px solid rgba(52,211,153,0.3)',
            boxShadow: '0 0 30px rgba(52,211,153,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          Iniciar Jogo
        </motion.button>
      </motion.div>
    </motion.div>
  );
}