import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';

interface KanaHeatItem {
  character: string;
  romaji: string;
  mastery: number;
}

const hiraganaHeatMap: KanaHeatItem[] = [
  { character: 'あ', romaji: 'a', mastery: 95 },
  { character: 'い', romaji: 'i', mastery: 92 },
  { character: 'う', romaji: 'u', mastery: 88 },
  { character: 'え', romaji: 'e', mastery: 70 },
  { character: 'お', romaji: 'o', mastery: 45 },
  { character: 'か', romaji: 'ka', mastery: 90 },
  { character: 'き', romaji: 'ki', mastery: 35 },
  { character: 'く', romaji: 'ku', mastery: 85 },
  { character: 'け', romaji: 'ke', mastery: 60 },
  { character: 'こ', romaji: 'ko', mastery: 92 },
  { character: 'さ', romaji: 'sa', mastery: 78 },
  { character: 'し', romaji: 'shi', mastery: 82 },
  { character: 'す', romaji: 'su', mastery: 55 },
  { character: 'せ', romaji: 'se', mastery: 88 },
  { character: 'そ', romaji: 'so', mastery: 90 },
  { character: 'た', romaji: 'ta', mastery: 95 },
  { character: 'ち', romaji: 'chi', mastery: 72 },
  { character: 'つ', romaji: 'tsu', mastery: 40 },
  { character: 'て', romaji: 'te', mastery: 85 },
  { character: 'と', romaji: 'to', mastery: 92 },
  { character: 'な', romaji: 'na', mastery: 88 },
  { character: 'に', romaji: 'ni', mastery: 90 },
  { character: 'ぬ', romaji: 'nu', mastery: 30 },
  { character: 'ね', romaji: 'ne', mastery: 75 },
  { character: 'の', romaji: 'no', mastery: 95 },
  { character: 'は', romaji: 'ha', mastery: 85 },
  { character: 'ひ', romaji: 'hi', mastery: 68 },
  { character: 'ふ', romaji: 'fu', mastery: 50 },
  { character: 'へ', romaji: 'he', mastery: 82 },
  { character: 'ほ', romaji: 'ho', mastery: 90 },
  { character: 'ま', romaji: 'ma', mastery: 88 },
  { character: 'み', romaji: 'mi', mastery: 72 },
  { character: 'む', romaji: 'mu', mastery: 45 },
  { character: 'め', romaji: 'me', mastery: 32 },
  { character: 'も', romaji: 'mo', mastery: 90 },
  { character: 'や', romaji: 'ya', mastery: 95 },
  { character: 'ゆ', romaji: 'yu', mastery: 88 },
  { character: 'よ', romaji: 'yo', mastery: 92 },
  { character: 'ら', romaji: 'ra', mastery: 85 },
  { character: 'り', romaji: 'ri', mastery: 90 },
  { character: 'る', romaji: 'ru', mastery: 78 },
  { character: 'れ', romaji: 're', mastery: 28 },
  { character: 'ろ', romaji: 'ro', mastery: 88 },
  { character: 'わ', romaji: 'wa', mastery: 65 },
  { character: 'を', romaji: 'wo', mastery: 82 },
  { character: 'ん', romaji: 'n', mastery: 95 },
];

