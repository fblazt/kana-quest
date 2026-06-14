import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        checked ? 'bg-primary' : 'bg-outline-variant/40'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );
};

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  action?: React.ReactNode;
  danger?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, label, action, danger = false }) => {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-outline-variant/20 last:border-b-0">
      <div className="flex items-center gap-3">
        <span className="text-on-surface-variant">{icon}</span>
        <span className={`font-sans text-sm ${danger ? 'text-error' : 'text-on-surface'}`}>{label}</span>
      </div>
      {action}
    </div>
  );
};

export const SettingsScreen: React.FC = () => {
  const [darkTheme, setDarkTheme] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  return (
    <AppLayout>
      <div className="px-6 pt-4 pb-6">
        <h2 className="font-serif text-xl font-medium text-primary text-center mb-6">Preferences</h2>

        {/* Preferences */}
        <div className="mb-6">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4">
            <SettingsRow
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>}
              label="Dark Theme"
              action={<Toggle checked={darkTheme} onChange={setDarkTheme} />}
            />
            <SettingsRow
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>}
              label="Sound Effects"
              action={<Toggle checked={soundEffects} onChange={setSoundEffects} />}
            />
            <SettingsRow
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>}
              label="Daily Reminders"
              action={<span className="font-sans text-xs text-on-surface-variant">19:00 ›</span>}
            />
          </div>
        </div>

        {/* Data Management */}
        <div className="mb-6">
          <p className="font-sans text-[10px] font-semibold tracking-wider uppercase text-on-surface-variant mb-2">
            Data Management
          </p>
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4">
            <SettingsRow
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>}
              label="Export Backup"
              action={<span className="text-on-surface-variant">›</span>}
            />
            <SettingsRow
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>}
              label="Import Backup"
              action={<span className="text-on-surface-variant">›</span>}
            />
            <SettingsRow
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>}
              label="Reset Progress"
              danger
              action={null}
            />
          </div>
        </div>

        {/* About */}
        <div>
          <p className="font-sans text-[10px] font-semibold tracking-wider uppercase text-on-surface-variant mb-2">
            About
          </p>
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4">
            <div className="flex flex-col items-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-3">
                <span className="font-serif text-2xl text-on-primary">あ</span>
              </div>
              <p className="font-serif text-lg font-medium text-on-surface">Kana Quest</p>
              <p className="font-sans text-xs text-on-surface-variant">Version 2.1.0 (Wabi-sabi)</p>
            </div>
            <div className="border-t border-outline-variant/20 pt-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-on-surface-variant"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                  <span className="font-sans text-sm text-on-surface">Privacy Policy</span>
                </div>
                <span className="text-on-surface-variant text-xs">↗</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-on-surface-variant"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM8 15h8v2H8v-2zm0-4h8v2H8v-2z"/></svg>
                  <span className="font-sans text-sm text-on-surface">Terms of Service</span>
                </div>
                <span className="text-on-surface-variant text-xs">↗</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
