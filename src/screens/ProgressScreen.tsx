import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';

const accuracyData = [
  { week: 'W1', value: 65 },
  { week: 'W2', value: 72 },
  { week: 'W3', value: 82 },
  { week: 'W4', value: 92 },
];

const calendarDays = [
  [0, 0, 0, 1, 1, 1, 1],
  [1, 1, 0, 1, 1, 1, 1],
];

export const ProgressScreen: React.FC = () => {
  return (
    <AppLayout>
      <div className="px-6 pt-4 pb-6">
        <h2 className="font-serif text-2xl font-medium text-primary text-center mb-6">Progress</h2>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              <span className="font-sans text-[10px] font-semibold tracking-wider uppercase text-on-surface-variant">Total Reviews</span>
            </div>
            <p className="font-sans text-2xl font-bold text-on-surface mb-1">4,280</p>
            <span className="font-sans text-xs text-primary font-semibold">+124 this week</span>
          </div>
          <div className="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
              <span className="font-sans text-[10px] font-semibold tracking-wider uppercase text-on-surface-variant">Time Practiced</span>
            </div>
            <p className="font-sans text-2xl font-bold text-on-surface mb-1">18h 45m</p>
            <span className="font-sans text-xs text-primary font-semibold">Consistent</span>
          </div>
        </div>

        {/* Mastery Growth Chart */}
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 mb-6">
          <h3 className="font-sans text-sm font-semibold text-on-surface mb-4">Mastery Growth</h3>
          <div className="relative h-32">
            <svg viewBox="0 0 300 120" className="w-full h-full" preserveAspectRatio="none">
              {/* Y-axis labels */}
              <text x="0" y="15" className="fill-on-surface-variant text-[10px] font-sans">100</text>
              <text x="0" y="45" className="fill-on-surface-variant text-[10px] font-sans">75</text>
              <text x="0" y="75" className="fill-on-surface-variant text-[10px] font-sans">50</text>
              <text x="0" y="105" className="fill-on-surface-variant text-[10px] font-sans">25</text>
              
              {/* Grid lines */}
              <line x1="30" y1="10" x2="300" y2="10" stroke="currentColor" strokeWidth="0.5" className="text-outline-variant/20" />
              <line x1="30" y1="40" x2="300" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-outline-variant/20" />
              <line x1="30" y1="70" x2="300" y2="70" stroke="currentColor" strokeWidth="0.5" className="text-outline-variant/20" />
              <line x1="30" y1="100" x2="300" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-outline-variant/20" />
              
              {/* Line chart */}
              <polyline
                points="30,85 110,70 190,45 270,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
              />
              {/* Data points */}
              <circle cx="30" cy="85" r="3" fill="currentColor" className="text-primary" />
              <circle cx="110" cy="70" r="3" fill="currentColor" className="text-primary" />
              <circle cx="190" cy="45" r="3" fill="currentColor" className="text-primary" />
              <circle cx="270" cy="20" r="3" fill="currentColor" className="text-primary" />
            </svg>
          </div>
          <div className="flex justify-between mt-2 px-1">
            {accuracyData.map(d => (
              <span key={d.week} className="font-sans text-[10px] text-on-surface-variant">{d.week}</span>
            ))}
          </div>
        </div>

        {/* Daily Streak */}
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans text-sm font-semibold text-on-surface">Daily Streak</h3>
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/></svg>
              <span className="font-sans text-sm font-semibold text-on-surface">14 Days</span>
            </div>
          </div>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center font-sans text-[10px] text-on-surface-variant pb-1">{day}</div>
            ))}
            {calendarDays.flat().map((active, i) => (
              <div key={i} className="flex justify-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-sans ${
                  active
                    ? 'bg-primary text-on-primary'
                    : 'bg-outline-variant/20 text-on-surface-variant/40'
                }`}>
                  {active ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span className="text-[9px]">{i + 1}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accuracy Trend */}
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans text-sm font-semibold text-on-surface">Accuracy Trend</h3>
            <span className="font-sans text-sm font-bold text-primary">92%</span>
          </div>
          <div className="flex items-end justify-between h-24 gap-3">
            {accuracyData.map((d) => (
              <div key={d.week} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-primary/20 rounded-t"
                  style={{ height: `${d.value}%` }}
                >
                  <div 
                    className="w-full bg-primary rounded-t"
                    style={{ height: '100%' }}
                  />
                </div>
                <span className="font-sans text-[9px] text-on-surface-variant mt-1">
                  {d.week}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
