import { renderWithProviders, screen, within } from '@repo/testing';
import { describe, expect, it, vi } from 'vitest';
import { DataTable, type DataTableColumn } from './data-table';

type Row = { id: string; sku: string; qty: number };
const rows: Row[] = [
  { id: '1', sku: 'B-10', qty: 9 },
  { id: '2', sku: 'A-2', qty: 100 },
  { id: '3', sku: 'C-1', qty: 25 },
];
const columns: DataTableColumn<Row>[] = [
  { id: 'sku', header: 'SKU', sortable: true },
  { id: 'qty', header: 'On hand', numeric: true, sortable: true },
];

const firstColumn = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((r) => within(r).getAllByRole('rowheader')[0]?.textContent);
const qtyColumn = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((r) => within(r).getAllByRole('cell').at(-1)?.textContent);

describe('DataTable', () => {
  it('sorts numbers numerically and sets aria-sort', async () => {
    const { user } = renderWithProviders(<DataTable caption="Stock" columns={columns} rows={rows} />);
    const header = screen.getByRole('columnheader', { name: /On hand/ });
    expect(header).not.toHaveAttribute('aria-sort');

    await user.click(within(header).getByRole('button'));
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    expect(qtyColumn()).toEqual(['9', '25', '100']);

    await user.click(within(header).getByRole('button'));
    expect(header).toHaveAttribute('aria-sort', 'descending');
    expect(qtyColumn()).toEqual(['100', '25', '9']);
  });

  it('sorts strings with localeCompare', async () => {
    const { user } = renderWithProviders(<DataTable caption="Stock" columns={columns} rows={rows} />);
    await user.click(screen.getByRole('button', { name: /SKU/ }));
    expect(firstColumn()).toEqual(['A-2', 'B-10', 'C-1']);
  });

  it('in controlled mode reports the sort and keeps row order', async () => {
    const onSort = vi.fn();
    const { user } = renderWithProviders(
      <DataTable caption="Stock" columns={columns} rows={rows} sort={null} onSort={onSort} />,
    );
    await user.click(screen.getByRole('button', { name: /On hand/ }));
    expect(onSort).toHaveBeenCalledWith({ columnId: 'qty', direction: 'ascending' });
    expect(qtyColumn()).toEqual(['9', '100', '25']);
  });

  it('is a scrollable, keyboard-focusable region named by the caption', () => {
    renderWithProviders(<DataTable caption="Stock levels" columns={columns} rows={rows} />);
    expect(screen.getByRole('region', { name: 'Stock levels' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('table', { name: 'Stock levels' })).toBeInTheDocument();
  });

  it('header checkbox selects only the page', async () => {
    const onSelectionChange = vi.fn();
    const { user } = renderWithProviders(
      <DataTable
        caption="Stock"
        columns={columns}
        rows={rows}
        totalCount={500}
        selectedRows={[]}
        onSelectionChange={onSelectionChange}
      />,
    );
    await user.click(screen.getByRole('checkbox', { name: /on this page/ }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(['1', '2', '3']);
  });
});
