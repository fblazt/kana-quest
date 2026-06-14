import React from 'react';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
  hideBottomNav?: boolean;
  header?: React.ReactNode;
}

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, hideBottomNav = false, header }) => {
  return (
    <div className="flex flex-col flex-1 h-full w-full bg-surface relative">
      {header !== undefined ? header : (
        <header className="w-full flex items-center justify-between px-4 h-14 bg-surface/80 backdrop-blur-md sticky top-0 z-10 border-b border-outline-variant/30">
          <button className="w-8 h-8 flex items-center justify-center text-on-surface" aria-label="Menu">
            <HamburgerIcon />
          </button>
          <h1 className="font-serif text-xl font-medium text-primary absolute left-1/2 -translate-x-1/2">Kana Quest</h1>
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
            <span className="text-on-primary-container text-xs font-sans font-bold">Q</span>
          </div>
        </header>
      )}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
};
