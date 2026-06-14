import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { PracticeScreen } from './PracticeScreen';

describe('PracticeScreen', () => {
  it('renders loading state initially', () => {
    render(<MemoryRouter><PracticeScreen /></MemoryRouter>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
