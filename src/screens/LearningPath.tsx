import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { initDB, seedDatabaseIfEmpty } from '../lib/db';
import type { Kana } from '../types/kana';

interface KanaGroup {
  name: string;
  characters: string[];
  romaji: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  status: 'mastered' | 'current' | 'locked';
  mastery: number;
}

const learningPathGroups: Omit<KanaGroup, 'status' | 'mastery'>[] = [
  { name: 'Vowels', characters: ['あ', 'い', 'う', 'え', 'お'], romaji: ['a', 'i', 'u', 'e', 'o'], difficulty: 'Easy' },
  { name: 'K-Group', characters: ['か', 'き', 'く', 'け', 'こ'], romaji: ['ka', 'ki', 'ku', 'ke', 'ko'], difficulty: 'Easy' },
  { name: 'S-Group', characters: ['さ', 'し', 'す', 'せ', 'そ'], romaji: ['sa', 'shi', 'su', 'se', 'so'], difficulty: 'Medium' },
  { name: 'T-Group', characters: ['た', 'ち', 'つ', 'て', 'と'], romaji: ['ta', 'chi', 'tsu', 'te', 'to'], difficulty: 'Medium' },
  { name: 'N-Group', characters: ['な', 'に', 'ぬ', 'ね', 'の'], romaji: ['na', 'ni', 'nu', 'ne', 'no'], difficulty: 'Medium' },
  { name: 'H-Group', characters: ['は', 'ひ', 'ふ', 'へ', 'ほ'], romaji: ['ha', 'hi', 'fu', 'he', 'ho'], difficulty: 'Hard' },
  { name: 'M-Group', characters: ['ま', 'み', 'む', 'め', 'も'], romaji: ['ma', 'mi', 'mu', 'me', 'mo'], difficulty: 'Hard' },
];

function calculateGroupMastery(characters: string[], allKana: Kana[]): number {
  const groupKana = allKana.filter((k) => characters.includes(k.character));
  if (groupKana.length === 0) return 0;
  const mastered = groupKana.filter(
    (k) => k.totalCorrect >= 5 && k.totalCorrect > k.totalWrong * 2
  ).length;
  return Math.round((mastered / groupKana.length) * 100);
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    Easy: 'bg-primary/10 text-primary',
    Medium: 'bg-tertiary/10 text-tertiary',
    Hard: 'bg-secondary/10 text-secondary',
    Expert: 'bg-error/10 text-error',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold ${colors[difficulty] || ''}`}>
      {difficulty}
    </span>
  );
}

export const LearningPath: React.FC = () => {
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

  const learningPath: KanaGroup[] = learningPathGroups.map((group, index) => {
    const mastery = calculateGroupMastery(group.characters, allKana);
    let status: KanaGroup['status'] = 'locked';

    if (index === 0) {
      status = mastery >= 90 ? 'mastered' : 'current';
    } else {
      const prevGroup = learningPathGroups[index - 1];
      const prevMastery = calculateGroupMastery(prevGroup.characters, allKana);
      if (prevMastery >= 90) {
        status = mastery >= 90 ? 'mastered' : 'current';
      }
    }

    return { ...group, status, mastery };
  });

  const masteredCount = learningPath.filter((g) => g.status === 'mastered').length;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center flex-1">
          <p className="font-sans text-on-surface-variant">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-6 pt-4 pb-6">
        <h2 className="font-serif text-xl font-medium text-primary text-center mb-1">
          Hiragana Path
        </h2>
        <p className="font-sans text-sm text-on-surface-variant text-center mb-1">
          Master the foundations. Follow the path to unlock new characters.
        </p>
        <p className="font-sans text-xs text-on-surface-variant text-center mb-8">
          {masteredCount} / {learningPath.length} Mastered
        </p>

        {/* Learning Path */}
        <div className="relative flex flex-col items-center">
          {learningPath.map((group, index) => (
            <React.Fragment key={group.name}>
              {/* Connector line */}
              {index > 0 && (
                <div className={`w-0.5 h-8 ${
                  group.status === 'locked' ? 'border-l border-dashed border-outline-variant/40' : 'bg-outline-variant/40'
                }`} />
              )}
              
              {/* Node */}
              <div className={`w-full max-w-sm p-4 rounded-xl border transition-all ${
                group.status === 'mastered'
                  ? 'bg-primary/10 border-primary/30'
                  : group.status === 'current'
                  ? 'bg-surface-container-lowest border-primary shadow-[0_0_0_3px_rgba(24,36,66,0.1)]'
                  : 'bg-surface-container-lowest border-outline-variant/30 opacity-60'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      group.status === 'mastered'
                        ? 'bg-primary text-on-primary border-primary'
                        : group.status === 'current'
                        ? 'bg-surface-container-lowest text-primary border-primary'
                        : 'bg-surface-container-lowest text-on-surface-variant/40 border-outline-variant/30'
                    }`}>
                      <span className="font-serif text-lg">{group.characters[0]}</span>
                    </div>
                    <div>
                      <p className={`font-sans text-sm font-semibold ${
                        group.status === 'locked' ? 'text-on-surface-variant/40' : 'text-on-surface'
                      }`}>
                        {group.name}
                      </p>
                      <p className="font-sans text-xs text-on-surface-variant">
                        {group.romaji.join('-')} · {group.mastery}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {group.status === 'locked' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-on-surface-variant/40"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                    ) : (
                      <>
                        {group.status === 'mastered' && (
                          <span className="px-2 py-0.5 bg-primary text-on-primary text-[10px] font-sans font-semibold tracking-wider uppercase rounded-full">
                            MASTERED
                          </span>
                        )}
                        <DifficultyBadge difficulty={group.difficulty} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};
