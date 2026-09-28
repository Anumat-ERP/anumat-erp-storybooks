import { renderWithProviders, screen } from '@repo/testing';
import { describe, expect, it, vi } from 'vitest';
import { SearchField } from './search-field';

describe('SearchField', () => {
  it('debounces onChange and clears immediately', async () => {
    const onChange = vi.fn();
    const { user } = renderWithProviders(<SearchField label="Search orders" onChange={onChange} debounceMs={50} />);
    await user.type(screen.getByRole('searchbox', { name: 'Search orders' }), 'acme');
    expect(onChange).not.toHaveBeenCalled();
    await vi.waitFor(() => expect(onChange).toHaveBeenCalledWith('acme'));
    expect(onChange).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onChange).toHaveBeenLastCalledWith('');
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });
});
