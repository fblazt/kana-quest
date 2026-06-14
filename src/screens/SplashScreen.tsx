import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useStore';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { initializeApp, isReady } = useAppStore();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isReady, navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-surface">
      {/* Center Logo and Branding */}
      <div
        className="flex flex-col items-center justify-center flex-grow"
        style={{ animation: 'splash-fade-in-up 1.2s ease-out forwards' }}
      >
        {/* Logo Container with pulse effect */}
        <div className="relative mb-10 w-32 h-32 flex items-center justify-center">
          {/* Outer pulsing ring */}
          <div
            className="absolute inset-0 rounded-full border border-primary/20"
            style={{ animation: 'splash-pulse-ring 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite' }}
          />
          {/* Logo circle */}
          <div className="w-full h-full rounded-full bg-primary flex items-center justify-center shadow-lg">
            <span className="font-serif text-5xl text-on-primary">あ</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-2xl font-medium text-primary tracking-wide text-center mb-2">
          Kana Quest
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-sm text-outline tracking-widest uppercase text-center opacity-70">
          A Journey to Mastery
        </p>
      </div>

      {/* Loading Indicator */}
      <div
        className="pb-16 flex flex-col items-center justify-end w-full"
        style={{ animation: 'splash-fade-in-up 1.2s ease-out 0.5s forwards', opacity: 0 }}
      >
        {/* Loading Dots */}
        <div className="flex space-x-2 items-center mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              style={{
                animation: 'splash-dot-blink 1.4s infinite ease-in-out both',
                animationDelay: `${-0.32 + i * 0.16}s`,
              }}
            />
          ))}
        </div>

        {/* Progress Line */}
        <div className="w-16 h-px bg-outline-variant relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary/40 w-full"
            style={{ animation: 'splash-loading-line 2s ease-in-out infinite' }}
          />
        </div>
      </div>
    </div>
  );
};
