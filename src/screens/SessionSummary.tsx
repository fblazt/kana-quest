import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import type { Kana } from '../types/kana';

interface LocationState {
  correct: number;
  incorrect: number;
  totalTime: number;
  score: number;
  streak: number;
  mistakes: Record<string, { expected: Kana; actual: string; count: number }>;
}

export const SessionSummary: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  if (!state) {
    return (
      <AppLayout hideBottomNav>
        <div className="flex flex-col items-center justify-center flex-1 px-lg text-center">
          <p className="font-sans text-on-surface-variant mb-4">No session data found.</p>
          <button type="button"            onClick={() => navigate('/dashboard')}
            className="w-full bg-primary text-on-primary font-sans text-[18px] leading-[28px] rounded-xl py-md px-lg shadow-[0_10px_40px_-10px_rgba(24,36,66,0.04)] hover:opacity-90 transition-all flex justify-center items-center gap-sm"
          >
            Go Home
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </AppLayout>
    );
  }

  const { correct, incorrect, totalTime, score, streak, mistakes } = state;
  const total = correct + incorrect;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const avgResponseTime = total > 0 ? (totalTime / total / 1000).toFixed(1) : '0.0';
  const xpGained = score * 10;
  const xpTarget = Math.max(100, xpGained);
  const xpPercent = Math.min(100, Math.round((xpGained / xpTarget) * 100));
  const mistakesList = Object.values(mistakes || {});

  return (
    <AppLayout
      hideBottomNav
      header={
        <header className="px-gutter py-md flex items-center justify-center border-b border-outline-variant bg-surface w-full max-w-container-max sticky top-0 z-10">
          <h1 className="font-sans text-[16px] leading-[24px] font-semibold text-primary">Session Summary</h1>
        </header>
      }
    >
      <div className="flex-1 flex flex-col px-gutter py-xl max-w-container-max mx-auto w-full pb-xxl">
        {/* Completion Message */}
        <section className="text-center mb-xl">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-md">
            <span className="material-symbols-outlined text-primary text-[32px]">check</span>
          </div>
          <h2 className="font-sans text-[12px] leading-[16px] font-semibold tracking-[0.08em] text-on-surface-variant uppercase mb-xs">
            SESSION COMPLETE
          </h2>
          <h3 className="font-serif text-[32px] leading-[40px] font-medium text-primary mb-xs">
            Well done.
          </h3>
          <p className="font-sans text-[16px] leading-[24px] text-on-surface-variant">
            You're making steady progress.
          </p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-3 gap-sm mb-xl w-full">
          <div className="bg-surface border border-outline-variant rounded-xl p-md flex flex-col items-center text-center shadow-[0_10px_40px_-10px_rgba(24,36,66,0.04)]">
            <span className="material-symbols-outlined text-on-surface text-[24px] mb-sm">check_circle</span>
            <div className="text-on-surface-variant font-sans text-[12px] leading-[16px] font-semibold tracking-[0.08em] mb-xs uppercase">
              ACCURACY
            </div>
            <div className="text-primary font-serif text-[24px] leading-[32px] font-medium">{accuracy}%</div>
          </div>
          <div className="bg-surface border border-outline-variant rounded-xl p-md flex flex-col items-center text-center shadow-[0_10px_40px_-10px_rgba(24,36,66,0.04)]">
            <span className="material-symbols-outlined text-on-surface text-[24px] mb-sm">schedule</span>
            <div className="text-on-surface-variant font-sans text-[12px] leading-[16px] font-semibold tracking-[0.08em] mb-xs uppercase">
              AVG. RESPONSE
            </div>
            <div className="text-primary font-serif text-[24px] leading-[32px] font-medium">{avgResponseTime}s</div>
          </div>
          <div className="bg-surface border border-outline-variant rounded-xl p-md flex flex-col items-center text-center shadow-[0_10px_40px_-10px_rgba(24,36,66,0.04)]">
            <span className="material-symbols-outlined text-on-surface text-[24px] mb-sm">local_fire_department</span>
            <div className="text-on-surface-variant font-sans text-[12px] leading-[16px] font-semibold tracking-[0.08em] mb-xs uppercase">
              BEST STREAK
            </div>
            <div className="text-primary font-serif text-[24px] leading-[32px] font-medium">{streak}</div>
          </div>
        </section>

        {/* Mastery Progress (XP) */}
        <section className="bg-surface border border-outline-variant rounded-xl p-lg mb-xl shadow-[0_10px_40px_-10px_rgba(24,36,66,0.04)] w-full">
          <div className="flex justify-between items-end mb-md">
            <h3 className="font-sans text-[16px] leading-[24px] font-semibold text-on-surface">Mastery Progress</h3>
            <span className="font-sans text-[12px] leading-[16px] font-semibold tracking-[0.08em] text-primary uppercase">+{xpGained} XP</span>
          </div>
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mb-sm">
            <div
              className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${xpPercent}%` }}
              role="progressbar"
              aria-valuenow={xpPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Session mastery progress"
            />
          </div>
          <div className="flex justify-between text-[12px] leading-[16px] font-sans text-on-surface-variant">
            <span>{xpGained} / {xpTarget} XP toward next level</span>
            <span>{correct} correct</span>
          </div>
        </section>

        {/* Mistakes List (if any) */}
        {mistakesList.length > 0 && (
          <section className="mb-xl w-full">
            <h3 className="font-sans text-[16px] leading-[24px] font-semibold text-on-surface mb-md">Needs Review</h3>
            <div className="flex flex-col gap-sm">
              {mistakesList.map(({ expected, actual, count }) => (
                <div key={expected.id} className="flex items-center justify-between p-md border-b border-outline-variant/30">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-lg bg-error-container/30 flex items-center justify-center">
                      <span className="font-serif text-[24px] leading-[32px] text-error">{expected.character}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-[16px] leading-[24px] font-medium text-on-surface">{expected.romaji}</span>
                      <span className="font-sans text-[12px] leading-[16px] text-on-surface-variant">You answered: {actual}</span>
                    </div>
                  </div>
                  <span className="font-sans text-[12px] leading-[16px] text-error bg-error-container/50 px-2 py-1 rounded-md">
                    {count}x missed
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex-1"></div>

        {/* Actions */}
        <section className="flex flex-col gap-md mt-xl w-full">
          {mistakesList.length > 0 && (
            <button type="button"className="w-full bg-surface border border-outline-variant text-on-surface font-sans text-[18px] leading-[28px] rounded-xl py-md px-lg shadow-[0_10px_40px_-10px_rgba(24,36,66,0.04)] hover:bg-surface-variant transition-colors flex justify-center items-center gap-sm">
              <span className="material-symbols-outlined text-[20px]">school</span>
              Review Mistakes
            </button>
          )}
          <Link to="/dashboard" className="w-full">
            <button type="button"className="w-full bg-primary text-on-primary font-sans text-[18px] leading-[28px] rounded-xl py-md px-lg shadow-[0_10px_40px_-10px_rgba(24,36,66,0.04)] hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-sm">
              <span className="material-symbols-outlined text-[20px]">home</span>
              Return to Dashboard
            </button>
          </Link>
          <Link to="/practice/mode" className="w-full">
            <button type="button"className="w-full text-primary font-sans text-[18px] leading-[28px] py-md px-lg hover:bg-primary-container/20 rounded-xl transition-colors flex justify-center items-center gap-sm">
              Continue Practice
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </Link>
        </section>
      </div>
    </AppLayout>
  );
};