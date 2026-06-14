import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
  it('renders the streak and mastery gauge', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>);
    expect(screen.getByText(/Day Streak/)).toBeInTheDocument();
    expect(screen.getByText('68%')).toBeInTheDocument();
  });

  it('renders practice links', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>);
    const continueLink = screen.getByText('Continue Practice').closest('a');
    expect(continueLink).toHaveAttribute('href', '/practice');
    expect(screen.getByText('Speed')).toBeInTheDocument();
    expect(screen.getByText('Survival')).toBeInTheDocument();
  });

  it('renders kana progress cards', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>);
    expect(screen.getByText('HIRAGANA')).toBeInTheDocument();
    expect(screen.getByText('KATAKANA')).toBeInTheDocument();
  });
});
