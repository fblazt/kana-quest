import React from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useDashboardData } from '../hooks/useDashboardData';

interface ModeRow {
  mode: string;
  title: string;
  description: string;
  icon: string;
  highlight?: boolean;
}

const modes: ModeRow[] = [
  {
    mode: 'review',
    title: 'Review',
    description: 'Focus on kana due for review',
    icon: 'history',
  },
  {
    mode: 'practice',
    title: 'Practice',
    description: 'Learn at your own pace with spaced repetition',
    icon: 'menu_book',
  },
  {
    mode: 'speed',
    title: 'Speed',
    description: '60 seconds — how many can you get right?',
    icon: 'bolt',
  },
  {
    mode: 'survival',
    title: 'Survival',
    description: '3 lives — stay alive as long as you can',
    icon: 'favorite',
  },
];

export const PracticeModeScreen: React.FC = () => {
  const { dueCount } = useDashboardData();

  const ordered = [
    { ...modes[0], highlight: dueCount > 0 },
    modes[1],
    modes[2],
    modes[3],
  ];

  return (
    <AppLayout hideBottomNav>
      <div className="px-gutter pt-md pb-xl flex flex-col gap-lg">
        <header>
          <h2 className="font-serif text-headline-lg-mobile leading-[32px] font-medium text-primary mb-xs">
            Choose mode
          </h2>
          <p className="font-sans text-[14px] leading-[20px] text-on-surface-variant">
            Pick a working mode for this session.
          </p>
        </header>

        <ul className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(24,36,66,0.04)]">
          {ordered.map(({ mode, title, description, icon, highlight }, index) => (
            <li key={mode} className={index > 0 ? 'border-t border-outline-variant/30' : ''}>
              <Link
                to={`/practice?mode=${mode}`}
                className="flex items-center gap-md px-lg py-md hover:bg-surface-variant/40 transition-colors"
                aria-label={`${title} mode${dueCount > 0 && mode === 'review' ? `, ${dueCount} due` : ''}`}
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[24px] shrink-0">
                  {icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-sm">
                    <h3 className="font-sans text-[16px] leading-[24px] font-semibold text-on-surface">
                      {title}
                    </h3>
                    {highlight && (
                      <span className="font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-on-primary-container bg-primary-container px-sm py-0.5 rounded-full">
                        {dueCount} due
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-[13px] leading-[18px] text-on-surface-variant truncate">
                    {description}
                  </p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0">
                  chevron_right
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
};
