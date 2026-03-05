'use client';

import { useState, useEffect } from 'react';
import { CardGroup, OddsCalculator } from 'poker-odds-calculator';
import { Rank, Suit, ALL_RANKS } from '@/constants/poker';

export type PlayingCard = { rank: Rank; suit: Suit; };
const ALL_SUITS: Suit[] = ['s', 'h', 'd', 'c'];

export function usePokerEngine() {
  const [hand, setHand] = useState<PlayingCard[]>([]);
  const [board, setBoard] = useState<PlayingCard[]>([]);
  const [odds, setOdds] = useState({ win: 0, tie: 0 });
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Número de jogadores na mesa (Você vs N-1 oponentes)
  const [playerCount, setPlayerCount] = useState(2);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Só calcula se tiver a mão completa (2 cartas) 
    // E se a mesa estiver vazia (Pre-flop) ou tiver pelo menos o Flop (3+ cartas)
    if (hand.length === 2 && (board.length === 0 || board.length >= 3)) {
      setIsCalculating(true);

      // Usamos um pequeno delay para permitir que o estado "isCalculating" 
      // renderize na tela antes do processador travar no cálculo pesado
      timer = setTimeout(() => {
        try {
          const formattedHand = hand.map(c => `${c.rank}${c.suit}`).join('');
          const formattedBoard = board.map(c => `${c.rank}${c.suit}`).join('');
          
          const playerHandGroup = CardGroup.fromString(formattedHand);
          const boardGroup = formattedBoard ? CardGroup.fromString(formattedBoard) : undefined;

          // Mapeia cartas que já saíram do baralho
          const usedCards = new Set([...hand, ...board].map(c => `${c.rank}${c.suit}`));
          const remainingDeck: string[] = [];

          ALL_SUITS.forEach(suit => {
            ALL_RANKS.forEach(rank => {
              const cardStr = `${rank}${suit}`;
              if (!usedCards.has(cardStr)) remainingDeck.push(cardStr);
            });
          });

          let totalWin = 0;
          let totalTie = 0;
          
          // Performance: Reduzimos simulações se houver muitos jogadores
          const SIMULATIONS = playerCount > 5 ? 15 : 25; 

          for (let i = 0; i < SIMULATIONS; i++) {
            // Embaralhamento rápido
            const shuffled = [...remainingDeck].sort(() => 0.5 - Math.random());
            
            // Gera mãos aleatórias para os oponentes invisíveis
            const opponentsGroups = [];
            let cardIndex = 0;
            for (let j = 0; j < playerCount - 1; j++) {
              const oppHandStr = `${shuffled[cardIndex]}${shuffled[cardIndex+1]}`;
              opponentsGroups.push(CardGroup.fromString(oppHandStr));
              cardIndex += 2;
            }

            // Executa o motor de cálculo estatístico
            const result = OddsCalculator.calculate(
              [playerHandGroup, ...opponentsGroups], 
              boardGroup, 
              undefined, 
              30 // Precisão interna por iteração
            );
            
            const playerOdds = result.equities[0]; 
            totalWin += playerOdds.getEquity();
            totalTie += playerOdds.getTiePercentage();
          }

          // Define a média dos resultados encontrados
          setOdds({ 
            win: totalWin / SIMULATIONS, 
            tie: totalTie / SIMULATIONS 
          });

        } catch (error) {
          console.error("Erro no cálculo de odds:", error);
        } finally {
          setIsCalculating(false);
        }
      }, 60); 
    } else {
      setOdds({ win: 0, tie: 0 });
    }

    // Cleanup: Se o usuário mudar uma carta antes do cálculo terminar, cancela o anterior
    return () => clearTimeout(timer);

  }, [hand, board, playerCount]);

  const addCard = (rank: Rank, suit: Suit, target: 'hand' | 'board') => {
    const isDuplicate = [...hand, ...board].some(card => card.rank === rank && card.suit === suit);
    if (isDuplicate) return;

    const newCard = { rank, suit };
    if (target === 'hand' && hand.length < 2) {
      setHand(prev => [...prev, newCard]);
    } else if (target === 'board' && board.length < 5) {
      setBoard(prev => [...prev, newCard]);
    }
  };

  const resetGame = () => {
    setHand([]);
    setBoard([]);
    setOdds({ win: 0, tie: 0 });
    setIsCalculating(false);
  };

  return { 
    hand, 
    board, 
    odds, 
    isCalculating, 
    playerCount, 
    setPlayerCount, 
    addCard, 
    resetGame 
  };
}