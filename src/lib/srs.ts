import type { IDBPDatabase } from 'idb';
import type { KanaQuestDB } from './db';
import type { Kana, KanaType } from '../types/kana';

const INTERVALS = [
  5 * 60 * 1000,        // 5 min
  30 * 60 * 1000,       // 30 min
  24 * 60 * 60 * 1000,  // 1 day
  3 * 24 * 60 * 60 * 1000, // 3 days
  7 * 24 * 60 * 60 * 1000, // 7 days
  14 * 24 * 60 * 60 * 1000, // 14 days
  30 * 24 * 60 * 60 * 1000, // 30 days
];

export async function getReviewQueue(
  db: IDBPDatabase<KanaQuestDB>,
  type?: KanaType
): Promise<Kana[]> {
  const now = Date.now();
  const allKana = await db.getAllFromIndex('kana_deck', 'by-nextReview');

  const due = allKana.filter(k => {
    const isDue = k.nextReview <= now;
    if (type) return isDue && k.type === type;
    return isDue;
  });

  return due;
}

export async function getWeakKana(
  db: IDBPDatabase<KanaQuestDB>,
  type?: KanaType
): Promise<Kana[]> {
  const allKana = type
    ? await db.getAllFromIndex('kana_deck', 'by-type', type)
    : await db.getAll('kana_deck');

  return allKana
    .filter(k => k.totalCorrect + k.totalWrong > 0)
    .sort((a, b) => {
      const accA = a.totalCorrect / (a.totalCorrect + a.totalWrong);
      const accB = b.totalCorrect / (b.totalCorrect + b.totalWrong);
      return accA - accB;
    });
}

export async function getNewKana(
  db: IDBPDatabase<KanaQuestDB>,
  type?: KanaType
): Promise<Kana[]> {
  const allKana = type
    ? await db.getAllFromIndex('kana_deck', 'by-type', type)
    : await db.getAll('kana_deck');

  return allKana.filter(k => k.totalCorrect === 0 && k.totalWrong === 0);
}

export function calculateNextInterval(kana: Kana, correct: boolean): number {
  if (!correct) {
    return INTERVALS[0];
  }

  const nextIndex = Math.min(kana.repetitions + 1, INTERVALS.length - 1);
  return INTERVALS[nextIndex];
}

export function calculateEaseFactor(kana: Kana, correct: boolean): number {
  if (correct) {
    return Math.min(kana.easeFactor + 0.1, 3.0);
  }
  return Math.max(kana.easeFactor - 0.2, 1.3);
}

export async function updateKanaStats(
  db: IDBPDatabase<KanaQuestDB>,
  kanaId: string,
  correct: boolean,
  responseTime: number
): Promise<void> {
  const kana = await db.get('kana_deck', kanaId);
  if (!kana) return;

  const newRepetitions = correct ? kana.repetitions + 1 : 0;
  const interval = calculateNextInterval(kana, correct);
  const easeFactor = calculateEaseFactor(kana, correct);

  const totalReviews = kana.totalCorrect + kana.totalWrong;
  const newAvgResponseTime = totalReviews === 0
    ? responseTime
    : (kana.averageResponseTime * totalReviews + responseTime) / (totalReviews + 1);

  const updated: Kana = {
    ...kana,
    totalCorrect: kana.totalCorrect + (correct ? 1 : 0),
    totalWrong: kana.totalWrong + (correct ? 0 : 1),
    repetitions: newRepetitions,
    interval,
    easeFactor,
    nextReview: Date.now() + interval,
    averageResponseTime: Math.round(newAvgResponseTime),
  };

  await db.put('kana_deck', updated);
}
