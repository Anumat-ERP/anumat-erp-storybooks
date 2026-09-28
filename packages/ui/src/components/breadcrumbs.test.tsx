import { renderWithProviders, screen } from '@repo/testing';
import { describe, expect, it } from 'vitest';
import { Breadcrumbs } from './breadcrumbs';

const trail = [
  { label: 'Home', href: '/' },
  { label: 'Settings', href: '/settings' },
  { label: 'Shipping', href: '/settings/shipping' },
  { label: 'Zones', href: '/settings/shipping/zones' },
  { label: 'Europe', href: '/settings/shipping/zones/eu' },
  { label: 'Germany' },
];

describe('Breadcrumbs', () => {
  it('is a labelled nav with an ordered list and marks the last item as the current page', () => {
    renderWithProviders(<Breadcrumbs items={trail.slice(0, 3)} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav.querySelector('ol')).not.toBeNull();
    const current = screen.getByText('Shipping');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.tagName).not.toBe('A');
    expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveAttribute('aria-current');
  });

  it('collapses the middle of long trails and expands it on request', async () => {
    const { user } = renderWithProviders(<Breadcrumbs items={trail} maxItems={4} />);
    expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Show 3 more levels' }));
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveFocus();
    expect(screen.getByText('Germany')).toHaveAttribute('aria-current', 'page');
  });
});
