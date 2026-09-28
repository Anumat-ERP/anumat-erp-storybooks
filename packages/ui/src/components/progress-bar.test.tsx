import { renderWithProviders, screen } from '@repo/testing';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './progress-bar';

describe('ProgressBar', () => {
  it('is a native progress element with a value and an accessible name', () => {
    renderWithProviders(<ProgressBar label="Uploading images" value={45} />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading images' });
    expect(bar.tagName).toBe('PROGRESS');
    expect(bar).toHaveAttribute('value', '45');
    expect(bar).toHaveAttribute('max', '100');
  });

  it('clamps out-of-range values', () => {
    renderWithProviders(<ProgressBar label="Quota" value={140} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '100');
  });

  it('omits the value attribute when indeterminate', () => {
    renderWithProviders(<ProgressBar label="Preparing export" labelHidden />);
    const bar = screen.getByRole('progressbar', { name: 'Preparing export' });
    expect(bar.tagName).toBe('PROGRESS');
    expect(bar).not.toHaveAttribute('value');
  });
});
