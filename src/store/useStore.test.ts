import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './useStore';
import { deleteDB } from 'idb';
import 'fake-indexeddb/auto';

const DB_NAME = 'kana-quest-db';

describe('useAppStore', () => {
  beforeEach(async () => {
    // Avoid deleteDB in every test if it's causing issues
    useAppStore.setState({ isReady: false, userStats: null, activeKana: null, theme: 'light' });
  });

  it('should have initial state', () => {
    const state = useAppStore.getState();
    expect(state.isReady).toBe(false);
    expect(state.userStats).toBeNull();
  });

  it('initializeApp should set isReady to true and load stats', async () => {
    await deleteDB(DB_NAME);
    await useAppStore.getState().initializeApp();
    
    const state = useAppStore.getState();
    expect(state.isReady).toBe(true);
    expect(state.userStats).not.toBeNull();
    expect(state.userStats?.id).toBe('main');
  });

  describe('theme management', () => {
    beforeEach(() => {
      localStorage.clear();
      document.documentElement.classList.remove('dark');
    });

    it('should have a default theme (light or based on system)', () => {
      const state = useAppStore.getState();
      expect(['light', 'dark']).toContain(state.theme);
    });

    it('toggleTheme should switch theme and update DOM/localStorage', () => {
      const initialTheme = useAppStore.getState().theme;
      const expectedNewTheme = initialTheme === 'light' ? 'dark' : 'light';

      useAppStore.getState().toggleTheme();

      const state = useAppStore.getState();
      expect(state.theme).toBe(expectedNewTheme);
      expect(localStorage.getItem('theme')).toBe(expectedNewTheme);
      
      if (expectedNewTheme === 'dark') {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      } else {
        expect(document.documentElement.classList.contains('dark')).toBe(false);
      }
    });

    it('toggleTheme should switch back and forth', () => {
      const initialTheme = useAppStore.getState().theme;
      
      useAppStore.getState().toggleTheme();
      useAppStore.getState().toggleTheme();

      expect(useAppStore.getState().theme).toBe(initialTheme);
    });
  });
});
