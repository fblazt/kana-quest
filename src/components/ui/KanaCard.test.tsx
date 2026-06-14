import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KanaCard } from './KanaCard';
import type { Kana } from '../../types/kana';

const mockKana: Kana = {
  id: 'h-a',
  character: 'あ',
  romaji: 'a',
  type: 'hiragana',
  totalCorrect: 0,
  totalWrong: 0,
  repetitions: 0,
  interval: 0,
  easeFactor: 2.5,
  nextReview: 0,
  averageResponseTime: 0
};

describe('KanaCard', () => {
  it('renders the character on the front', () => {
    render(<KanaCard kana={mockKana} />);
    expect(screen.getByText('あ')).toBeInTheDocument();
  });

  it('renders the romaji on the back', () => {
    render(<KanaCard kana={mockKana} />);
    expect(screen.getByText('a')).toBeInTheDocument();
  });
});
