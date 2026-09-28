import { renderWithProviders, screen } from '@repo/testing';
import { describe, expect, it, vi } from 'vitest';
import { SettingToggle } from './setting-toggle';

describe('SettingToggle', () => {
  it('uses a button, not a switch', () => {
    renderWithProviders(<SettingToggle title="Automatic tax" enabled={false} />);
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Turn on Automatic tax' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Automatic tax is off');
  });

  it('calls onToggle and labels the action by the current state', async () => {
    const onToggle = vi.fn();
    const { user } = renderWithProviders(<SettingToggle title="Automatic tax" enabled onToggle={onToggle} />);
    await user.click(screen.getByRole('button', { name: 'Turn off Automatic tax' }));
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('Automatic tax is on');
  });

  it('ignores clicks while loading and announces busy', async () => {
    const onToggle = vi.fn();
    const { user } = renderWithProviders(<SettingToggle title="Automatic tax" enabled={false} loading onToggle={onToggle} />);
    const button = screen.getByRole('button', { name: /Turn on/ });
    expect(button).toHaveAttribute('aria-busy', 'true');
    await user.click(button);
    expect(onToggle).not.toHaveBeenCalled();
  });
});
