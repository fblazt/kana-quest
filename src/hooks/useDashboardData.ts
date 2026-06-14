import { useState, useEffect } from 'react';
import { initDB, seedDatabaseIfEmpty } from '../lib/db';
import { getReviewQueue } from '../lib/srs';
import type { Kana, UserStats } from '../types/kana';

export interface DashboardData {
  allKana: Kana[];
  hiragana: Kana[];
  katakana: Kana[];
  userStats: UserStats;
  dueCount: number;
  hiraganaMastery: number;
  katakanaMastery: number;
  overallMastery: number;
  loading: boolean;
}

function calculateMastery(kanaList: Kana[]): number {
  if (kanaList.length === 0) return 0;
  const mastered = kanaList.filter(
    (k) => k.totalCorrect >= 5 && k.totalCorrect > k.totalWrong * 2
  ).length;
  return Math.round((mastered / kanaList.length) * 100);
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    allKana: [],
    hiragana: [],
    katakana: [],
    userStats: {
      id: 'main',
      currentStreak: 0,
      longestStreak: 0,
      totalReviews: 0,
      totalCorrect: 0,
      totalWrong: 0,
      averageAccuracy: 0,
      totalPracticeDays: 0,
      bestSurvivalScore: 0,
      bestSpeedScore: 0,
    },
    dueCount: 0,
    hiraganaMastery: 0,
    katakanaMastery: 0,
    overallMastery: 0,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      await seedDatabaseIfEmpty();
      const db = await initDB();

      const [allKana, userStats, due] = await Promise.all([
        db.getAll('kana_deck'),
        db.get('user_progress', 'main'),
        getReviewQueue(db),
      ]);

      const hiragana = allKana.filter((k) => k.type === 'hiragana');
      const katakana = allKana.filter((k) => k.type === 'katakana');

      if (!cancelled) {
        setData({
          allKana,
          hiragana,
          katakana,
          userStats: userStats || data.userStats,
          dueCount: due.length,
          hiraganaMastery: calculateMastery(hiragana),
          katakanaMastery: calculateMastery(katakana),
          overallMastery: calculateMastery(allKana),
          loading: false,
        });
      }

      db.close();
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return data;
}
