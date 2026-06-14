import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { SessionSummary } from './SessionSummary';

describe('SessionSummary', () => {
  it('renders completion message and stats', () => {
    render(<MemoryRouter><SessionSummary /></MemoryRouter>);
    expect(screen.getByText('Session Complete')).toBeInTheDocument();
    expect(screen.getByText('Well done.')).toBeInTheDocument();
    expect(screen.getByText('94%')).toBeInTheDocument();
    expect(screen.getByText('1.2s')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('renders continue practice link', () => {
    render(<MemoryRouter><SessionSummary /></MemoryRouter>);
    const link = screen.getByText('Continue Practice').closest('a');
    expect(link).toHaveAttribute('href', '/');
  });
});
