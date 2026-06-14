import React from 'react';
import type { Kana } from '../../types/kana';

interface KanaCardProps {
  kana: Kana;
  isFlipped?: boolean;
}

export const KanaCard: React.FC<KanaCardProps> = ({ kana, isFlipped = false }) => {
  return (
    <div className="w-64 h-80" style={{ perspective: '1000px' }}>
      <div 
        className={`relative w-full h-full transition-transform duration-500`}
        style={{ 
          transformStyle: 'preserve-3d', 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
        }}
      >
        {/* Front */}
        <div 
          className="absolute w-full h-full flex items-center justify-center bg-surface border border-outline-variant rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="font-serif text-[80px] text-on-surface leading-none select-none">
            {kana.character}
          </span>
        </div>
        
        {/* Back */}
        <div 
          className="absolute w-full h-full flex flex-col items-center justify-center bg-secondary-container rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="font-sans text-4xl font-bold text-on-secondary-container select-none mb-2">
            {kana.romaji}
          </span>
          <span className="font-sans text-sm text-on-secondary-container uppercase tracking-widest opacity-80 select-none">
            {kana.type}
          </span>
        </div>
      </div>
    </div>
  );
};
