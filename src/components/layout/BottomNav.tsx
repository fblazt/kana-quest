import React from 'react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/dashboard', label: 'Home', icon: 'home' },
  { to: '/practice', label: 'Practice', icon: 'school' },
  { to: '/progress', label: 'Progress', icon: 'trending_up' },
  { to: '/heat-map', label: 'Heat Map', icon: 'calendar_view_month' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 w-full max-w-container-max z-50 bg-surface border-t border-surface-variant shadow-sm flex justify-around items-center px-md py-sm">
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/dashboard'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-colors active:scale-90 px-sm py-xs ${
              isActive 
                ? 'text-primary font-bold bg-primary-fixed/20 rounded-xl' 
                : 'text-on-surface-variant hover:text-primary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span 
                className="material-symbols-outlined" 
                style={isActive && icon === 'home' ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {icon}
              </span>
              <span className="font-sans text-[12px] font-semibold leading-[16px] tracking-[0.08em] mt-1">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
