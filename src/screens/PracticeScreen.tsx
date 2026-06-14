import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { KanaCard } from '../components/ui/KanaCard';

const mockKana = {
  id: 'h-a', character: 'あ', romaji: 'a', type: 'hiragana' as const,
  totalCorrect: 0, totalWrong: 0, repetitions: 0, interval: 0, easeFactor: 2.5, nextReview: 0, averageResponseTime: 0
};

export const PracticeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppLayout
      hideBottomNav
      header={
        <header className="w-full flex items-center justify-between px-4 h-14 bg-surface/80 backdrop-blur-md sticky top-0 z-10">
          <button
            onClick={() => navigate('/')}
            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Close practice"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/></svg>
              <span className="font-sans text-sm font-semibold text-on-surface">12</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-sm font-semibold text-on-surface">14/40</span>
            </div>
          </div>
        </header>
      }
    >
      <div className="flex flex-col items-center justify-center flex-1 px-6">
        {/* Kana Card */}
        <div className="mb-10">
          <KanaCard kana={mockKana} />
        </div>

        {/* Input */}
        <div className="w-full max-w-xs">
          <input
            type="text"
            placeholder="Type romaji..."
            className="w-full text-center text-2xl font-sans py-4 bg-transparent border-b-2 border-outline focus:border-primary outline-none transition-colors duration-300 text-on-surface"
            autoFocus
          />
          <p className="text-center font-sans text-xs text-on-surface-variant mt-3">
            Press Enter to submit
          </p>
        </div>
      </div>
    </AppLayout>
  );
};
