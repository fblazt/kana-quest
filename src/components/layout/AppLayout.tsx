import React from 'react';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
  hideBottomNav?: boolean;
  header?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, hideBottomNav = false, header }) => {
  return (
    <div className="flex flex-col flex-1 h-full w-full bg-surface relative">
      {header !== undefined ? header : (
        <header className="fixed top-0 w-full max-w-container-max z-40 bg-surface/80 backdrop-blur-md border-b border-surface-variant flex justify-between items-center px-lg h-16">
          <button type="button"className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-serif text-[24px] font-medium leading-[32px] text-primary tracking-tight">Kana Quest</h1>
          <button type="button"className="text-on-surface-variant hover:opacity-80 active:scale-95 transition-transform overflow-hidden rounded-full w-8 h-8 flex items-center justify-center bg-surface-container">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </button>
        </header>
      )}
      <main className="flex-1 flex flex-col overflow-y-auto pt-16">
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
};
