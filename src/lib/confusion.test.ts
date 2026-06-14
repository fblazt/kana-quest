import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initDB, seedDatabaseIfEmpty } from './db';
import { deleteDB } from 'idb';
import 'fake-indexeddb/auto';
import { logConfusionPair, getConfusionPairs, getConfusionPairsForKana } from './confusion';

const DB_NAME = 'kana-quest-db';

describe('Confusion Pair Tracking', () => {
  let db: Awaited<ReturnType<typeof initDB>> | null = null;

  beforeEach(async () => {
    await deleteDB(DB_NAME);
    await seedDatabaseIfEmpty();
    db = await initDB();
  });

  afterEach(async () => {
    db?.close();
    await deleteDB(DB_NAME);
  });

  describe('logConfusionPair', () => {
    it('should create a new confusion pair', async () => {
      await logConfusionPair(db!, 'h-nu', 'h-me');
      
      const pairs = await db!.getAll('confusion_matrix');
      expect(pairs).toHaveLength(1);
      expect(pairs[0].shown).toBe('h-nu');
      expect(pairs[0].answered).toBe('h-me');
      expect(pairs[0].count).toBe(1);
    });

    it('should increment count for existing pair', async () => {
      await logConfusionPair(db!, 'h-nu', 'h-me');
      await logConfusionPair(db!, 'h-nu', 'h-me');
      await logConfusionPair(db!, 'h-nu', 'h-me');
      
      const pairs = await db!.getAll('confusion_matrix');
      expect(pairs).toHaveLength(1);
      expect(pairs[0].count).toBe(3);
    });

    it('should track different pairs separately', async () => {
      await logConfusionPair(db!, 'h-nu', 'h-me');
      await logConfusionPair(db!, 'h-shi', 'h-tsu');
      
      const pairs = await db!.getAll('confusion_matrix');
      expect(pairs).toHaveLength(2);
    });
  });

  describe('getConfusionPairs', () => {
    it('should return pairs sorted by count descending', async () => {
      await logConfusionPair(db!, 'h-nu', 'h-me');
      await logConfusionPair(db!, 'h-nu', 'h-me');
      await logConfusionPair(db!, 'h-shi', 'h-tsu');
      
      const pairs = await getConfusionPairs(db!);
      expect(pairs[0].count).toBe(2);
      expect(pairs[1].count).toBe(1);
    });
  });

  describe('getConfusionPairsForKana', () => {
    it('should return only pairs for specified kana', async () => {
      await logConfusionPair(db!, 'h-nu', 'h-me');
      await logConfusionPair(db!, 'h-nu', 'h-ne');
      await logConfusionPair(db!, 'h-shi', 'h-tsu');
      
      const pairs = await getConfusionPairsForKana(db!, 'h-nu');
      expect(pairs).toHaveLength(2);
      expect(pairs.every(p => p.shown === 'h-nu')).toBe(true);
    });
  });
});
