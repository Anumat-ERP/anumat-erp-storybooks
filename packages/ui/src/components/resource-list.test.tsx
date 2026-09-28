import { renderWithProviders, screen } from '@repo/testing';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { Selection } from './bulk-actions';
import { ResourceItem, ResourceList } from './resource-list';

const customers = Array.from({ length: 3 }, (_, i) => ({ id: `c${i + 1}`, name: `Customer ${i + 1}` }));

function Harness({ onClick, onChange }: { onClick?: (id: string) => void; onChange?: (s: Selection) => void }) {
  const [selected, setSelected] = useState<Selection>([]);
  return (
    <ResourceList
      items={customers}
      resourceName={{ singular: 'customer', plural: 'customers' }}
      totalItemsCount={1284}
      selectedItems={selected}
      onSelectionChange={(next) => {
        setSelected(next);
        onChange?.(next);
      }}
      renderItem={(item) => <ResourceItem name={item.name} url={`#${item.id}`} onClick={onClick} />}
    />
  );
}

describe('ResourceList', () => {
  it('selecting a row with its checkbox does not activate the row', async () => {
    const onClick = vi.fn();
    const onChange = vi.fn();
    const { user } = renderWithProviders(<Harness onClick={onClick} onChange={onChange} />);
    await user.click(screen.getByRole('checkbox', { name: 'Select Customer 2' }));
    expect(onChange).toHaveBeenLastCalledWith(['c2']);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows the count against the total', () => {
    renderWithProviders(<Harness />);
    expect(screen.getByText('Showing 3 of 1,284 customers')).toBeInTheDocument();
  });

  it('header checkbox selects only the page; "Select all" then yields All', async () => {
    const onChange = vi.fn();
    const { user } = renderWithProviders(<Harness onChange={onChange} />);
    await user.click(screen.getByRole('checkbox', { name: 'Select all 3 customers on this page' }));
    expect(onChange).toHaveBeenLastCalledWith(['c1', 'c2', 'c3']);
    expect(screen.getByText('3 selected on this page')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Select all 1,284 customers' }));
    expect(onChange).toHaveBeenLastCalledWith('All');
    expect(screen.getAllByText('All 1,284 customers selected').length).toBeGreaterThan(0);
  });

  it('Space on a focused row toggles selection in select mode', async () => {
    const onChange = vi.fn();
    const { user } = renderWithProviders(<Harness onChange={onChange} />);
    await user.click(screen.getByRole('checkbox', { name: 'Select Customer 1' }));
    screen.getByRole('link', { name: 'Customer 3' }).focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith(['c1', 'c3']);
  });
});
