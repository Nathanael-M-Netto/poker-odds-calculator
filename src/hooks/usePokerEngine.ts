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
  
  // NOVO: Estado de número de jogadores (padrão 2: Você vs 1)
  const [playerCount, setPlayerCount] = useState(2);

  useEffect(() => {
    if (hand.length === 2 && (board.length === 0 || board.length >= 3)) {
      setIsCalculating(true);
      setTimeout(() => {
        try {
          const formattedHand = hand.map(c => `${c.rank}${c.suit}`).join('');
          const formattedBoard = board.map(c => `${c.rank}${c.suit}`).join('');
          
          const playerHandGroup = CardGroup.fromString(formattedHand);
          const boardGroup = formattedBoard ? CardGroup.fromString(formattedBoard) : undefined;

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
          
          // Reduzimos o número de simulações baseado no número de jogadores 
          // para não fritar o processador do celular com 10 mãos ao mesmo tempo
          const SIMULATIONS = playerCount > 5 ? 15 : 25; 

          for (let i = 0; i < SIMULATIONS; i++) {
            const shuffled = [...remainingDeck].sort(() => 0.5 - Math.random());
            
            // NOVO: Gerar mãos para N oponentes invisíveis
            const opponentsGroups = [];
            let cardIndex = 0;
            for (let j = 0; j < playerCount - 1; j++) {
              // Pegamos 2 cartas do baralho embaralhado para cada oponente
              const oppHandStr = `${shuffled[cardIndex]}${shuffled[cardIndex+1]}`;
              opponentsGroups.push(CardGroup.fromString(oppHandStr));
              cardIndex += 2;
            }

            // A biblioteca suporta múltiplos oponentes passando um array
            const result = OddsCalculator.calculate(
              [playerHandGroup, ...opponentsGroups], 
              boardGroup, 
              undefined, 
              30 // iterações internas reduzidas para manter a velocidade mobile
            );
            
            const playerOdds = result.equities[0]; 
            totalWin += playerOdds.getEquity();
            totalTie += playerOdds.getTiePercentage();
          }

          setOdds({ win: totalWin / SIMULATIONS, tie: totalTie / SIMULATIONS });
        } catch (error) {
          console.error("Erro odds:", error);
        } finally {
          setIsCalculating(false);
        }
      }, 50); 
    } else {
      setOdds({ win: 0, tie: 0 });
    }
  }, [hand, board, playerCount]); // NOVO: Recalcula se o número de jogadores mudar

  const addCard = (rank: Rank, suit: Suit, target: 'hand' | 'board') => {
    const isDuplicate = [...hand, ...board].some(card => card.rank === rank && card.suit === suit);
    if (isDuplicate) return;
    const newCard = { rank, suit };
    if (target === 'hand' && hand.length < 2) setHand(prev => [...prev, newCard]);
    else if (target === 'board' && board.length < 5) setBoard(prev => [...prev, newCard]);
  };

  const resetGame = () => { setHand([]); setBoard([]); setOdds({ win: 0, tie: 0 }); };

  return { hand, board, odds, isCalculating, playerCount, setPlayerCount, addCard, resetGame };
}