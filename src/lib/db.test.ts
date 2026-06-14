import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initDB, seedDatabaseIfEmpty } from './db';
import { deleteDB } from 'idb';
import 'fake-indexeddb/auto';

const DB_NAME = 'kana-quest-db';

describe('Database layer', () => {
  beforeEach(async () => {
    await deleteDB(DB_NAME);
  });

  afterEach(async () => {
    await deleteDB(DB_NAME);
  });

  it('should initialize the database with empty stores', async () => {
    const db = await initDB();
    expect(db.objectStoreNames.contains('kana_deck')).toBe(true);
    expect(db.objectStoreNames.contains('user_progress')).toBe(true);
    
    const count = await db.count('kana_deck');
    expect(count).toBe(0);
  });

  it('should seed the database if empty', async () => {
    await seedDatabaseIfEmpty();
    const db = await initDB();
    
    const count = await db.count('kana_deck');
    expect(count).toBeGreaterThan(0); // Should have hiragana and katakana
    
    const stats = await db.get('user_progress', 'main');
    expect(stats).toBeDefined();
    expect(stats?.currentStreak).toBe(0);
  });

  it('should not seed the database twice', async () => {
    await seedDatabaseIfEmpty();
    const db = await initDB();
    const countFirst = await db.count('kana_deck');
    
    await seedDatabaseIfEmpty();
    const countSecond = await db.count('kana_deck');
    
    expect(countFirst).toEqual(countSecond);
  });
});
