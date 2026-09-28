import { renderWithProviders, screen, waitFor } from '@repo/testing';
import { describe, expect, it, vi } from 'vitest';
import { ActionMenu, PageActions } from './action-menu';
import { Button } from './button';

describe('ActionMenu', () => {
  it('opens and invokes onAction', async () => {
    const onDuplicate = vi.fn();
    const onDelete = vi.fn();
    const { user } = renderWithProviders(
      <ActionMenu
        trigger={<Button>More actions</Button>}
        sections={[
          { items: [{ content: 'Duplicate', onAction: onDuplicate }] },
          { title: 'Danger zone', items: [{ content: 'Delete', onAction: onDelete, destructive: true }] },
        ]}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'More actions' }));
    const menu = await screen.findByRole('menu');
    expect(screen.getByRole('group', { name: 'Danger zone' })).toBeInTheDocument();
    expect(menu).toBeInTheDocument();
    await user.click(screen.getByRole('menuitem', { name: 'Duplicate' }));
    expect(onDuplicate).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('does not invoke disabled items', async () => {
    const onAction = vi.fn();
    const { user } = renderWithProviders(
      <ActionMenu trigger={<Button>More</Button>} items={[{ content: 'Archive', onAction, disabled: true }]} />,
    );
    await user.click(screen.getByRole('button', { name: 'More' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Archive' }));
    expect(onAction).not.toHaveBeenCalled();
  });
});

describe('PageActions', () => {
  it('shows the first N as buttons and overflows the rest', async () => {
    const onExport = vi.fn();
    const { user } = renderWithProviders(
      <PageActions
        maxVisible={1}
        actions={[{ content: 'Print' }, { content: 'Export', onAction: onExport }]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Print' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Export' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'More actions' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Export' }));
    expect(onExport).toHaveBeenCalledOnce();
  });
});
