import { create } from 'zustand';
import { initDB, seedDatabaseIfEmpty } from '../lib/db';
import type { Kana, UserStats } from '../types/kana';

interface AppState {
  isReady: boolean;
  userStats: UserStats | null;
  activeKana: Kana | null;
  theme: 'light' | 'dark';
  soundEffects: boolean;

  // Actions
  initializeApp: () => Promise<void>;
  toggleTheme: () => void;
  toggleSoundEffects: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isReady: false,
  userStats: null,
  activeKana: null,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') ||
         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  soundEffects: localStorage.getItem('soundEffects') !== 'false',

  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),

  toggleSoundEffects: () => set((state) => {
    const next = !state.soundEffects;
    localStorage.setItem('soundEffects', String(next));
    return { soundEffects: next };
  }),

  initializeApp: async () => {
    await seedDatabaseIfEmpty();
    const db = await initDB();
    const stats = await db.get('user_progress', 'main');

    // Apply initial theme
    const theme = useAppStore.getState().theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    set({ isReady: true, userStats: stats || null });
  }
}));
