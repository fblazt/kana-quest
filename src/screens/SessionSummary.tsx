import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import type { SessionStats } from '../store/usePracticeStore';

interface LocationState extends SessionStats {
  totalTime: number;
  score: number;
}

const CONFUSION_TIPS: Record<string, string> = {
  'nu': 'Watch the loop at the bottom — ぬ has one loop, め has two.',
  'me': 'め has two loops, め has one loop at the bottom.',
  'ha': 'は has a vertical stroke on the right, ほ has a horizontal line through it.',
  'ho': 'ほ has a horizontal line through the right side, は does not.',
  'shi': 'シ points up-right, つ is a single curved stroke.',
  'tsu': 'ツ points up, シ points up-right.',
  'so': 'ソ drops down-right, ん drops down-left.',
  'n': 'ン drops down-left, ソ drops down-right.',
  'ra': 'ら has a short vertical stroke, り has two vertical strokes.',
  'ri': 'り has two vertical strokes, ら has one.',
  'a': 'あ has a cross shape, お has a dot on the top right.',
  'o': 'お has a dot on the top right, あ does not.',
};

function getConfusionTip(shown: string, _answered: string): string {
  const kanaChar = shown.replace(/^[a-z]-/, '');
  const pairs: Record<string, string[]> = {
    'あ': ['お'], 'お': ['あ'],
    'は': ['ほ'], 'ほ': ['は'],
    'し': ['つ'], 'ツ': ['シ'],
    'ソ': ['ン'], 'ン': ['ソ'],
    'ぬ': ['め'], 'め': ['ぬ'],
    'ら': ['り'], 'り': ['ら'],
  };
  
  const kana = pairs[kanaChar];
  if (kana) {
    for (const [key, tip] of Object.entries(CONFUSION_TIPS)) {
      if (kanaChar === key || kana.includes(key)) {
        return tip;
      }
    }
  }
  
  return 'Pay close attention to the strokes.';
}

export const SessionSummary: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;

  const accuracy = state && state.totalAnswered > 0
    ? Math.round((state.totalCorrect / state.totalAnswered) * 100)
    : 0;
  
  const avgResponse = state && state.totalCorrect > 0
    ? (state.totalTime / state.totalAnswered / 1000).toFixed(1)
    : '0.0';
  
  const maxStreak = state?.maxStreak || 0;
  const xpEarned = state ? Math.round(state.totalCorrect * 3 + state.maxStreak * 2) : 0;
  
  const masteredKana = state?.masteredKana || [];
  const confusedPairs = state?.confusedPairs || [];
  
  const uniqueConfused = confusedPairs.reduce<{ shown: string; answered: string; count: number }[]>((acc, pair) => {
    const existing = acc.find(a => a.shown === pair.shown && a.answered === pair.answered);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ ...pair, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => b.count - a.count);

  const topConfusion = uniqueConfused[0];

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
            {state?.mode === 'survival'
              ? `You survived ${state?.score} rounds!`
              : state?.mode === 'speed'
              ? `You scored ${state?.score} in 60 seconds!`
              : "You're making steady progress."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="flex flex-col items-center p-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary mb-1"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            <span className="font-sans text-lg font-bold text-on-surface">{accuracy}%</span>
            <span className="font-sans text-[10px] text-on-surface-variant tracking-wider uppercase">Accuracy</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary mb-1"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            <span className="font-sans text-lg font-bold text-on-surface">{avgResponse}s</span>
            <span className="font-sans text-[10px] text-on-surface-variant tracking-wider uppercase">Avg. Response</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary mb-1"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>
            <span className="font-sans text-lg font-bold text-on-surface">{maxStreak}</span>
            <span className="font-sans text-[10px] text-on-surface-variant tracking-wider uppercase">Best Streak</span>
          </div>
        </div>

        {/* Mastery Progress */}
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-sm font-semibold text-on-surface">Mastery Progress</span>
            <span className="font-sans text-xs text-primary font-semibold">+{xpEarned} XP</span>
          </div>
          <div className="w-full h-2 bg-outline-variant/30 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, accuracy)}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-on-surface-variant">{state?.totalAnswered || 0} questions answered</span>
            <span className="font-sans text-xs text-on-surface-variant">{state?.totalCorrect || 0} correct</span>
          </div>
        </div>

        {/* Insights */}
        {(masteredKana.length > 0 || uniqueConfused.length > 0) && (
          <div className="mb-6">
            <h3 className="font-sans text-sm font-semibold text-on-surface mb-3">Insights</h3>
            
            {masteredKana.length > 0 && (
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-on-surface">Mastered Today</p>
                  <div className="flex gap-1 mt-1">
                    {masteredKana.slice(0, 5).map(id => {
                      const char = id.replace(/^[a-z]-/, '');
                      return <span key={id} className="font-serif text-lg">{char}</span>;
                    })}
                  </div>
                </div>
              </div>
            )}

            {uniqueConfused.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-error"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-on-surface">Needs Review</p>
                  <div className="flex gap-1 mt-1">
                    {uniqueConfused.slice(0, 3).map((pair, i) => {
                      const char = pair.shown.replace(/^[a-z]-/, '');
                      return <span key={i} className="font-serif text-lg">{char}</span>;
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confusion Pairs */}
        {topConfusion && (
          <div className="mb-8">
            <h3 className="font-sans text-sm font-semibold text-on-surface mb-3">Confusion Pairs</h3>
            <div className="flex items-center justify-center gap-4 p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
              <span className="font-serif text-3xl text-primary">{topConfusion.shown.replace(/^[a-z]-/, '')}</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-on-surface-variant">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <span className="font-serif text-3xl text-secondary">{topConfusion.answered}</span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant text-center mt-2">
              {getConfusionTip(topConfusion.shown, topConfusion.answered)}
            </p>
          </div>
        )}

        {/* Continue */}
        <Link to="/dashboard" className="w-full">
          <button className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-sans font-medium py-3.5 px-6 rounded-xl transition-colors hover:bg-primary-container hover:text-on-primary-container">
            Continue Practice
            <span className="text-lg">→</span>
          </button>
        </Link>
      </div>
    </AppLayout>
  );
};
