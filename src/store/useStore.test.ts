import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './useStore';
import { deleteDB } from 'idb';
import 'fake-indexeddb/auto';

const DB_NAME = 'kana-quest-db';

describe('useAppStore', () => {
  beforeEach(async () => {
    await deleteDB(DB_NAME);
    useAppStore.setState({ isReady: false, userStats: null, activeKana: null });
  });

  it('should have initial state', () => {
    const state = useAppStore.getState();
    expect(state.isReady).toBe(false);
    expect(state.userStats).toBeNull();
  });

  it('initializeApp should set isReady to true and load stats', async () => {
    await useAppStore.getState().initializeApp();
    
    const state = useAppStore.getState();
    expect(state.isReady).toBe(true);
    expect(state.userStats).not.toBeNull();
    expect(state.userStats?.id).toBe('main');
  });
});
