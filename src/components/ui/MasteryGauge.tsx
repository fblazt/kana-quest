import React from 'react';

interface MasteryGaugeProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export const MasteryGauge: React.FC<MasteryGaugeProps> = ({ 
  percentage, 
  size = 160, 
  strokeWidth = 4 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-outline-variant/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-serif text-3xl font-medium text-primary">{percentage}%</span>
        <span className="font-sans text-xs text-on-surface-variant tracking-wide">Mastery</span>
      </div>
    </div>
  );
};
