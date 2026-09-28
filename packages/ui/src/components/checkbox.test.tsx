import { renderWithProviders, screen } from '@repo/testing';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('announces the indeterminate state as mixed', () => {
    renderWithProviders(<Checkbox label="All locations" checked="indeterminate" />);
    expect(screen.getByRole('checkbox', { name: 'All locations' })).toHaveAttribute('aria-checked', 'mixed');
  });

  it('checks an indeterminate box on click', async () => {
    const onCheckedChange = vi.fn();
    const { user } = renderWithProviders(
      <Checkbox label="All locations" checked="indeterminate" onCheckedChange={onCheckedChange} />,
    );
    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('toggles from its label and links help text', async () => {
    const { user } = renderWithProviders(<Checkbox label="Charge tax" helpText="At checkout." />);
    const checkbox = screen.getByRole('checkbox', { name: 'Charge tax' });
    expect(checkbox).toHaveAccessibleDescription('At checkout.');
    await user.click(screen.getByText('Charge tax'));
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('marks itself invalid', () => {
    renderWithProviders(<Checkbox label="Accept" invalid />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });
});
