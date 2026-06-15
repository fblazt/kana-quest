import React from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { MasteryGauge } from '../components/ui/MasteryGauge';
import { useDashboardData } from '../hooks/useDashboardData';

export const Dashboard: React.FC = () => {
  const { userStats, hiraganaMastery, katakanaMastery, overallMastery, loading } = useDashboardData();

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
      <div className="flex flex-col items-center text-center gap-md px-lg pt-8 pb-xxl w-full">
        {/* Hero / Progress Section */}
        <section className="flex flex-col items-center text-center gap-md w-full">
          <div className="flex items-center gap-sm text-on-surface-variant font-sans text-[12px] leading-[16px] font-semibold tracking-[0.08em] uppercase">
            <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
            <span>{userStats.currentStreak} Day Streak</span>
          </div>

          {/* Thin Stroke Progress Ring (MasteryGauge) */}
          <div className="relative w-48 h-48 flex items-center justify-center mt-md">
            <MasteryGauge percentage={overallMastery} size={192} strokeWidth={2} />
          </div>
        </section>

        {/* Actions Section */}
        <section className="flex flex-col gap-md mt-sm w-full">
          <Link to="/practice/mode" className="w-full">
            <button className="w-full bg-primary text-on-primary font-sans text-[18px] leading-[28px] rounded-xl py-md px-lg shadow-[0_10px_40px_-10px_rgba(24,36,66,0.04)] hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-sm">
              Continue Practice
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </Link>
          <div className="grid grid-cols-2 gap-md w-full">
            <Link to="/practice?mode=speed" className="w-full">
              <button className="w-full border border-outline-variant text-on-surface font-sans text-[16px] leading-[24px] rounded-xl py-sm px-md flex items-center justify-center gap-xs hover:bg-surface-variant/50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                Speed
              </button>
            </Link>
            <Link to="/practice?mode=survival" className="w-full">
              <button className="w-full border border-outline-variant text-on-surface font-sans text-[16px] leading-[24px] rounded-xl py-sm px-md flex items-center justify-center gap-xs hover:bg-surface-variant/50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">favorite</span>
                Survival
              </button>
            </Link>
          </div>
        </section>

        {/* Kana Cards (Bento Grid Style) */}
        <section className="grid grid-cols-2 gap-md mt-sm w-full text-left">
          {/* Hiragana Card */}
          <div className="bg-surface border border-surface-variant rounded-xl p-lg flex flex-col justify-between shadow-[0_10px_40px_-10px_rgba(24,36,66,0.04)] hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5 text-[80px] font-serif leading-none text-primary select-none pointer-events-none">あ</div>
            <div>
              <h3 className="font-sans text-[12px] leading-[16px] font-semibold tracking-[0.08em] text-on-surface-variant mb-xs uppercase">HIRAGANA</h3>
              <p className="font-sans text-[16px] leading-[24px] text-primary">{hiraganaMastery}% Learned</p>
            </div>
            <div className="mt-lg w-full bg-surface-variant h-1 rounded-full overflow-hidden relative z-10">
              <div className="bg-primary h-full rounded-full" style={{ width: `${hiraganaMastery}%` }}></div>
            </div>
          </div>
          
          {/* Katakana Card */}
          <div className="bg-surface border border-surface-variant rounded-xl p-lg flex flex-col justify-between shadow-[0_10px_40px_-10px_rgba(24,36,66,0.04)] hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5 text-[80px] font-serif leading-none text-primary select-none pointer-events-none">ア</div>
            <div>
              <h3 className="font-sans text-[12px] leading-[16px] font-semibold tracking-[0.08em] text-on-surface-variant mb-xs uppercase">KATAKANA</h3>
              <p className="font-sans text-[16px] leading-[24px] text-primary">{katakanaMastery}% Learned</p>
            </div>
            <div className="mt-lg w-full bg-surface-variant h-1 rounded-full overflow-hidden relative z-10">
              <div className="bg-primary h-full rounded-full" style={{ width: `${katakanaMastery}%` }}></div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};
