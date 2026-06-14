import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initDB, seedDatabaseIfEmpty } from './db';
import { deleteDB } from 'idb';
import 'fake-indexeddb/auto';
import {
  getReviewQueue,
  getWeakKana,
  getNewKana,
  calculateNextInterval,
  calculateEaseFactor,
  updateKanaStats,
} from './srs';
import type { Kana } from '../types/kana';

const DB_NAME = 'kana-quest-db';

describe('SRS Algorithm', () => {
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

  describe('calculateNextInterval', () => {
    it('should return first interval on incorrect answer', () => {
      const kana = createMockKana({ repetitions: 3, interval: 86400000 });
      const interval = calculateNextInterval(kana, false);
      expect(interval).toBe(5 * 60 * 1000); // 5 min
    });

    it('should return next interval on correct answer', () => {
      const kana = createMockKana({ repetitions: 0 });
      const interval = calculateNextInterval(kana, true);
      expect(interval).toBe(30 * 60 * 1000); // 30 min
    });

    it('should cap at maximum interval', () => {
      const kana = createMockKana({ repetitions: 6 });
      const interval = calculateNextInterval(kana, true);
      expect(interval).toBe(30 * 24 * 60 * 60 * 1000); // 30 days
    });
  });

  describe('calculateEaseFactor', () => {
    it('should increase ease factor on correct answer', () => {
      const kana = createMockKana({ easeFactor: 2.5 });
      const ef = calculateEaseFactor(kana, true);
      expect(ef).toBeCloseTo(2.6);
    });

    it('should decrease ease factor on incorrect answer', () => {
      const kana = createMockKana({ easeFactor: 2.5 });
      const ef = calculateEaseFactor(kana, false);
      expect(ef).toBeCloseTo(2.3);
    });

    it('should cap ease factor at 3.0', () => {
      const kana = createMockKana({ easeFactor: 2.95 });
      const ef = calculateEaseFactor(kana, true);
      expect(ef).toBe(3.0);
    });

    it('should floor ease factor at 1.3', () => {
      const kana = createMockKana({ easeFactor: 1.35 });
      const ef = calculateEaseFactor(kana, false);
      expect(ef).toBe(1.3);
    });
  });

  describe('updateKanaStats', () => {
    it('should increment totalCorrect on correct answer', async () => {
      const kana = createMockKana({ id: 'h-a', totalCorrect: 0, totalWrong: 0 });
      await db!.put('kana_deck', kana);
      
      await updateKanaStats(db!, 'h-a', true, 1000);
      
      const updated = await db!.get('kana_deck', 'h-a');
      expect(updated?.totalCorrect).toBe(1);
      expect(updated?.totalWrong).toBe(0);
      expect(updated?.repetitions).toBe(1);
    });

    it('should increment totalWrong on incorrect answer', async () => {
      const kana = createMockKana({ id: 'h-a', totalCorrect: 0, totalWrong: 0 });
      await db!.put('kana_deck', kana);
      
      await updateKanaStats(db!, 'h-a', false, 2000);
      
      const updated = await db!.get('kana_deck', 'h-a');
      expect(updated?.totalCorrect).toBe(0);
      expect(updated?.totalWrong).toBe(1);
      expect(updated?.repetitions).toBe(0);
    });

    it('should update averageResponseTime', async () => {
      const kana = createMockKana({ id: 'h-a', totalCorrect: 1, totalWrong: 0, averageResponseTime: 1000 });
      await db!.put('kana_deck', kana);
      
      await updateKanaStats(db!, 'h-a', true, 2000);
      
      const updated = await db!.get('kana_deck', 'h-a');
      expect(updated?.averageResponseTime).toBe(1500); // (1000 + 2000) / 2
    });

    it('should set nextReview in the future', async () => {
      const kana = createMockKana({ id: 'h-a', totalCorrect: 0, totalWrong: 0 });
      await db!.put('kana_deck', kana);
      
      await updateKanaStats(db!, 'h-a', true, 1000);
      
      const updated = await db!.get('kana_deck', 'h-a');
      expect(updated?.nextReview).toBeGreaterThan(Date.now());
    });
  });

  describe('getReviewQueue', () => {
    it('should return kana that are due for review', async () => {
      // Clear existing seeded data
      const tx = db!.transaction('kana_deck', 'readwrite');
      await tx.store.clear();
      await tx.done;
      
      const now = Date.now();
      const kana1 = createMockKana({ id: 'h-a', type: 'hiragana', nextReview: now - 1000 });
      const kana2 = createMockKana({ id: 'h-i', type: 'hiragana', nextReview: now + 100000 });
      await db!.put('kana_deck', kana1);
      await db!.put('kana_deck', kana2);
      
      const queue = await getReviewQueue(db!);
      expect(queue).toHaveLength(1);
      expect(queue[0].id).toBe('h-a');
    });

    it('should filter by type when specified', async () => {
      // Clear existing seeded data
      const tx = db!.transaction('kana_deck', 'readwrite');
      await tx.store.clear();
      await tx.done;
      
      const now = Date.now();
      const kana1 = createMockKana({ id: 'h-a', type: 'hiragana', nextReview: now - 1000 });
      const kana2 = createMockKana({ id: 'k-a', type: 'katakana', nextReview: now - 1000 });
      await db!.put('kana_deck', kana1);
      await db!.put('kana_deck', kana2);
      
      const queue = await getReviewQueue(db!, 'hiragana');
      expect(queue).toHaveLength(1);
      expect(queue[0].id).toBe('h-a');
    });
  });

  describe('getWeakKana', () => {
    it('should return kana sorted by accuracy ascending', async () => {
      // Clear existing seeded data
      const tx = db!.transaction('kana_deck', 'readwrite');
      await tx.store.clear();
      await tx.done;
      
      const kana1 = createMockKana({ id: 'h-a', type: 'hiragana', totalCorrect: 10, totalWrong: 0 });
      const kana2 = createMockKana({ id: 'h-i', type: 'hiragana', totalCorrect: 2, totalWrong: 8 });
      await db!.put('kana_deck', kana1);
      await db!.put('kana_deck', kana2);
      
      const weak = await getWeakKana(db!);
      expect(weak[0].id).toBe('h-i');
      expect(weak[1].id).toBe('h-a');
    });
  });

  describe('getNewKana', () => {
    it('should return kana with no reviews', async () => {
      // Clear existing seeded data
      const tx = db!.transaction('kana_deck', 'readwrite');
      await tx.store.clear();
      await tx.done;
      
      const kana1 = createMockKana({ id: 'h-a', type: 'hiragana', totalCorrect: 0, totalWrong: 0 });
      const kana2 = createMockKana({ id: 'h-i', type: 'hiragana', totalCorrect: 1, totalWrong: 0 });
      await db!.put('kana_deck', kana1);
      await db!.put('kana_deck', kana2);
      
      const newKana = await getNewKana(db!);
      expect(newKana).toHaveLength(1);
      expect(newKana[0].id).toBe('h-a');
    });
  });
});

function createMockKana(overrides: Partial<Kana> = {}): Kana {
  return {
    id: 'h-a',
    character: 'あ',
    romaji: 'a',
    type: 'hiragana',
    totalCorrect: 0,
    totalWrong: 0,
    repetitions: 0,
    interval: 0,
    easeFactor: 2.5,
    nextReview: 0,
    averageResponseTime: 0,
    ...overrides,
  };
}
