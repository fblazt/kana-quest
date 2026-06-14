import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Kana, ConfusionPair, UserStats } from '../types/kana';
import { kanaSeed } from '../data/kanaSeed';

interface KanaQuestDB extends DBSchema {
  kana_deck: {
    key: string;
    value: Kana;
    indexes: { 'by-nextReview': number, 'by-type': string };
  };
  confusion_matrix: {
    key: string;
    value: ConfusionPair;
  };
  user_progress: {
    key: string;
    value: UserStats;
  };
}

const DB_NAME = 'kana-quest-db';
const DB_VERSION = 1;

export const initDB = async (): Promise<IDBPDatabase<KanaQuestDB>> => {
  return await openDB<KanaQuestDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('kana_deck')) {
        const kanaStore = db.createObjectStore('kana_deck', { keyPath: 'id' });
        kanaStore.createIndex('by-nextReview', 'nextReview');
        kanaStore.createIndex('by-type', 'type');
      }
      if (!db.objectStoreNames.contains('confusion_matrix')) {
        db.createObjectStore('confusion_matrix', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('user_progress')) {
        db.createObjectStore('user_progress', { keyPath: 'id' });
      }
    },
  });
};

export const seedDatabaseIfEmpty = async () => {
  const db = await initDB();
  const count = await db.count('kana_deck');
  if (count === 0) {
    const tx = db.transaction('kana_deck', 'readwrite');
    for (const kana of kanaSeed) {
      await tx.store.add(kana);
    }
    await tx.done;
  }
  
  const statsCount = await db.count('user_progress');
  if (statsCount === 0) {
    await db.put('user_progress', {
      id: 'main',
      currentStreak: 0,
      longestStreak: 0,
      totalReviews: 0,
      totalCorrect: 0,
      totalWrong: 0,
      averageAccuracy: 0,
      totalPracticeDays: 0,
      bestSurvivalScore: 0,
      bestSpeedScore: 0
    });
  }
};
