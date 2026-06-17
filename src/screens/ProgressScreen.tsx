import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { initDB, seedDatabaseIfEmpty } from '../lib/db';
import type { UserStats, Kana } from '../types/kana';

export const ProgressScreen: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [allKana, setAllKana] = useState<Kana[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      await seedDatabaseIfEmpty();
      const db = await initDB();
      const [stats, kana] = await Promise.all([
        db.get('user_progress', 'main'),
        db.getAll('kana_deck'),
      ]);
      if (!cancelled) {
        setUserStats(stats || null);
        setAllKana(kana);
        setLoading(false);
      }
      db.close();
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const totalReviews = userStats?.totalReviews || 0;
  const accuracy = userStats?.averageAccuracy || 0;
  const streak = userStats?.currentStreak || 0;

  const totalPracticeMinutes = Math.round((totalReviews * 8) / 60);
  const hours = Math.floor(totalPracticeMinutes / 60);
  const mins = totalPracticeMinutes % 60;

  const masteredCount = allKana.filter(
    (k) => k.totalCorrect >= 5 && k.totalCorrect > k.totalWrong * 2
  ).length;
  const totalKana = allKana.length || 92;
  const overallMastery = Math.round((masteredCount / totalKana) * 100);

  const calendarDays = generateCalendar(streak);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center flex-1">
          <p className="font-sans text-on-surface-variant">Reading your progress…</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-gutter pt-md pb-xxl flex flex-col gap-xl">
        {/* Page heading */}
        <header className="text-center">
          <h2 className="font-serif text-2xl font-medium text-primary">Progress</h2>
          <p className="font-sans text-[13px] leading-[18px] text-on-surface-variant mt-xs">
            Your kana, over time.
          </p>
        </header>

        {/* Hero: Overall Mastery */}
        <section className="text-center" aria-labelledby="hero-mastery-label">
          <p
            id="hero-mastery-label"
            className="font-sans text-[12px] leading-[16px] font-semibold tracking-[0.08em] text-on-surface-variant uppercase mb-sm"
          >
            Overall Mastery
          </p>
          <p className="font-serif text-[64px] leading-[72px] font-medium text-primary tabular-nums">
            {overallMastery}
            <span className="text-[40px] leading-[48px] text-on-surface-variant align-top ml-1">%</span>
          </p>
          <p className="font-sans text-[14px] leading-[20px] text-on-surface-variant">
            {masteredCount} of {totalKana} kana mastered
          </p>
        </section>

        {/* Supporting metrics: 2-up grid */}
        <section
          className="grid grid-cols-2 gap-md"
          aria-label="Practice totals"
        >
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-md py-sm">
            <div className="flex items-center gap-xs mb-xs">
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">article</span>
              <span className="font-sans text-[10px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant">
                Reviews
              </span>
            </div>
            <p className="font-serif text-[24px] leading-[32px] font-medium text-on-surface tabular-nums">
              {totalReviews.toLocaleString()}
            </p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-md py-sm">
            <div className="flex items-center gap-xs mb-xs">
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">schedule</span>
              <span className="font-sans text-[10px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant">
                Practiced
              </span>
            </div>
            <p className="font-serif text-[24px] leading-[32px] font-medium text-on-surface tabular-nums">
              {hours}h {mins}m
            </p>
          </div>
        </section>

        {/* Mastery Growth */}
        <section
          className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-md"
          aria-labelledby="growth-label"
        >
          <h3
            id="growth-label"
            className="font-sans text-[12px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-md"
          >
            Mastery Growth
          </h3>
          <div className="relative h-32">
            <svg viewBox="0 0 300 120" className="w-full h-full" preserveAspectRatio="none">
              <text x="0" y="15" className="fill-on-surface-variant text-[10px] font-sans">100</text>
              <text x="0" y="45" className="fill-on-surface-variant text-[10px] font-sans">75</text>
              <text x="0" y="75" className="fill-on-surface-variant text-[10px] font-sans">50</text>
              <text x="0" y="105" className="fill-on-surface-variant text-[10px] font-sans">25</text>

              <line x1="30" y1="10" x2="300" y2="10" stroke="currentColor" strokeWidth="0.5" className="text-outline-variant/20" />
              <line x1="30" y1="40" x2="300" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-outline-variant/20" />
              <line x1="30" y1="70" x2="300" y2="70" stroke="currentColor" strokeWidth="0.5" className="text-outline-variant/20" />
              <line x1="30" y1="100" x2="300" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-outline-variant/20" />

              <polyline
                points="30,100 110,80 190,55 270,30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
              />
              <circle cx="30" cy="100" r="3" fill="currentColor" className="text-primary" />
              <circle cx="110" cy="80" r="3" fill="currentColor" className="text-primary" />
              <circle cx="190" cy="55" r="3" fill="currentColor" className="text-primary" />
              <circle cx="270" cy={100 - overallMastery * 0.9} r="3" fill="currentColor" className="text-primary" />
            </svg>
          </div>
          <div className="flex justify-between mt-sm px-1">
            <span className="font-sans text-[10px] text-on-surface-variant">W1</span>
            <span className="font-sans text-[10px] text-on-surface-variant">W2</span>
            <span className="font-sans text-[10px] text-on-surface-variant">W3</span>
            <span className="font-sans text-[10px] text-on-surface-variant">Now</span>
          </div>
        </section>

        {/* Streak + Accuracy side-by-side */}
        <section
          className="grid grid-cols-2 gap-md"
          aria-label="Recent practice"
        >
          {/* Daily Streak */}
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-md">
            <div className="flex items-center gap-1.5 mb-sm">
              <span
                className="material-symbols-outlined text-primary text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
              <span className="font-sans text-[10px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant">
                Streak
              </span>
            </div>
            <p className="font-serif text-[24px] leading-[32px] font-medium text-on-surface tabular-nums mb-sm">
              {streak} <span className="text-[14px] leading-[20px] text-on-surface-variant font-sans">days</span>
            </p>
            <div className="grid grid-cols-7 gap-0.5">
              {calendarDays.flat().map((active, i) => (
                <div
                  key={i}
                  className={`w-full aspect-square rounded-sm ${
                    active ? 'bg-primary' : 'bg-outline-variant/20'
                  }`}
                  aria-label={active ? 'Practiced' : 'Rest day'}
                />
              ))}
            </div>
          </div>

          {/* Accuracy Trend */}
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-md">
            <div className="flex items-center gap-1.5 mb-sm">
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">track_changes</span>
              <span className="font-sans text-[10px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant">
                Accuracy
              </span>
            </div>
            <p className="font-serif text-[24px] leading-[32px] font-medium text-on-surface tabular-nums mb-sm">
              {accuracy}<span className="text-[14px] leading-[20px] text-on-surface-variant font-sans">%</span>
            </p>
            <div className="flex items-end justify-between h-12 gap-1">
              {[65, 72, 82, accuracy].map((value, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary rounded-t"
                  style={{ height: `${Math.max(4, value)}%` }}
                  aria-label={i < 3 ? `Week ${i + 1}: ${value}%` : `Now: ${value}%`}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

function generateCalendar(streak: number): number[][] {
  const weeks: number[][] = [];
  const today = new Date();
  const currentDay = today.getDay();
  let remaining = Math.min(streak, 14);

  for (let w = 0; w < 2; w++) {
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      if (w === 0 && d > currentDay) {
        week.push(0);
      } else if (remaining > 0) {
        week.push(1);
        remaining--;
      } else {
        week.push(0);
      }
    }
    weeks.push(week);
  }
  return weeks;
}
