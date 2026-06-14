import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { PracticeScreen } from './PracticeScreen';

describe('PracticeScreen', () => {
  it('renders the kana card and input', () => {
    render(<MemoryRouter><PracticeScreen /></MemoryRouter>);
    expect(screen.getByText('あ')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type romaji...')).toBeInTheDocument();
  });
});
