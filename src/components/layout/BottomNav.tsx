import React from 'react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/practice', label: 'Practice', icon: PracticeIcon },
  { to: '/progress', label: 'Progress', icon: ProgressIcon },
  { to: '/heat-map', label: 'Heat Map', icon: HeatMapIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

function HomeIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function PracticeIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm1 4h10v2H7V6zm0 4h10v2H7v-2zm0 4h6v2H7v-2z" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M9 6h6M9 10h6M9 14h4" />
    </svg>
  );
}

function ProgressIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 12h3l2-4 3 8 2-6 2 4h3l2-8 2 6h3" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function HeatMapIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 15.5A3.5 3.5 0 1012 8.5a3.5 3.5 0 000 7zm7.43-2.53l-1.21-.4a6.7 6.7 0 00-.57-1.38l.72-1.02a.75.75 0 00-.12-.95l-2-1.73a.75.75 0 00-.95-.12l-1.02.72a6.7 6.7 0 00-1.38-.57l-.4-1.21a.75.75 0 00-.72-.53h-3.46a.75.75 0 00-.72.53l-.4 1.21a6.7 6.7 0 00-1.38.57l-1.02-.72a.75.75 0 00-.95.12l-2 1.73a.75.75 0 00-.12.95l.72 1.02a6.7 6.7 0 00-.57 1.38l-1.21.4a.75.75 0 00-.53.72v3.46a.75.75 0 00.53.72l1.21.4c.15.49.34.96.57 1.38l-.72 1.02a.75.75 0 00.12.95l2 1.73a.75.75 0 00.95.12l1.02-.72c.42.23.89.42 1.38.57l.4 1.21a.75.75 0 00.72.53h3.46a.75.75 0 00.72-.53l.4-1.21a6.7 6.7 0 001.38-.57l1.02.72a.75.75 0 00.95-.12l2-1.73a.75.75 0 00.12-.95l-.72-1.02c.23-.42.42-.89.57-1.38l1.21-.4a.75.75 0 00.53-.72v-3.46a.75.75 0 00-.53-.72z" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

export const BottomNav: React.FC = () => {
  return (
    <nav className="w-full border-t border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-md sticky bottom-0 z-10">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon active={isActive} />
                <span className="text-[10px] font-sans font-semibold tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
