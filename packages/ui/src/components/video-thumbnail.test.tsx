import { renderWithProviders, screen } from '@repo/testing';
import { describe, expect, it } from 'vitest';
import { VideoThumbnail } from './video-thumbnail';

describe('VideoThumbnail', () => {
  it('announces the spoken duration, not the clock-style text', () => {
    renderWithProviders(<VideoThumbnail accessibilityLabel="Play: Setting up shipping" videoLength={151} />);
    const button = screen.getByRole('button', { name: 'Play: Setting up shipping, 2 minutes 31 seconds' });
    // The visual `2:31` is present but hidden from assistive tech.
    const visual = screen.getByText('2:31');
    expect(button).toContainElement(visual);
    expect(visual).toHaveAttribute('aria-hidden', 'true');
  });

  it('includes watched time in the name', () => {
    renderWithProviders(<VideoThumbnail videoLength={151} videoProgress={60} />);
    expect(
      screen.getByRole('button', { name: 'Play video, 2 minutes 31 seconds, 1 minute watched' }),
    ).toBeInTheDocument();
  });
});
