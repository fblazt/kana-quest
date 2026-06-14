import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SessionSummary } from './SessionSummary';

const mockSessionState = {
  totalAnswered: 20,
  totalCorrect: 19,
  totalTime: 24000,
  maxStreak: 15,
  masteredKana: ['h-ke', 'h-ko'],
  confusedPairs: [{ shown: 'h-a', answered: 'o' }],
  mode: 'practice',
  score: 19,
};

describe('SessionSummary', () => {
  it('renders completion message and stats', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/session-summary', state: mockSessionState }]}>
        <Routes>
          <Route path="/session-summary" element={<SessionSummary />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Session Complete')).toBeInTheDocument();
    expect(screen.getByText('Well done.')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('1.2s')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('renders continue practice link', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/session-summary', state: mockSessionState }]}>
        <Routes>
          <Route path="/session-summary" element={<SessionSummary />} />
        </Routes>
      </MemoryRouter>
    );
    const link = screen.getByText('Continue Practice').closest('a');
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('renders default state when no state provided', () => {
    render(
      <MemoryRouter initialEntries={['/session-summary']}>
        <Routes>
          <Route path="/session-summary" element={<SessionSummary />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('0.0s')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
