import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => {
  return (
    <button type="button" aria-label="Toggle setting" aria-checked={checked} role="switch" onClick={() => onChange(!checked)}
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
  icon: string;
  label: string;
  action?: React.ReactNode;
  danger?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, label, action, danger = false }) => {
  return (
    <div className="flex items-center justify-between py-md border-b border-outline-variant/20 last:border-b-0">
      <div className="flex items-center gap-md">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{icon}</span>
        <span className={`font-sans text-[16px] leading-[24px] ${danger ? 'text-error font-medium' : 'text-on-surface'}`}>{label}</span>
      </div>
      {action}
    </div>
  );
};

export const SettingsScreen: React.FC = () => {
  const [darkTheme, setDarkTheme] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

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
              action={<Toggle checked={darkTheme} onChange={setDarkTheme} />}
            />
            <SettingsRow
              icon="volume_up"
              label="Sound Effects"
              action={<Toggle checked={soundEffects} onChange={setSoundEffects} />}
            />
            <SettingsRow
              icon="notifications"
              label="Daily Reminders"
              action={<span className="font-sans text-[14px] font-medium text-primary flex items-center gap-xs">19:00 <span className="material-symbols-outlined text-[16px]">chevron_right</span></span>}
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
              <div className="flex items-center justify-between py-sm cursor-pointer hover:opacity-80 transition-opacity">
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">policy</span>
                  <span className="font-sans text-[16px] text-on-surface">Privacy Policy</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[16px]">open_in_new</span>
              </div>
              <div className="flex items-center justify-between py-sm cursor-pointer hover:opacity-80 transition-opacity">
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">description</span>
                  <span className="font-sans text-[16px] text-on-surface">Terms of Service</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[16px]">open_in_new</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};
