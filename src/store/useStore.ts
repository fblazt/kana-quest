import { create } from 'zustand';
import { initDB, seedDatabaseIfEmpty } from '../lib/db';
import type { Kana, UserStats } from '../types/kana';

interface AppState {
  isReady: boolean;
  userStats: UserStats | null;
  activeKana: Kana | null;
  
  // Actions
  initializeApp: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  isReady: false,
  userStats: null,
  activeKana: null,

  initializeApp: async () => {
    await seedDatabaseIfEmpty();
    const db = await initDB();
    const stats = await db.get('user_progress', 'main');
    set({ isReady: true, userStats: stats || null });
  }
}));
