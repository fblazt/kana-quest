import React from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useAppStore } from '../store/useStore';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  return (
    <button
      type="button"
      aria-label={label}
      aria-checked={checked}
      role="switch"
      onClick={onChange}
      className="relative inline-flex items-center justify-center min-h-[44px] min-w-[44px] p-0 bg-transparent border-0 cursor-pointer"
    >
      <span
        className={`relative block w-11 h-6 rounded-full transition-colors duration-200 overflow-hidden ${
          checked ? 'bg-primary' : 'bg-outline-variant/40'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </span>
    </button>
  );
};

interface SettingsRowProps {
  icon: string;
  label: string;
  action?: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, label, action, danger = false, onClick }) => {
  return (
    <div
      className={`flex items-center justify-between py-md border-b border-outline-variant/20 last:border-b-0 ${
        onClick ? 'cursor-pointer hover:bg-surface-variant/40 transition-colors -mx-md px-md' : ''
      }`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      <div className="flex items-center gap-md">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{icon}</span>
        <span className={`font-sans text-[16px] leading-[24px] ${danger ? 'text-error font-medium' : 'text-on-surface'}`}>{label}</span>
      </div>
      {action}
    </div>
  );
};

export const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme, soundEffects, toggleSoundEffects, dailyReminders, toggleDailyReminders } = useAppStore();

  const handleReset = () => {
    const confirmed = window.confirm('Reset all progress? This cannot be undone.');
    if (!confirmed) return;
    try {
      localStorage.removeItem('kana-quest-progress');
      localStorage.removeItem('theme');
      localStorage.removeItem('soundEffects');
      localStorage.removeItem('dailyReminders');
      window.location.reload();
    } catch (err) {
      console.error('Failed to reset progress:', err);
    }
  };

  return (
    <AppLayout
      header={
        <header className="px-gutter py-md flex items-center justify-center border-b border-outline-variant bg-surface w-full max-w-container-max sticky top-0 z-10">
          <h1 className="font-sans text-[16px] leading-[24px] font-semibold text-primary">Settings</h1>
        </header>
      }
    >
      <div className="px-lg pt-xl pb-xxl flex flex-col gap-xl">
        {/* Preferences */}
        <section>
          <div className="bg-surface border border-outline-variant rounded-xl px-lg shadow-[0_10px_40px_-10px_rgba(24,36,66,0.04)]">
            <SettingsRow
              icon="dark_mode"
              label="Dark Theme"
              action={<Toggle checked={theme === 'dark'} onChange={toggleTheme} label="Dark theme" />}
            />
            <SettingsRow
              icon="volume_up"
              label="Sound Effects"
              action={<Toggle checked={soundEffects} onChange={toggleSoundEffects} label="Sound effects" />}
            />
            <SettingsRow
              icon="notifications"
              label="Daily Reminders"
              action={
                <div className="flex items-center gap-3">
                  <span className="font-sans text-[13px] text-on-surface-variant tabular-nums">7:00</span>
                  <Toggle
                    label="Daily Reminders"
                    checked={dailyReminders}
                    onChange={toggleDailyReminders}
                  />
                </div>
              }
            />
          </div>
        </section>

        {/* Data Management */}
        <section>
          <h2 className="font-sans text-[12px] leading-[16px] font-semibold tracking-[0.08em] text-on-surface-variant uppercase mb-sm ml-sm">
            Data Management
          </h2>
          <div className="bg-surface border border-outline-variant rounded-xl px-lg shadow-[0_10px_40px_-10px_rgba(24,36,66,0.04)]">
            <SettingsRow
              icon="upload"
              label="Export Backup"
              action={<span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>}
            />
            <SettingsRow
              icon="download"
              label="Import Backup"
              action={<span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>}
            />
            <SettingsRow
              icon="delete"
              label="Reset Progress"
              danger
              onClick={handleReset}
            />
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="font-sans text-[12px] leading-[16px] font-semibold tracking-[0.08em] text-on-surface-variant uppercase mb-sm ml-sm">
            About
          </h2>
          <div className="bg-surface border border-outline-variant rounded-xl p-lg shadow-[0_10px_40px_-10px_rgba(24,36,66,0.04)]">
            <div className="flex flex-col items-center mb-lg">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-sm shadow-[0_4px_12px_rgba(24,36,66,0.12)]">
                <span className="font-serif text-[32px] text-on-primary select-none">あ</span>
              </div>
              <h3 className="font-serif text-[20px] font-medium text-primary">Kana Quest</h3>
              <p className="font-sans text-[14px] text-on-surface-variant">Version 2.1.0 (Zen System)</p>
            </div>
            <div className="border-t border-outline-variant/30 pt-sm">
              <Link
                to="/legal?kind=privacy"
                className="flex items-center justify-between py-sm hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">policy</span>
                  <span className="font-sans text-[16px] text-on-surface">Privacy Policy</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[16px]">arrow_forward</span>
              </Link>
              <Link
                to="/legal?kind=terms"
                className="flex items-center justify-between py-sm hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">description</span>
                  <span className="font-sans text-[16px] text-on-surface">Terms of Service</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};
