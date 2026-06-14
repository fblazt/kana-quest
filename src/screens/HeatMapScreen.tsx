import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { initDB, seedDatabaseIfEmpty } from '../lib/db';
import type { Kana } from '../types/kana';

function getMasteryColor(mastery: number, total: number): string {
  if (total === 0) return 'bg-outline-variant/20 text-on-surface-variant';
  if (mastery >= 80) return 'bg-[#8FBC8F] text-white';
  if (mastery >= 50) return 'bg-[#BDB76B] text-white';
  if (mastery > 0) return 'bg-[#E8A0A0] text-white';
  return 'bg-outline-variant/20 text-on-surface-variant';
}

function calculateMastery(kana: Kana): number {
  const total = kana.totalCorrect + kana.totalWrong;
  if (total === 0) return 0;
  return Math.round((kana.totalCorrect / total) * 100);
}

export const HeatMapScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [allKana, setAllKana] = useState<Kana[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      await seedDatabaseIfEmpty();
      const db = await initDB();
      const kana = await db.getAll('kana_deck');
      if (!cancelled) {
        setAllKana(kana);
        setLoading(false);
      }
      db.close();
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const data = allKana
    .filter((k) => k.type === activeTab)
    .sort((a, b) => {
      const order = 'aiueo';
      const rowA = order.indexOf(a.romaji[0]);
      const rowB = order.indexOf(b.romaji[0]);
      if (rowA !== rowB) return rowA - rowB;
      return a.romaji.localeCompare(b.romaji);
    });

  return (
    <AppLayout>
      <div className="px-6 pt-4 pb-6">
        <h2 className="font-serif text-2xl font-medium text-primary text-center mb-2">Heat Map</h2>
        <p className="font-sans text-xs text-on-surface-variant text-center mb-4">
          {activeTab === 'hiragana' ? 'Hiragana' : 'Katakana'} mastery overview
        </p>

        {/* Tab Switcher */}
        <div className="flex bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab('hiragana')}
            className={`flex-1 py-2 rounded-lg font-sans text-sm font-medium transition-colors ${
              activeTab === 'hiragana'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Hiragana
          </button>
          <button
            onClick={() => setActiveTab('katakana')}
            className={`flex-1 py-2 rounded-lg font-sans text-sm font-medium transition-colors ${
              activeTab === 'katakana'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Katakana
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#8FBC8F]" />
            <span className="font-sans text-[10px] text-on-surface-variant">Mastered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#BDB76B]" />
            <span className="font-sans text-[10px] text-on-surface-variant">Learning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#E8A0A0]" />
            <span className="font-sans text-[10px] text-on-surface-variant">Weak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-outline-variant/20" />
            <span className="font-sans text-[10px] text-on-surface-variant">New</span>
          </div>
        </div>

        {/* Heat Map Grid */}
        {loading ? (
          <p className="font-sans text-on-surface-variant text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {data.map((kana) => {
              const mastery = calculateMastery(kana);
              return (
                <div
                  key={kana.id}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center ${getMasteryColor(mastery, kana.totalCorrect + kana.totalWrong)} transition-transform hover:scale-110 cursor-default`}
                  title={`${kana.character} ${kana.romaji}: ${mastery}%`}
                >
                  <span className="font-serif text-lg leading-none">{kana.character}</span>
                  <span className="font-sans text-[8px] opacity-80 leading-none mt-0.5">{kana.romaji}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};
