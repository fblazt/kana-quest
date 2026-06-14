import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { KanaCard } from '../components/ui/KanaCard';
import { usePracticeStore } from '../store/usePracticeStore';
import type { PracticeMode } from '../store/usePracticeStore';
import type { KanaType } from '../types/kana';

export const PracticeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [showHint, setShowHint] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mode = (searchParams.get('mode') as PracticeMode) || 'practice';
  const typeParam = searchParams.get('type') as KanaType | null;

  const {
    queue,
    currentIndex,
    score,
    lives,
    streak,
    mode: currentMode,
    isFinished,
    feedback,
    sessionStats,
    totalTime,
    startSession,
    submitAnswer,
    nextKana,
    tickTimer,
    endSession,
  } = usePracticeStore();

  useEffect(() => {
    const init = async () => {
      try {
        await startSession(mode, typeParam || undefined);
      } catch (err) {
        console.error('Failed to start session:', err);
        setError('Failed to load practice session. Please try again.');
      }
    };
    init();
  }, [mode, typeParam, startSession]);

  useEffect(() => {
    if (currentMode === 'speed' && !isFinished) {
      const interval = setInterval(tickTimer, 100);
      return () => clearInterval(interval);
    }
  }, [currentMode, isFinished, tickTimer]);

  useEffect(() => {
    if (isFinished) {
      navigate('/session-summary', {
        state: {
          ...sessionStats,
          totalTime,
          score,
        },
        replace: true,
      });
    }
  }, [isFinished, navigate, sessionStats, totalTime, score]);

  useEffect(() => {
    if (feedback && inputRef.current) {
      inputRef.current.focus();
    }
  }, [feedback, currentIndex]);

  useEffect(() => {
    if (queue.length > 0 && !isFinished) {
      inputRef.current?.focus();
    }
  }, [queue.length, isFinished]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || feedback) return;

    setShowHint(false);
    const result = await submitAnswer(inputValue.trim());
    setInputValue('');

    if (result === 'correct' || (currentMode === 'survival' && lives <= 1)) {
      setTimeout(() => nextKana(), 200);
    } else {
      setTimeout(() => nextKana(), 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !feedback) {
      handleSubmit(e as React.FormEvent);
    }
  };

  const currentKana = queue[currentIndex];
  const remaining = queue.length - currentIndex;
  const elapsed = currentMode === 'speed' ? Math.floor(totalTime / 1000) : 0;
  const timeLeft = currentMode === 'speed' ? Math.max(0, 60 - elapsed) : 0;

  if (error) {
    return (
      <AppLayout hideBottomNav>
        <div className="flex flex-col items-center justify-center flex-1 px-6">
          <p className="font-sans text-error mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg"
          >
            Go Home
          </button>
        </div>
      </AppLayout>
    );
  }

  if (queue.length === 0 || !currentKana) {
    return (
      <AppLayout hideBottomNav>
        <div className="flex flex-col items-center justify-center flex-1 px-6">
          <p className="font-sans text-on-surface-variant">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      hideBottomNav
      header={
        <header className="w-full flex items-center justify-between px-4 h-14 bg-surface/80 backdrop-blur-md sticky top-0 z-10">
          <button
            onClick={() => {
              endSession();
              navigate('/');
            }}
            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Close practice"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            {currentMode === 'survival' ? (
              <div className="flex items-center gap-1.5">
                {[...Array(3)].map((_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={i < lives ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    className={i < lives ? 'text-error' : 'text-outline-variant/40'}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ))}
              </div>
            ) : currentMode === 'speed' ? (
              <div className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="font-sans text-sm font-semibold text-on-surface tabular-nums">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/></svg>
                  <span className="font-sans text-sm font-semibold text-on-surface">{streak}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-sans text-sm font-semibold text-on-surface">{score}/{remaining + score}</span>
                </div>
              </>
            )}
          </div>
        </header>
      }
    >
      <div className="flex flex-col items-center justify-center flex-1 px-6">
        {/* Kana Card */}
        <div className="mb-10 relative">
          <div
            className={`transition-all duration-200 ${
              feedback === 'correct'
                ? 'scale-105 ring-4 ring-primary/30'
                : feedback === 'incorrect'
                ? 'scale-95 ring-4 ring-error/30'
                : ''
            }`}
          >
            <KanaCard kana={currentKana} />
          </div>
          {feedback && (
            <div
              className={`absolute -bottom-8 left-1/2 -translate-x-1/2 font-sans text-sm font-semibold ${
                feedback === 'correct' ? 'text-primary' : 'text-error'
              }`}
            >
              {feedback === 'correct' ? 'Correct!' : `Answer: ${currentKana.romaji}`}
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="w-full max-w-xs mt-4">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type romaji..."
            disabled={!!feedback}
            className="w-full text-center text-2xl font-sans py-4 bg-transparent border-b-2 border-outline focus:border-primary outline-none transition-colors duration-300 text-on-surface disabled:opacity-50"
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {showHint && (
            <p className="text-center font-sans text-xs text-on-surface-variant mt-3">
              Press Enter to submit
            </p>
          )}
        </form>
      </div>
    </AppLayout>
  );
};
