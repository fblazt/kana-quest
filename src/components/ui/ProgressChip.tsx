import React from 'react';

interface ProgressChipProps {
  label: string;
  level: 'low' | 'medium' | 'high';
}

export const ProgressChip: React.FC<ProgressChipProps> = ({ label, level }) => {
  let colorStyles = '';
  
  switch(level) {
    case 'low': colorStyles = 'bg-error-container text-on-error-container'; break;
    case 'medium': colorStyles = 'bg-tertiary-container text-on-tertiary-container'; break;
    case 'high': colorStyles = 'bg-primary-fixed text-on-primary-fixed'; break;
  }

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full font-sans text-xs font-semibold tracking-wide ${colorStyles}`}>
      {label}
    </div>
  );
};
