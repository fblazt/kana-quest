import { create } from 'zustand';
import { initDB, seedDatabaseIfEmpty } from '../lib/db';
import { getReviewQueue, getWeakKana, getNewKana, updateKanaStats } from '../lib/srs';
import { logConfusionPair } from '../lib/confusion';
import type { Kana, KanaType } from '../types/kana';

export type PracticeMode = 'practice' | 'survival' | 'speed';

export interface SessionStats {
  totalAnswered: number;
  totalCorrect: number;
  totalTime: number;
  maxStreak: number;
  masteredKana: string[];
  confusedPairs: { shown: string; answered: string }[];
  mode: PracticeMode;
}

interface PracticeState {
  mode: PracticeMode;
  queue: Kana[];
  currentIndex: number;
  score: number;
  lives: number;
  streak: number;
  maxStreak: number;
  startTime: number;
  questionStartTime: number;
  totalTime: number;
  isFinished: boolean;
  feedback: 'correct' | 'incorrect' | null;
  sessionStats: SessionStats;

  startSession: (mode: PracticeMode, type?: KanaType) => Promise<void>;
  submitAnswer: (romaji: string) => Promise<'correct' | 'incorrect'>;
  nextKana: () => void;
  tickTimer: () => void;
  endSession: () => void;
}

const SPEED_DURATION = 60 * 1000;
const SURVIVAL_LIVES = 3;

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  mode: 'practice',
  queue: [],
  currentIndex: 0,
  score: 0,
  lives: SURVIVAL_LIVES,
  streak: 0,
  maxStreak: 0,
  startTime: 0,
  questionStartTime: 0,
  totalTime: 0,
  isFinished: false,
  feedback: null,
  sessionStats: {
    totalAnswered: 0,
    totalCorrect: 0,
    totalTime: 0,
    maxStreak: 0,
    masteredKana: [],
    confusedPairs: [],
    mode: 'practice',
  },

  startSession: async (mode, type) => {
    await seedDatabaseIfEmpty();
    const db = await initDB();
    
    let queue: Kana[] = [];
    
    if (mode === 'speed' || mode === 'survival') {
      const [due, weak, fresh] = await Promise.all([
        getReviewQueue(db, type),
        getWeakKana(db, type),
        getNewKana(db, type)
      ]);
      queue = shuffle([...due, ...weak, ...fresh]).slice(0, 40);
    } else {
      const due = await getReviewQueue(db, type);
      if (due.length > 0) {
        queue = shuffle(due);
      } else {
        const [weak, fresh] = await Promise.all([
          getWeakKana(db, type),
          getNewKana(db, type)
        ]);
        queue = shuffle([...weak, ...fresh]).slice(0, 20);
      }
    }

    db.close();

    const now = Date.now();
    set({
      mode,
      queue,
      currentIndex: 0,
      score: 0,
      lives: SURVIVAL_LIVES,
      streak: 0,
      maxStreak: 0,
      startTime: now,
      questionStartTime: now,
      totalTime: 0,
      isFinished: false,
      feedback: null,
      sessionStats: {
        totalAnswered: 0,
        totalCorrect: 0,
        totalTime: 0,
        maxStreak: 0,
        masteredKana: [],
        confusedPairs: [],
        mode,
      },
    });
  },

  submitAnswer: async (romaji) => {
    const state = get();
    if (state.isFinished || state.queue.length === 0) return 'incorrect';

    const kana = state.queue[state.currentIndex];
    const correct = romaji.toLowerCase().trim() === kana.romaji.toLowerCase();
    const responseTime = Date.now() - state.questionStartTime;

    const db = await initDB();
    await updateKanaStats(db, kana.id, correct, responseTime);

    let newScore = state.score;
    let newLives = state.lives;
    let newStreak = state.streak;
    let newMaxStreak = state.maxStreak;
    let newMastered = [...state.sessionStats.masteredKana];
    let newConfused = [...state.sessionStats.confusedPairs];

    if (correct) {
      newScore += 1;
      newStreak += 1;
      newMaxStreak = Math.max(newMaxStreak, newStreak);
      
      if (kana.totalCorrect + 1 >= 5 && kana.totalCorrect + 1 > kana.totalWrong * 2) {
        if (!newMastered.includes(kana.id)) {
          newMastered.push(kana.id);
        }
      }
    } else {
      newStreak = 0;
      if (state.mode === 'survival') {
        newLives -= 1;
      }
      
      newConfused.push({ shown: kana.id, answered: romaji });
      await logConfusionPair(db, kana.id, romaji);
    }

    const stats = await db.get('user_progress', 'main');
    if (stats) {
      const totalReviews = stats.totalReviews + 1;
      const totalCorrect = stats.totalCorrect + (correct ? 1 : 0);
      await db.put('user_progress', {
        ...stats,
        totalReviews,
        totalCorrect,
        totalWrong: stats.totalWrong + (correct ? 0 : 1),
        averageAccuracy: Math.round((totalCorrect / totalReviews) * 100),
        totalPracticeDays: Math.max(stats.totalPracticeDays, 1),
      });
    }

    db.close();

    const newTotalAnswered = state.sessionStats.totalAnswered + 1;
    const newTotalCorrect = state.sessionStats.totalCorrect + (correct ? 1 : 0);

    set({
      score: newScore,
      lives: newLives,
      streak: newStreak,
      maxStreak: newMaxStreak,
      feedback: correct ? 'correct' : 'incorrect',
      sessionStats: {
        ...state.sessionStats,
        totalAnswered: newTotalAnswered,
        totalCorrect: newTotalCorrect,
        maxStreak: newMaxStreak,
        masteredKana: newMastered,
        confusedPairs: newConfused,
      },
    });

    if (state.mode === 'survival' && newLives <= 0) {
      setTimeout(() => get().endSession(), 500);
    }

    return correct ? 'correct' : 'incorrect';
  },

  nextKana: () => {
    const state = get();
    if (state.isFinished) return;

    const nextIndex = state.currentIndex + 1;
    
    if (state.mode === 'speed') {
      if (Date.now() - state.startTime >= SPEED_DURATION) {
        set({ isFinished: true });
        return;
      }
    }

    if (nextIndex >= state.queue.length) {
      set({ isFinished: true });
      return;
    }

    set({
      currentIndex: nextIndex,
      questionStartTime: Date.now(),
      feedback: null,
    });
  },

  tickTimer: () => {
    const state = get();
    if (state.isFinished || state.mode !== 'speed') return;

    const elapsed = Date.now() - state.startTime;
    if (elapsed >= SPEED_DURATION) {
      set({ isFinished: true, totalTime: SPEED_DURATION });
    } else {
      set({ totalTime: elapsed });
    }
  },

  endSession: () => {
    const state = get();
    set({
      isFinished: true,
      totalTime: Date.now() - state.startTime,
    });
  },
}));
