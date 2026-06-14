import React from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';

export const SessionSummary: React.FC = () => {
  return (
    <AppLayout
      hideBottomNav
      header={
        <header className="w-full flex items-center justify-between px-4 h-14 bg-surface/80 backdrop-blur-md sticky top-0 z-10">
          <div className="w-8 h-8" />
          <h1 className="font-serif text-xl font-medium text-primary">Session Summary</h1>
          <div className="w-8 h-8" />
        </header>
      }
    >
      <div className="flex flex-col px-6 pt-4 pb-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="font-sans text-xs font-semibold tracking-wider uppercase text-on-surface-variant mb-1">
            Session Complete
          </p>
          <h2 className="font-serif text-3xl font-medium text-primary mb-1">
            Well done.
          </h2>
          <p className="font-sans text-sm text-on-surface-variant">
            You're making steady progress.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="flex flex-col items-center p-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary mb-1"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            <span className="font-sans text-lg font-bold text-on-surface">94%</span>
            <span className="font-sans text-[10px] text-on-surface-variant tracking-wider uppercase">Accuracy</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary mb-1"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            <span className="font-sans text-lg font-bold text-on-surface">1.2s</span>
            <span className="font-sans text-[10px] text-on-surface-variant tracking-wider uppercase">Avg. Response</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary mb-1"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>
            <span className="font-sans text-lg font-bold text-on-surface">15</span>
            <span className="font-sans text-[10px] text-on-surface-variant tracking-wider uppercase">Best Streak</span>
          </div>
        </div>

        {/* Mastery Progress */}
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-sm font-semibold text-on-surface">Mastery Progress</span>
            <span className="font-sans text-xs text-primary font-semibold">+45 XP</span>
          </div>
          <div className="w-full h-2 bg-outline-variant/30 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-primary rounded-full" style={{ width: '65%' }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-on-surface-variant">Level 4 • 65%</span>
            <span className="font-sans text-xs text-on-surface-variant">1420 / 2000 XP</span>
          </div>
        </div>

        {/* Insights */}
        <div className="mb-6">
          <h3 className="font-sans text-sm font-semibold text-on-surface mb-3">Insights</h3>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-on-surface">Mastered Today</p>
              <div className="flex gap-1 mt-1">
                <span className="font-serif text-lg">け</span>
                <span className="font-serif text-lg">こ</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-error"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-on-surface">Needs Review</p>
              <div className="flex gap-1 mt-1">
                <span className="font-serif text-lg">さ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confusion Pairs */}
        <div className="mb-8">
          <h3 className="font-sans text-sm font-semibold text-on-surface mb-3">Confusion Pairs</h3>
          <div className="flex items-center justify-center gap-4 p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
            <span className="font-serif text-3xl text-primary">あ</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-on-surface-variant">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span className="font-serif text-3xl text-secondary">お</span>
          </div>
          <p className="font-sans text-xs text-on-surface-variant text-center mt-2">
            Pay close attention to the loops.
          </p>
        </div>

        {/* Continue */}
        <Link to="/" className="w-full">
          <button className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-sans font-medium py-3.5 px-6 rounded-xl transition-colors hover:bg-primary-container hover:text-on-primary-container">
            Continue Practice
            <span className="text-lg">→</span>
          </button>
        </Link>
      </div>
    </AppLayout>
  );
};
