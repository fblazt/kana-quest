export type KanaType = 'hiragana' | 'katakana';

export interface Kana {
  id: string; // e.g., 'h-a' for hiragana a
  character: string;
  romaji: string;
  type: KanaType;

  totalCorrect: number;
  totalWrong: number;

  repetitions: number;
  interval: number;
  easeFactor: number;

  nextReview: number; // timestamp
  averageResponseTime: number; // in milliseconds
}

export interface ConfusionPair {
  id: string; // e.g., 'h-nu_h-me'
  shown: string;
  answered: string;
  count: number;
}

export interface UserStats {
  id: 'main'; // singleton record
  currentStreak: number;
  longestStreak: number;

  totalReviews: number;
  totalCorrect: number;
  totalWrong: number;

  averageAccuracy: number;

  totalPracticeDays: number;

  bestSurvivalScore: number;
  bestSpeedScore: number;
}
