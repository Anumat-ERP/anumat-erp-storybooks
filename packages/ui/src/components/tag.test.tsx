import { renderWithProviders, screen } from '@repo/testing';
import { describe, expect, it, vi } from 'vitest';
import { Tag } from './tag';

describe('Tag', () => {
  it('names the remove button after the tag', async () => {
    const onRemove = vi.fn();
    const { user } = renderWithProviders(<Tag onRemove={onRemove}>Wholesale</Tag>);
    await user.click(screen.getByRole('button', { name: 'Remove Wholesale' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('disables removal when disabled', () => {
    renderWithProviders(
      <Tag onRemove={() => undefined} disabled>
        Wholesale
      </Tag>,
    );
    expect(screen.getByRole('button', { name: 'Remove Wholesale' })).toBeDisabled();
  });

  it('renders a link tag with the full text as its title', () => {
    renderWithProviders(<Tag href="/customers?tag=vip">VIP</Tag>);
    expect(screen.getByRole('link', { name: 'VIP' })).toHaveAttribute('title', 'VIP');
  });
});
