import { renderWithProviders, screen } from '@repo/testing';
import { describe, expect, it } from 'vitest';
import { Banner } from './banner';

describe('Banner', () => {
  it('announces critical banners assertively with role="alert"', () => {
    renderWithProviders(<Banner tone="critical" title="Payouts are paused" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Payouts are paused');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it.each(['info', 'success', 'warning'] as const)('announces %s banners politely with role="status"', (tone) => {
    renderWithProviders(<Banner tone={tone} title="Heads up" />);
    expect(screen.getByRole('status')).toHaveTextContent('Heads up');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('calls onDismiss from a named close button', async () => {
    let dismissed = false;
    const { user } = renderWithProviders(<Banner title="Saved" onDismiss={() => (dismissed = true)} />);
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(dismissed).toBe(true);
  });
});
