'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePokerEngine } from '@/hooks/usePokerEngine';
import { Rank, Suit, ALL_RANKS, SUITS_CONFIG } from '@/constants/poker';

import { CardSlot } from '@/components/CardSlot';
import { OddsArc } from '@/components/OddsArc';
import { RankButton } from '@/components/RankButton';
import { StartScreen } from '@/components/StartScreen';
import { SuitSelector } from '@/components/SuitSelector';
import { PlayerPickerModal } from '@/components/PlayerPickerModal'; // IMPORT DO MODAL

export default function Home() {
  const { hand, board, odds, isCalculating, playerCount, setPlayerCount, addCard, resetGame } = usePokerEngine();
  
  const [hasStarted, setHasStarted] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false); // CONTROLE DO MODAL
  const [pendingRank, setPendingRank] = useState<Rank | null>(null);
  const [pauseAction, setPauseAction] = useState<'flop' | 'turn' | 'river' | 'end' | null>(null);

  const isHandComplete = hand.length === 2;
  const target = !isHandComplete ? 'hand' : 'board';
  const allCardsInPlay = useMemo(() => [...hand, ...board], [hand, board]);

  useEffect(() => {
    if (hand.length === 2 && board.length === 0) setPauseAction('flop');
    else if (board.length === 3) setPauseAction('turn');
    else if (board.length === 4) setPauseAction('river');
    else if (board.length === 5) setPauseAction('end');
  }, [hand.length, board.length]);

  const handleReset = useCallback(() => { 
    resetGame(); 
    setPendingRank(null); 
    setPauseAction(null); 
  }, [resetGame]);

  const handleStart = useCallback(() => setHasStarted(true), []);

  const usedSuitsForPendingRank = useMemo(() => {
    return allCardsInPlay.filter(c => c.rank === pendingRank).map(c => c.suit);
  }, [allCardsInPlay, pendingRank]);

  const availableSuits = (Object.entries(SUITS_CONFIG) as [Suit, typeof SUITS_CONFIG[Suit]][])
    .filter(([suit]) => !usedSuitsForPendingRank.includes(suit));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700;800&family=DM+Mono:wght@400;500&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', Georgia, serif !important; }
        .font-mono  { font-family: 'DM Mono', monospace !important; }
      `}</style>

      <div className="h-dvh w-full flex flex-col bg-[#060a12] text-white overflow-hidden relative antialiased selection:bg-emerald-500/30">

        <AnimatePresence>
          {!hasStarted && (
            <StartScreen 
              onStart={handleStart} 
              playerCount={playerCount} 
              onOpenPicker={() => setIsPickerOpen(true)} 
            />
          )}
        </AnimatePresence>

        {/* Fundo Principal */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)`, backgroundSize: '22px 22px', opacity: 0.5 }} />
        
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none blur-[90px]"
          style={{ background: odds.win > 65 ? 'rgba(52,211,153,0.06)' : odds.win > 40 ? 'rgba(251,191,36,0.05)' : 'rgba(248,113,113,0.05)', transition: 'background 1s ease' }} />

        {/* HEADER */}
        <div className="shrink-0 flex items-center justify-between px-6 pt-12 pb-5 border-b border-white/[0.06] z-10 rounded-b-[28px]"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', backdropFilter: 'blur(12px)' }}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30 font-medium ml-1">
                {isHandComplete ? 'Sua Mão' : '2 Cartas'}
              </p>
              
              {/* SINALIZADOR/BOTÃO NA MESA DE JOGO */}
              <button 
                onClick={() => setIsPickerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-[9px] uppercase tracking-widest text-emerald-400 active:scale-95 transition-transform"
              >
                👥 {playerCount}
              </button>
            </div>
            
            <div className="flex gap-3">
              <CardSlot card={hand[0]} size="sm" />
              <CardSlot card={hand[1]} size="sm" />
            </div>
          </div>
          <OddsArc value={isCalculating ? 0 : odds.win} tie={odds.tie} />
        </div>

        {/* MESA */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 gap-5">
          <div className="flex items-center gap-4 w-full max-w-[320px]">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.12))' }} />
            <span className="font-mono text-[9px] tracking-[0.25em] font-medium uppercase text-white/30">Mesa</span>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.12))' }} />
          </div>

          <div className="flex justify-center gap-2">
            {[0,1,2,3,4].map(i => (
              <CardSlot key={i} card={board[i]} label={i===0 ? 'Flop' : i===3 ? 'Turn' : i===4 ? 'River' : ''} />
            ))}
          </div>
        </div>

        {/* GAVETA */}
        <div className="shrink-0 h-[310px] rounded-t-[32px] border-t border-white/[0.07] p-5 z-20 relative flex flex-col"
          style={{ background: 'linear-gradient(180deg, rgba(12,17,32,0.97) 0%, rgba(8,12,22,0.99) 100%)', backdropFilter: 'blur(20px)', boxShadow: '0 -12px 40px rgba(0,0,0,0.6)' }}>

          <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-10 h-[4px] rounded-full bg-white/10" />

          {pauseAction !== 'end' && (
            <button onClick={handleReset} className="absolute top-[16px] right-6 font-mono text-[10px] uppercase tracking-widest font-medium text-white/30 hover:text-white/60 transition-colors py-1">
              Reset ↺
            </button>
          )}

          <div className="flex-1 mt-6 flex flex-col min-h-0">
            <AnimatePresence mode="wait">
              {pauseAction && !pendingRank ? (
                <motion.div key="action" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }} className="flex-1 flex flex-col items-center justify-center gap-3">
                  {pauseAction === 'end' ? (
                    <>
                      <span className="font-serif text-[32px] font-bold text-white/70 tracking-tight drop-shadow-md mb-2">Fim da Mão</span>
                      <motion.button whileTap={{ scale: 0.96 }} onClick={handleReset} className="w-full max-w-[260px] py-[16px] rounded-[22px] font-serif text-[22px] font-bold text-white tracking-wide" style={{ background: 'linear-gradient(145deg, rgba(52,211,153,0.15), rgba(16,185,129,0.05))', border: '1px solid rgba(52,211,153,0.3)', boxShadow: '0 0 20px rgba(52,211,153,0.1), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
                        Nova Mão ↺
                      </motion.button>
                    </>
                  ) : (
                    <motion.button whileTap={{ scale: 0.96 }} onClick={() => setPauseAction(null)} className="w-full max-w-[260px] py-[16px] rounded-[22px] font-serif text-[22px] font-bold text-white tracking-wide" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.4)' }}>
                      Ver o {pauseAction.charAt(0).toUpperCase() + pauseAction.slice(1)} →
                    </motion.button>
                  )}
                </motion.div>
              ) : !pendingRank ? (
                <motion.div key="ranks" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.16 }} className="flex-1 flex flex-col min-h-0">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/30 text-center mb-4 shrink-0">
                    {!isHandComplete ? '— carta da mão —' : '— carta da mesa —'}
                  </p>
                  <div className="grid grid-cols-4 gap-[8px] flex-1 min-h-0">
                    <RankButton rank="A" onClick={() => setPendingRank('A')} featured disabled={allCardsInPlay.filter(c => c.rank === 'A').length === 4} />
                    {ALL_RANKS.filter(r => r !== 'A').map(rank => (
                      <RankButton key={rank} rank={rank} onClick={() => setPendingRank(rank)} disabled={allCardsInPlay.filter(c => c.rank === rank).length === 4} />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <SuitSelector 
                  pendingRank={pendingRank} 
                  availableSuits={availableSuits} 
                  onSelect={(suit) => { addCard(pendingRank, suit, target); setPendingRank(null); }} 
                  onBack={() => setPendingRank(null)} 
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MODAL RENDERIZADO NO TOPO DE TUDO */}
        <PlayerPickerModal 
          isOpen={isPickerOpen} 
          onClose={() => setIsPickerOpen(false)} 
          playerCount={playerCount} 
          setPlayerCount={setPlayerCount} 
        />
        
      </div>
    </>
  );
}