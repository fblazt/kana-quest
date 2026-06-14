import React from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useDashboardData } from '../hooks/useDashboardData';

interface ModeCard {
  mode: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const modes: ModeCard[] = [
  {
    mode: 'practice',
    title: 'Practice',
    description: 'Learn at your own pace with spaced repetition',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M9 6h6M9 10h6M9 14h4" />
      </svg>
    ),
    color: 'bg-primary/10 text-primary',
  },
  {
    mode: 'speed',
    title: 'Speed',
    description: '60 seconds — how many can you get right?',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    color: 'bg-tertiary/10 text-tertiary',
  },
  {
    mode: 'survival',
    title: 'Survival',
    description: '3 lives — stay alive as long as you can',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    color: 'bg-secondary/10 text-secondary',
  },
  {
    mode: 'review',
    title: 'Review',
    description: 'Focus on kana due for review',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 4v6h-6" />
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
      </svg>
    ),
    color: 'bg-on-surface-variant/10 text-on-surface-variant',
  },
];

export const PracticeModeScreen: React.FC = () => {
  const { dueCount } = useDashboardData();

  return (
    <AppLayout hideBottomNav>
      <div className="px-6 pt-4 pb-6">
        <h2 className="font-serif text-xl font-medium text-primary mb-6">Choose Mode</h2>

        <div className="flex flex-col gap-3">
          {modes.map(({ mode, title, description, icon, color }) => (
            <Link
              key={mode}
              to={`/practice?mode=${mode}`}
              className="block bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 transition-colors hover:bg-surface-container-low"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-sans text-base font-semibold text-on-surface mb-0.5">{title}</h3>
                  <p className="font-sans text-sm text-on-surface-variant">{description}</p>
                  {mode === 'review' && dueCount > 0 && (
                    <p className="font-sans text-xs text-primary font-medium mt-1">
                      {dueCount} kana due
                    </p>
                  )}
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-outline mt-1 shrink-0">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};
