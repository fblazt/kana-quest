import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';

const LAST_UPDATED = '2026-06-17';

const PRIVACY_SECTIONS: { heading: string; body: string }[] = [
  {
    heading: 'What we collect',
    body: 'Kana Quest is a client-side app. All of your learning data — kana stats, streaks, confusion pairs, and session history — is stored in your browser using IndexedDB. We do not run a server, so we do not see, transmit, or process your data on our side.',
  },
  {
    heading: 'What we do not collect',
    body: 'We do not collect personal information, IP addresses, device identifiers, location data, or analytics events. There are no third-party trackers running inside the app. The only network requests your browser makes are the initial app bundle and Google Fonts (Material Symbols and the typeface files).',
  },
  {
    heading: 'Local storage',
    body: 'A small number of preferences are kept in localStorage: theme (light/dark), sound effects, and the current daily-reminder flag. You can clear them at any time from Settings → Reset Progress, or by clearing site data for this origin in your browser.',
  },
  {
    heading: 'Children',
    body: 'The app is suitable for all ages. We do not knowingly collect information from children because we do not collect information from anyone.',
  },
  {
    heading: 'Changes',
    body: 'If this policy ever changes materially, the "Last updated" date at the top will reflect that. The current build of the app continues to function as a fully offline, client-side experience.',
  },
  {
    heading: 'Contact',
    body: 'Open an issue on the project repository if you have a question about privacy or data handling.',
  },
];

const TERMS_SECTIONS: { heading: string; body: string }[] = [
  {
    heading: 'License',
    body: 'Kana Quest is provided as a personal practice tool. You may use it for your own study. You may not redistribute the app or claim authorship of its content.',
  },
  {
    heading: 'No warranty',
    body: 'The app is provided "as is", without warranty of any kind. Spaced-repetition scheduling and mastery calculations are heuristics — they help you practice, but they do not guarantee learning outcomes. Use the app as a supplement to your study, not a substitute.',
  },
  {
    heading: 'Your data, your responsibility',
    body: 'Because the app stores everything locally in your browser, clearing your browser data will erase your progress. Export or back up your data if it matters to you. The Reset Progress action in Settings is destructive and cannot be undone.',
  },
  {
    heading: 'Acceptable use',
    body: 'Do not attempt to break the app, reverse-engineer the SRS algorithm to build a competing product, or use it to harass anyone. The app contains no social features, so most of the usual "be kind" clauses are not relevant — but the principle stands.',
  },
  {
    heading: 'Changes',
    body: 'These terms may be updated alongside the privacy policy. Continued use of the app after an update constitutes acceptance of the new terms.',
  },
];

export const LegalScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const kind = searchParams.get('kind') === 'terms' ? 'terms' : 'privacy';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [kind]);

  const sections = kind === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS;
  const title = kind === 'terms' ? 'Terms of Service' : 'Privacy Policy';

  return (
    <AppLayout>
      <div className="px-6 pt-4 pb-8 max-w-2xl mx-auto w-full">
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors mb-4 min-h-[44px]"
          aria-label="Back to settings"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span className="font-sans text-[14px]">Settings</span>
        </button>

        <h1 className="font-serif text-[28px] leading-[36px] font-medium text-primary mb-2">
          {title}
        </h1>
        <p className="font-sans text-[12px] text-on-surface-variant mb-6">
          Last updated {LAST_UPDATED}
        </p>

        <div className="flex gap-2 mb-6 border-b border-outline-variant/30 pb-3">
          <button
            type="button"
            onClick={() => navigate('/legal?kind=privacy', { replace: true })}
            className={`px-3 py-1.5 rounded-full font-sans text-[13px] font-semibold transition-colors ${
              kind === 'privacy'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            aria-pressed={kind === 'privacy'}
          >
            Privacy
          </button>
          <button
            type="button"
            onClick={() => navigate('/legal?kind=terms', { replace: true })}
            className={`px-3 py-1.5 rounded-full font-sans text-[13px] font-semibold transition-colors ${
              kind === 'terms'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            aria-pressed={kind === 'terms'}
          >
            Terms
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-serif text-[18px] font-medium text-on-surface mb-2">
                {s.heading}
              </h2>
              <p className="font-sans text-[15px] leading-[24px] text-on-surface-variant">
                {s.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};
