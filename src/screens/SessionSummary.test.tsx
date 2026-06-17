import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SessionSummary } from './SessionSummary';

const mockSessionState = {
  correct: 19,
  incorrect: 1,
  totalTime: 24000,
  score: 19,
  streak: 15,
  mistakes: {},
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
    expect(screen.getByText(/SESSION COMPLETE/i)).toBeInTheDocument();
    expect(screen.getByText('Well done.')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('1.2s')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('renders links correctly', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/session-summary', state: mockSessionState }]}>
        <Routes>
          <Route path="/session-summary" element={<SessionSummary />} />
        </Routes>
      </MemoryRouter>
    );
    
    const dashboardLink = screen.getByText('Return to Dashboard').closest('a');
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');

    const continueLink = screen.getByText('Continue Practice').closest('a');
    expect(continueLink).toHaveAttribute('href', '/practice/mode');
  });

  it('renders fallback state when no state provided', () => {
    render(
      <MemoryRouter initialEntries={['/session-summary']}>
        <Routes>
          <Route path="/session-summary" element={<SessionSummary />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('No session data found.')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });
});
