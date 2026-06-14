import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
  it('renders the streak and mastery gauge', async () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText(/Day Streak/)).toBeInTheDocument();
    });
  });

  it('renders practice links', async () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Continue Practice')).toBeInTheDocument();
    });
    expect(screen.getByText('Speed')).toBeInTheDocument();
    expect(screen.getByText('Survival')).toBeInTheDocument();
  });

  it('renders kana progress cards', async () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('HIRAGANA')).toBeInTheDocument();
    });
    expect(screen.getByText('KATAKANA')).toBeInTheDocument();
  });
});
