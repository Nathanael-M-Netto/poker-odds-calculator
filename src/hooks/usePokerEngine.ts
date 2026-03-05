'use client';

import { useState, useEffect, useRef } from 'react';
import { CardGroup, OddsCalculator } from 'poker-odds-calculator';
import { Rank, Suit } from '@/constants/poker';

export type PlayingCard = { rank: Rank; suit: Suit };
export type PokerOdds = { win: number; tie: number; lose: number };
export type AddCardResult = 'added' | 'duplicate' | 'slot_full';

// Apenas nesses momentos o cálculo faz sentido
const CALC_TRIGGER_LENGTHS = new Set([0, 3, 4, 5]);

// Iterações por fase — river precisa de menos pois o board é fixo
const ITERATIONS_BY_BOARD: Record<number, number> = {
  0: 600,  // pre-flop: mais incerteza, mais iterações
  3: 700,  // flop
  4: 500,  // turn
  5: 300,  // river: board completo, converge rápido
};

const ALL_SUITS = ['h', 'd', 'c', 's'] as const;
const ALL_RANKS_STR = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'] as const;

// Baralho pré-computado uma única vez (não recria a cada render)
const FULL_DECK: string[] = ALL_RANKS_STR.flatMap(r => ALL_SUITS.map(s => `${r}${s}`));

function cardToStr(card: PlayingCard): string {
  return `${card.rank}${card.suit}`;
}

// Fisher-Yates in-place numa cópia
function shuffleDeck(deck: string[]): string[] {
  const a = deck.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function runMonteCarlo(
  heroHandStr: string,
  boardStr: string,
  boardLength: number,
  opponentCount: number,   // playerCount - 1, já validado
  iterations: number,
): PokerOdds {
  const usedSet = new Set<string>();
  for (let i = 0; i < heroHandStr.length; i += 2) usedSet.add(heroHandStr.slice(i, i + 2));
  for (let i = 0; i < boardStr.length; i += 2) usedSet.add(boardStr.slice(i, i + 2));

  const availableDeck = FULL_DECK.filter(c => !usedSet.has(c));
  const boardCardsNeeded = 5 - boardLength;
  // Cartas necessárias por iteração: 2 por oponente + board faltando
  const cardsNeeded = opponentCount * 2 + boardCardsNeeded;

  if (availableDeck.length < cardsNeeded) {
    return { win: 0, tie: 0, lose: 0 };
  }

  let wins = 0, ties = 0, valid = 0;

  const heroGroup = CardGroup.fromString(heroHandStr);

  for (let iter = 0; iter < iterations; iter++) {
    const deck = shuffleDeck(availableDeck);
    let idx = 0;

    // Monta as mãos dos oponentes
    const opponentGroups: ReturnType<typeof CardGroup.fromString>[] = [];
    let ok = true;

    for (let p = 0; p < opponentCount; p++) {
      const cardA = deck[idx++];
      const cardB = deck[idx++];
      if (!cardA || !cardB) { ok = false; break; }
      try {
        opponentGroups.push(CardGroup.fromString(cardA + cardB));
      } catch {
        ok = false; break;
      }
    }

    if (!ok) continue;

    // Completa o board
    let simulatedBoard = boardStr;
    for (let b = 0; b < boardCardsNeeded; b++) {
      const c = deck[idx++];
      if (!c) { ok = false; break; }
      simulatedBoard += c;
    }

    if (!ok || simulatedBoard.length !== 10) continue; // 5 cartas × 2 chars

    try {
      const boardGroup = CardGroup.fromString(simulatedBoard);
      const result = OddsCalculator.calculate(
        [heroGroup, ...opponentGroups],
        boardGroup,
      );

      const eq = result.equities[0];
      const winEq = eq.getEquity();
      const tieEq = eq.getTiePercentage();

      if (tieEq > 0) ties++;
      else if (winEq > 0) wins++;

      valid++;
    } catch {
      // iteração inválida, ignora
    }
  }

  if (valid === 0) return { win: 0, tie: 0, lose: 0 };

  const w = +((wins / valid) * 100).toFixed(1);
  const t = +((ties / valid) * 100).toFixed(1);
  const l = +Math.max(0, 100 - w - t).toFixed(1);

  return { win: w, tie: t, lose: l };
}

export function usePokerEngine() {
  const [hand, setHand] = useState<PlayingCard[]>([]);
  const [board, setBoard] = useState<PlayingCard[]>([]);
  const [odds, setOdds] = useState<PokerOdds>({ win: 0, tie: 0, lose: 0 });
  const [isCalculating, setIsCalculating] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);

  // Ref para cancelar cálculo obsoleto sem re-render
  const cancelRef = useRef(false);

  useEffect(() => {
    // Só calcula em momentos definidos (pós-hand, pós-flop, pós-turn, pós-river)
    if (hand.length !== 2 || !CALC_TRIGGER_LENGTHS.has(board.length)) {
      return;
    }

    cancelRef.current = true; // cancela qualquer cálculo anterior
    const token = {}; // objeto único para este efeito
    cancelRef.current = false;

    setIsCalculating(true);

    // Delay mínimo para não bloquear animações de entrada de carta
    const timer = setTimeout(() => {
      // Garante que ainda é o cálculo mais recente
      if (cancelRef.current) return;

      const opponentCount = Math.min(playerCount - 1, 11); // máx 12 jogadores = 11 oponentes
      const iterations = ITERATIONS_BY_BOARD[board.length] ?? 500;

      const heroHandStr = hand.map(cardToStr).join('');
      const boardStr = board.map(cardToStr).join('');

      const result = runMonteCarlo(heroHandStr, boardStr, board.length, opponentCount, iterations);

      if (!cancelRef.current) {
        setOdds(result);
        setIsCalculating(false);
      }
    }, 180); // aguarda animação da carta entrar

    return () => {
      cancelRef.current = true;
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
    cancelRef.current = true;
    setHand([]);
    setBoard([]);
    setOdds({ win: 0, tie: 0, lose: 0 });
    setIsCalculating(false);
  };

  return { hand, board, odds, isCalculating, playerCount, setPlayerCount, addCard, resetGame };
}