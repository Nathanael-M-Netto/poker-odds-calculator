'use client';

import { useState, useEffect } from 'react';
import { CardGroup, OddsCalculator } from 'poker-odds-calculator';
import { Rank, Suit } from '@/constants/poker';

export type PlayingCard = { rank: Rank; suit: Suit };
export type PokerOdds = { win: number; tie: number; lose: number };
export type AddCardResult = 'added' | 'duplicate' | 'slot_full';

const VALID_BOARD_LENGTHS = [0, 3, 4, 5];

export function usePokerEngine() {
  const [hand, setHand] = useState<PlayingCard[]>([]);
  const [board, setBoard] = useState<PlayingCard[]>([]);
  const [odds, setOdds] = useState<PokerOdds>({ win: 0, tie: 0, lose: 0 });
  const [isCalculating, setIsCalculating] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);

  useEffect(() => {
    if (hand.length !== 2 || !VALID_BOARD_LENGTHS.includes(board.length)) {
      setOdds({ win: 0, tie: 0, lose: 0 });
      setIsCalculating(false);
      return;
    }

    let cancelled = false;
    setIsCalculating(true);

    const timer = setTimeout(() => {
      try {
        const safePlayerCount = Math.max(2, Math.min(playerCount, 9));
        const formattedHand = hand.map(c => `${c.rank}${c.suit}`).join('');
        const formattedBoard = board.map(c => `${c.rank}${c.suit}`).join('');

        const playerHandGroup = CardGroup.fromString(formattedHand);
        const boardGroup = formattedBoard ? CardGroup.fromString(formattedBoard) : undefined;

        const result = OddsCalculator.calculate(
          [playerHandGroup],
          boardGroup,
          undefined,
          safePlayerCount
        );

        const playerOdds = result.equities[0];
        const win = playerOdds.getEquity();
        const tie = playerOdds.getTiePercentage();

        if (!cancelled) {
          setOdds({ win, tie, lose: Math.max(0, 100 - win - tie) });
        }
      } catch (error) {
        console.error('Erro no cálculo de odds:', error);
        if (!cancelled) setOdds({ win: 0, tie: 0, lose: 0 });
      } finally {
        if (!cancelled) setIsCalculating(false);
      }
    }, 100);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [hand, board, playerCount]);

  const addCard = (rank: Rank, suit: Suit, target: 'hand' | 'board'): AddCardResult => {
    const isDuplicate = [...hand, ...board].some(c => c.rank === rank && c.suit === suit);
    if (isDuplicate) return 'duplicate';

    if (target === 'hand') {
      if (hand.length >= 2) return 'slot_full';
      setHand(prev => [...prev, { rank, suit }]);
    } else {
      if (board.length >= 5) return 'slot_full';
      setBoard(prev => [...prev, { rank, suit }]);
    }
    return 'added';
  };

  const resetGame = () => {
    setHand([]);
    setBoard([]);
    setOdds({ win: 0, tie: 0, lose: 0 });
    setIsCalculating(false);
  };

  return { hand, board, odds, isCalculating, playerCount, setPlayerCount, addCard, resetGame };
}