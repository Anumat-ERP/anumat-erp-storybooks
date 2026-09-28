import { renderWithProviders, screen, waitFor } from '@repo/testing';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';
import { ConfirmDialog, Modal } from './modal';

function Example() {
  return (
    <Modal
      title="Edit note"
      trigger={<Button>Edit note</Button>}
      primaryAction={{ content: 'Save', onAction: () => {} }}
      secondaryActions={[{ content: 'Cancel' }]}
    >
      <label>
        Note <input />
      </label>
    </Modal>
  );
}

describe('Modal', () => {
  it('traps focus inside the dialog', async () => {
    const { user } = renderWithProviders(<Example />);
    await user.click(screen.getByRole('button', { name: 'Edit note' }));
    const dialog = await screen.findByRole('dialog', { name: 'Edit note' });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    // Tab through more stops than the dialog has; focus never leaves it.
    for (let i = 0; i < 6; i += 1) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
    await user.tab({ shift: true });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const { user } = renderWithProviders(<Example />);
    const trigger = screen.getByRole('button', { name: 'Edit note' });
    await user.click(trigger);
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('closes from a secondary action without onAction and returns focus', async () => {
    const { user } = renderWithProviders(<Example />);
    const trigger = screen.getByRole('button', { name: 'Edit note' });
    await user.click(trigger);
    await user.click(await screen.findByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('uses the description as the accessible description', async () => {
    renderWithProviders(<Modal open title="Archive" description="Archived orders are hidden." />);
    expect(await screen.findByRole('dialog', { name: 'Archive' })).toHaveAccessibleDescription('Archived orders are hidden.');
  });
});

describe('ConfirmDialog', () => {
  it('states the count and confirms', async () => {
    const onConfirm = vi.fn();
    const { user } = renderWithProviders(
      <ConfirmDialog
        defaultOpen
        resourceName={{ singular: 'order', plural: 'orders' }}
        count={3}
        onConfirm={onConfirm}
      />,
    );
    const dialog = await screen.findByRole('alertdialog', { name: 'Delete 3 orders?' });
    expect(dialog).toHaveTextContent('This permanently deletes 3 orders.');
    await user.click(screen.getByRole('button', { name: 'Delete 3 orders' }));
    expect(onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });
});
