import { renderWithProviders, screen } from '@repo/testing';
import { describe, expect, it, vi } from 'vitest';
import { BulkActions } from './bulk-actions';

const orders = { singular: 'order', plural: 'orders' };

describe('BulkActions', () => {
  it('states the count and offers the step up to all', async () => {
    const onSelectAll = vi.fn();
    const { user } = renderWithProviders(
      <BulkActions selectedCount={50} pageItemCount={50} totalCount={1284} resourceName={orders} onSelectAll={onSelectAll} />,
    );
    expect(screen.getByText('50 selected on this page')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('50 orders selected');
    await user.click(screen.getByRole('button', { name: 'Select all 1,284 orders' }));
    expect(onSelectAll).toHaveBeenCalledOnce();
  });

  it('labels destructive actions with the count and scope', async () => {
    const onAction = vi.fn();
    const { rerender, user } = renderWithProviders(
      <BulkActions
        selectedCount={50}
        pageItemCount={50}
        totalCount={1284}
        resourceName={orders}
        selectedIds={['a']}
        promotedActions={[{ content: 'Delete', destructive: true, onAction }]}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Delete 50 orders' }));
    expect(onAction).toHaveBeenCalledWith({ all: false, count: 50, ids: ['a'] });

    rerender(
      <BulkActions
        selectedCount={50}
        pageItemCount={50}
        totalCount={1284}
        allSelected
        resourceName={orders}
        promotedActions={[{ content: 'Delete', destructive: true, onAction }]}
      />,
    );
    expect(screen.getByText('All 1,284 orders selected', { ignore: '[role=status]' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('All 1,284 orders selected');
    expect(screen.getByRole('button', { name: 'Delete all 1,284 orders' })).toBeInTheDocument();
  });

  it('says only the count when part of the page is selected', () => {
    renderWithProviders(<BulkActions selectedCount={3} pageItemCount={50} totalCount={1284} resourceName={orders} />);
    expect(screen.getByText('3 selected')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Select all/ })).not.toBeInTheDocument();
  });
});
