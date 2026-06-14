import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initDB, seedDatabaseIfEmpty } from './db';
import { deleteDB } from 'idb';
import 'fake-indexeddb/auto';

const DB_NAME = 'kana-quest-db';

describe('Database layer', () => {
  let dbConnections: Awaited<ReturnType<typeof initDB>>[] = [];

  beforeEach(async () => {
    await deleteDB(DB_NAME);
    dbConnections = [];
  });

  afterEach(async () => {
    dbConnections.forEach(db => db.close());
    await deleteDB(DB_NAME);
  });

  it('should initialize the database with empty stores', async () => {
    const db = await initDB();
    dbConnections.push(db);
    expect(db.objectStoreNames.contains('kana_deck')).toBe(true);
    expect(db.objectStoreNames.contains('user_progress')).toBe(true);
    
    const count = await db.count('kana_deck');
    expect(count).toBe(0);
  });

  it('should seed the database if empty', async () => {
    await seedDatabaseIfEmpty();
    const db = await initDB();
    dbConnections.push(db);
    
    const count = await db.count('kana_deck');
    expect(count).toBeGreaterThan(0); // Should have hiragana and katakana
    
    const stats = await db.get('user_progress', 'main');
    expect(stats).toBeDefined();
    expect(stats?.currentStreak).toBe(0);
  });

  it('should not seed the database twice', async () => {
    await seedDatabaseIfEmpty();
    
    const dbFirst = await initDB();
    dbConnections.push(dbFirst);
    const countFirst = await dbFirst.count('kana_deck');
    
    await seedDatabaseIfEmpty();
    
    const dbSecond = await initDB();
    dbConnections.push(dbSecond);
    const countSecond = await dbSecond.count('kana_deck');
    
    expect(countFirst).toEqual(countSecond);
  });
});
