'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const ITEM_HEIGHT = 50;
const REPEAT_COUNT = 60; // Repete a lista 60 vezes para criar o ciclo infinito
const ITEMS = Array.from({ length: REPEAT_COUNT }).flatMap(() => OPTIONS);
const CENTER_GROUP_START = Math.floor(REPEAT_COUNT / 2) * OPTIONS.length;

interface PlayerPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerCount: number;
  setPlayerCount: (count: number) => void;
}

export const PlayerPickerModal = memo(function PlayerPickerModal({ isOpen, onClose, playerCount, setPlayerCount }: PlayerPickerModalProps) {
  const scrollRef = useRef<HTMLUListElement>(null);
  
  // Usamos um estado local para a rodinha não forçar a calculadora a rodar 30x por segundo
  const [localCount, setLocalCount] = useState(playerCount);

  // Quando abre o modal, joga o scroll lá pro meio da lista infinita
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      setLocalCount(playerCount);
      const offset = OPTIONS.indexOf(playerCount);
      const targetIndex = CENTER_GROUP_START + offset;
      scrollRef.current.scrollTop = targetIndex * ITEM_HEIGHT;
    }
  }, [isOpen, playerCount]);

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const val = ITEMS[index];

    if (val && val !== localCount) {
      setLocalCount(val);
      
      // Haptic Feedback (Leve vibração)
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(8); } catch (e) {} // 8ms de vibração
      }
    }

    // Se rolar demais pras pontas, teleporta silenciosamente pro meio
    if (index < 20 || index > ITEMS.length - 20) {
      const newTarget = CENTER_GROUP_START + OPTIONS.indexOf(val);
      e.currentTarget.scrollTop = newTarget * ITEM_HEIGHT;
    }
  };

  const handleClose = () => {
    setPlayerCount(localCount); // Envia o número final para a Calculadora
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-[#0a0f18] rounded-t-[32px] border-t border-white/10 pb-[env(safe-area-inset-bottom,20px)] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] flex flex-col"
          >
            <div className="p-5 flex justify-between items-center border-b border-white/5 shrink-0">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Oponentes</span>
              <button onClick={handleClose} className="font-serif text-emerald-400 font-bold text-xl active:scale-95 transition-transform">
                Pronto
              </button>
            </div>

            {/* O "Relógio" iOS */}
            <div className="relative h-[250px] w-full flex justify-center bg-[#060a12] overflow-hidden">
              <div className="absolute top-0 w-full h-[100px] bg-gradient-to-b from-[#060a12] to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 w-full h-[100px] bg-gradient-to-t from-[#060a12] to-transparent z-10 pointer-events-none" />
              
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-[50px] border-y border-emerald-500/20 z-0 bg-emerald-500/5 pointer-events-none" />

              <ul 
                ref={scrollRef}
                onScroll={handleScroll}
                className="h-full w-full overflow-y-auto snap-y snap-mandatory hide-scrollbar z-20"
                style={{ paddingTop: '100px', paddingBottom: '100px' }}
              >
                {ITEMS.map((n, i) => (
                  <li 
                    key={i} 
                    className={`h-[50px] snap-center flex items-center justify-center font-serif transition-colors duration-150 select-none
                      ${localCount === n ? 'text-4xl text-emerald-400 font-black drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'text-2xl text-white/20 font-bold'}
                    `}
                  >
                    {n} Jogadores
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});