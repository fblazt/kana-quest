import React from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { MasteryGauge } from '../components/ui/MasteryGauge';
import { useDashboardData } from '../hooks/useDashboardData';

export const Dashboard: React.FC = () => {
  const { userStats, hiraganaMastery, katakanaMastery, overallMastery, dueCount, loading } = useDashboardData();

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
      <div className="flex flex-col items-center px-6 pt-4 pb-6">
        {/* Streak */}
        <div className="flex items-center gap-2 mb-6 px-4 py-1.5 bg-secondary-container/40 rounded-full">
          <span className="text-sm">🔥</span>
          <span className="font-sans text-sm font-semibold text-on-surface">
            {userStats.currentStreak} Day Streak
          </span>
        </div>

        {/* Mastery Gauge */}
        <div className="mb-8">
          <MasteryGauge percentage={overallMastery} />
        </div>

        {/* Daily Review Count */}
        {dueCount > 0 && (
          <p className="font-sans text-xs text-on-surface-variant mb-4">
            {dueCount} kana due for review today
          </p>
        )}

        {/* Continue Practice */}
        <Link to="/practice/mode" className="w-full max-w-sm mb-4">
          <button className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-sans font-medium py-3.5 px-6 rounded-xl transition-colors hover:bg-primary-container hover:text-on-primary-container">
            Continue Practice
            <span className="text-lg">→</span>
          </button>
        </Link>

        {/* Speed & Survival */}
        <div className="flex gap-3 w-full max-w-sm mb-8">
          <Link to="/practice?mode=speed" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 border border-outline text-on-surface font-sans font-medium py-3 px-4 rounded-xl transition-colors hover:bg-surface-variant">
              <span className="text-base">⚡</span>
              Speed
            </button>
          </Link>
          <Link to="/practice?mode=survival" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 border border-outline text-on-surface font-sans font-medium py-3 px-4 rounded-xl transition-colors hover:bg-surface-variant">
              <span className="text-base">♥</span>
              Survival
            </button>
          </Link>
        </div>

        {/* Kana Progress Cards */}
        <div className="flex gap-3 w-full max-w-sm">
          <div className="flex-1 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-serif text-2xl text-primary">あ</span>
              <p className="font-sans text-[11px] font-semibold tracking-wider uppercase text-on-surface-variant">
                HIRAGANA
              </p>
            </div>
            <p className="font-sans text-lg font-bold text-on-surface">{hiraganaMastery}% <span className="text-sm font-normal text-on-surface-variant">Learned</span></p>
            <div className="mt-2 h-1.5 bg-outline-variant/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${hiraganaMastery}%` }} />
            </div>
          </div>
          <div className="flex-1 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-serif text-2xl text-primary">ア</span>
              <p className="font-sans text-[11px] font-semibold tracking-wider uppercase text-on-surface-variant">
                KATAKANA
              </p>
            </div>
            <p className="font-sans text-lg font-bold text-on-surface">{katakanaMastery}% <span className="text-sm font-normal text-on-surface-variant">Learned</span></p>
            <div className="mt-2 h-1.5 bg-outline-variant/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${katakanaMastery}%` }} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
