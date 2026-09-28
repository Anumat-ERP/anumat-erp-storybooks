import { renderWithProviders, screen } from '@repo/testing';
import { describe, expect, it, vi } from 'vitest';
import { Filters } from './filters';

describe('Filters', () => {
  const filters = [
    { key: 'status', label: 'Status', filter: <p>Status options</p> },
    { key: 'channel', label: 'Channel', filter: <p>Channel options</p> },
  ];

  it('names the remove button after the filter and shows the applied value', async () => {
    const onRemove = vi.fn();
    const { user } = renderWithProviders(
      <Filters
        filters={filters}
        appliedFilters={[{ key: 'status', label: 'Paid, Refunded', onRemove }]}
        onClearAll={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: 'Status: Paid, Refunded' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove Status filter' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('announces the applied filters', () => {
    renderWithProviders(
      <Filters filters={filters} appliedFilters={[{ key: 'status', label: 'Paid', onRemove: () => {} }]} onClearAll={() => {}} />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('1 filter applied. Status: Paid');
  });

  it('opens the filter popover from a pill', async () => {
    const { user } = renderWithProviders(
      <Filters filters={filters} appliedFilters={[{ key: 'status', label: 'Paid', onRemove: () => {} }]} onClearAll={() => {}} />,
    );
    await user.click(screen.getByRole('button', { name: 'Status: Paid' }));
    expect(screen.getByText('Status options')).toBeVisible();
  });
});
