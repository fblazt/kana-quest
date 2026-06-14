import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressChip } from './ProgressChip';

describe('ProgressChip', () => {
  it('renders label correctly', () => {
    render(<ProgressChip label="Novice" level="low" />);
    expect(screen.getByText('Novice')).toBeInTheDocument();
  });

  it('applies low level styles', () => {
    render(<ProgressChip label="Novice" level="low" />);
    expect(screen.getByText('Novice').className).toContain('bg-error-container');
  });

  it('applies high level styles', () => {
    render(<ProgressChip label="Master" level="high" />);
    expect(screen.getByText('Master').className).toContain('bg-primary-fixed');
  });
});