const katakanaHeatMap: KanaHeatItem[] = [
  { character: 'ア', romaji: 'a', mastery: 88 },
  { character: 'イ', romaji: 'i', mastery: 85 },
  { character: 'ウ', romaji: 'u', mastery: 82 },
  { character: 'エ', romaji: 'e', mastery: 65 },
  { character: 'オ', romaji: 'o', mastery: 40 },
  { character: 'カ', romaji: 'ka', mastery: 85 },
  { character: 'キ', romaji: 'ki', mastery: 30 },
  { character: 'ク', romaji: 'ku', mastery: 80 },
  { character: 'ケ', romaji: 'ke', mastery: 55 },
  { character: 'コ', romaji: 'ko', mastery: 88 },
  { character: 'サ', romaji: 'sa', mastery: 72 },
  { character: 'シ', romaji: 'shi', mastery: 78 },
  { character: 'ス', romaji: 'su', mastery: 50 },
  { character: 'セ', romaji: 'se', mastery: 82 },
  { character: 'ソ', romaji: 'so', mastery: 85 },
  { character: 'タ', romaji: 'ta', mastery: 90 },
  { character: 'チ', romaji: 'chi', mastery: 68 },
  { character: 'ツ', romaji: 'tsu', mastery: 35 },
  { character: 'テ', romaji: 'te', mastery: 80 },
  { character: 'ト', romaji: 'to', mastery: 88 },
  { character: 'ナ', romaji: 'na', mastery: 82 },
  { character: 'ニ', romaji: 'ni', mastery: 85 },
  { character: 'ヌ', romaji: 'nu', mastery: 25 },
  { character: 'ネ', romaji: 'ne', mastery: 70 },
  { character: 'ノ', romaji: 'no', mastery: 90 },
  { character: 'ハ', romaji: 'ha', mastery: 80 },
  { character: 'ヒ', romaji: 'hi', mastery: 62 },
  { character: 'フ', romaji: 'fu', mastery: 45 },
  { character: 'ヘ', romaji: 'he', mastery: 78 },
  { character: 'ホ', romaji: 'ho', mastery: 85 },
  { character: 'マ', romaji: 'ma', mastery: 82 },
  { character: 'ミ', romaji: 'mi', mastery: 68 },
  { character: 'ム', romaji: 'mu', mastery: 40 },
  { character: 'メ', romaji: 'me', mastery: 28 },
  { character: 'モ', romaji: 'mo', mastery: 85 },
  { character: 'ヤ', romaji: 'ya', mastery: 90 },
  { character: 'ユ', romaji: 'yu', mastery: 82 },
  { character: 'ヨ', romaji: 'yo', mastery: 88 },
  { character: 'ラ', romaji: 'ra', mastery: 80 },
  { character: 'リ', romaji: 'ri', mastery: 85 },
  { character: 'ル', romaji: 'ru', mastery: 72 },
  { character: 'レ', romaji: 're', mastery: 22 },
  { character: 'ロ', romaji: 'ro', mastery: 82 },
  { character: 'ワ', romaji: 'wa', mastery: 60 },
  { character: 'ヲ', romaji: 'wo', mastery: 78 },
  { character: 'ン', romaji: 'n', mastery: 90 },
];

function getMasteryColor(mastery: number): string {
  if (mastery >= 80) return 'bg-[#8FBC8F] text-white';
  if (mastery >= 50) return 'bg-[#BDB76B] text-white';
  if (mastery > 0) return 'bg-[#E8A0A0] text-white';
  return 'bg-outline-variant/20 text-on-surface-variant';
}

export const HeatMapScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const data = activeTab === 'hiragana' ? hiraganaHeatMap : katakanaHeatMap;

  return (
    <AppLayout>
      <div className="px-6 pt-4 pb-6">
        <h2 className="font-serif text-2xl font-medium text-primary text-center mb-2">Heat Map</h2>
        <p className="font-sans text-xs text-on-surface-variant text-center mb-4">
          {activeTab === 'hiragana' ? 'Hiragana' : 'Katakana'} mastery overview
        </p>

        {/* Tab Switcher */}
        <div className="flex bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab('hiragana')}
            className={`flex-1 py-2 rounded-lg font-sans text-sm font-medium transition-colors ${
              activeTab === 'hiragana'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Hiragana
          </button>
          <button
            onClick={() => setActiveTab('katakana')}
            className={`flex-1 py-2 rounded-lg font-sans text-sm font-medium transition-colors ${
              activeTab === 'katakana'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Katakana
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#8FBC8F]" />
            <span className="font-sans text-[10px] text-on-surface-variant">Mastered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#BDB76B]" />
            <span className="font-sans text-[10px] text-on-surface-variant">Learning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#E8A0A0]" />
            <span className="font-sans text-[10px] text-on-surface-variant">Weak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-outline-variant/20" />
            <span className="font-sans text-[10px] text-on-surface-variant">New</span>
          </div>
        </div>

        {/* Heat Map Grid */}
        <div className="grid grid-cols-5 gap-2">
          {data.map((item) => (
            <div
              key={item.character}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center ${getMasteryColor(item.mastery)} transition-transform hover:scale-110 cursor-default`}
              title={`${item.character} ${item.romaji}: ${item.mastery}%`}
            >
              <span className="font-serif text-lg leading-none">{item.character}</span>
              <span className="font-sans text-[8px] opacity-80 leading-none mt-0.5">{item.romaji}</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};
