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
    startTime,
    startSession,
    submitAnswer,
    nextKana,
    tickTimer,
    endSession,
  } = usePracticeStore();

  // Local 1Hz clock so the speed-mode countdown doesn't push Zustand every 100ms
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (currentMode !== 'speed' || isFinished) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [currentMode, isFinished]);
  const liveElapsed = currentMode === 'speed' && startTime > 0 ? now - startTime : 0;

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
      const interval = setInterval(tickTimer, 1000);
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

  // Keyboard-aware padding: shrink the bottom inset when the soft keyboard is open
  useEffect(() => {
    const root = document.documentElement;
    const vv = window.visualViewport;
    const setKeyboardInset = () => {
      if (!vv) {
        root.style.setProperty('--keyboard-inset', '0px');
        return;
      }
      const keyboardHeight = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      root.style.setProperty('--keyboard-inset', `${keyboardHeight}px`);

      // Keep the input + kana card visible when the keyboard opens
      if (keyboardHeight > 0) {
        inputRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    };
    setKeyboardInset();
    if (vv) {
      vv.addEventListener('resize', setKeyboardInset);
      vv.addEventListener('scroll', setKeyboardInset);
    }
    return () => {
      if (vv) {
        vv.removeEventListener('resize', setKeyboardInset);
        vv.removeEventListener('scroll', setKeyboardInset);
      }
      root.style.setProperty('--keyboard-inset', '0px');
    };
  }, []);

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
  const total = queue.length + score; // approximate for now
  const progressPercent = total > 0 ? (score / total) * 100 : 0;
  const elapsed = currentMode === 'speed' ? Math.floor(liveElapsed / 1000) : 0;
  const timeLeft = currentMode === 'speed' ? Math.max(0, 60 - elapsed) : 0;

  if (error) {
    return (
      <AppLayout hideBottomNav>
        <div className="flex flex-col items-center justify-center flex-1 px-lg">
          <p className="font-sans text-error mb-4">{error}</p>
          <button type="button"            onClick={() => navigate('/dashboard')}
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
        <div className="flex flex-col items-center justify-center flex-1 px-lg">
          <p className="font-sans text-on-surface-variant">Preparing your session…</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      hideBottomNav
      header={
        <header className="px-gutter py-md flex items-center justify-between border-b border-outline-variant bg-surface w-full max-w-container-max sticky top-0 z-10">
          <button type="button"            onClick={() => {
              endSession();
              navigate('/dashboard');
            }}
            className="p-2 hover:bg-surface-container rounded-full transition-colors"
            aria-label="Close practice"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
          
          <div className="flex-1 mx-lg max-w-md">
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          <div className="flex items-center gap-xs text-on-surface-variant">
            {currentMode === 'survival' ? (
              <div className="flex items-center gap-1.5">
                {[...Array(3)].map((_, i) => (
                  <span
                    key={i}
                    className={`material-symbols-outlined text-[16px] ${i < lives ? 'text-secondary' : 'text-outline-variant/40'}`}
                    style={i < lives ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    favorite
                  </span>
                ))}
              </div>
            ) : currentMode === 'speed' ? (
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
                <span className="font-sans font-semibold text-on-surface tabular-nums">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-secondary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <span className="font-sans font-semibold text-on-surface">{streak}</span>
              </div>
            )}
          </div>
        </header>
      }
    >
      <div
        className="flex-1 flex flex-col items-center justify-center px-gutter w-full"
        style={{ paddingBottom: 'calc(var(--spacing-xxl) + var(--keyboard-inset, 0px) + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Screen-reader announcements: kana change + feedback state */}
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          {currentKana
            ? `Kana question ${currentIndex + 1} of ${queue.length}.` +
              (feedback === 'correct'
                ? ' Correct.'
                : feedback === 'incorrect'
                ? ` Incorrect. The answer was ${currentKana.romaji}.`
                : '')
            : ''}
        </div>
        {/* Progress Counter */}
        <div className="mb-xl font-sans text-[12px] leading-[16px] font-semibold text-on-surface-variant uppercase tracking-[0.08em]">
          {score} / {total}
        </div>

        {/* Kana Card */}
        <div className="mb-xxl relative">
          <div
            className={`transition-all duration-200 ${
              feedback === 'correct'
                ? 'ring-4 ring-primary/30 rounded-2xl'
                : feedback === 'incorrect'
                ? 'ring-4 ring-error/30 rounded-2xl'
                : ''
            }`}
            style={
              feedback === 'correct'
                ? { animation: 'correct-pulse 0.3s ease-out forwards' }
                : feedback === 'incorrect'
                ? { animation: 'incorrect-shake 0.4s ease-out' }
                : undefined
            }
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

        {/* Input Area */}
        <div className="w-full max-w-[320px] relative">
          <form onSubmit={handleSubmit} className="w-full">
            <input
              ref={inputRef}
              type="text"
              id="romaji-input"
              aria-label="Romaji input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type Romaji"
              disabled={!!feedback}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className={`w-full bg-transparent border-b-2 py-md text-center font-serif text-[32px] leading-[40px] focus:outline-none transition-colors placeholder:text-on-surface-variant/30 ${
                feedback === 'correct' 
                  ? 'border-primary text-primary' 
                  : feedback === 'incorrect'
                  ? 'border-error text-error'
                  : 'border-outline focus:border-primary text-on-surface'
              }`}
            />
            {showHint && (
              <div className="mt-sm text-center font-sans text-[12px] leading-[16px] font-semibold tracking-[0.08em] text-on-surface-variant/60">
                Press Enter to submit
              </div>
            )}
          </form>
        </div>
      </div>
    </AppLayout>
  );
};
