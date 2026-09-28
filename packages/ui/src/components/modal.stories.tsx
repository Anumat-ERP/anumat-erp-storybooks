import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, Lock, Trash2, WifiOff } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { fn } from 'storybook/test';
import { Button } from './button';
import {
  ConfirmDialog,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalRoot,
  ModalTrigger,
} from './modal';
import { Stack } from './stack';

/** A plain labelled textarea in token styles, so the stories don't depend on form components. */
function NoteField({ defaultValue = 'Leave at the side door. Ring twice.' }: { defaultValue?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-md font-medium text-fg">Note</span>
      <textarea
        defaultValue={defaultValue}
        rows={3}
        className="rounded-md border border-border-input bg-surface px-3 py-2 text-md text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
    </label>
  );
}

function Notice({ tone, icon, children }: { tone: 'critical' | 'warning' | 'info'; icon: ReactNode; children: ReactNode }) {
  const tones = {
    critical: 'border-critical-border bg-critical-subtle text-critical-subtle-fg',
    warning: 'border-warning-border bg-warning-subtle text-warning-subtle-fg',
    info: 'border-info-border bg-info-subtle text-info-subtle-fg',
  } as const;
  return (
    <div
      role={tone === 'critical' ? 'alert' : 'status'}
      className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0 ${tones[tone]}`}
    >
      <span aria-hidden className="inline-flex">
        {icon}
      </span>
      <div>{children}</div>
    </div>
  );
}

const meta = {
  title: 'components/Modal',
  component: Modal,
  args: {
    title: 'Edit order note',
    description: 'The note is visible to staff only.',
    defaultOpen: true,
    size: 'md',
    trigger: <Button>Edit note</Button>,
    primaryAction: { content: 'Save note', onAction: fn() },
    secondaryActions: [{ content: 'Cancel' }],
    children: <NoteField />,
    onOpenChange: fn(),
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title. Required — it is the dialog’s accessible name. Name the task: “Edit order note”.',
      table: { type: { summary: 'ReactNode' } },
    },
    hideTitle: {
      control: 'boolean',
      description: 'Hide the title visually but keep it as the accessible name (e.g. an image viewer).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    description: {
      control: 'text',
      description: 'Supporting line under the title; becomes the dialog’s accessible description.',
      table: { type: { summary: 'ReactNode' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg', 'fullscreen'],
      description: '`sm` 400px for short confirmations, `md` 560px for most forms, `lg` 800px for dense content, `fullscreen` for editors.',
      table: { type: { summary: "'sm' | 'md' | 'lg' | 'fullscreen'" }, defaultValue: { summary: 'md' } },
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state. Pair with `onOpenChange`.',
      table: { type: { summary: 'boolean' } },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onOpenChange: {
      control: false,
      description: 'Called when the modal asks to open or close: trigger, Escape, backdrop click, close button, a secondary action without `onAction`.',
      table: { type: { summary: '(open: boolean) => void' } },
    },
    trigger: {
      control: false,
      description: 'Element that opens the modal, usually a Button. Focus returns to it on close.',
      table: { type: { summary: 'ReactNode' } },
    },
    primaryAction: {
      control: 'object',
      description: 'The main action, last in the footer. `destructive` renders it critical; `loading` keeps its size.',
      table: { type: { summary: '{ content: string; onAction?: () => void; loading?: boolean; destructive?: boolean; disabled?: boolean }' } },
    },
    secondaryActions: {
      control: 'object',
      description: 'Secondary buttons before the primary. One without `onAction` closes the modal (the usual Cancel).',
      table: { type: { summary: 'ModalAction[]' } },
    },
    footer: {
      control: 'text',
      description: 'Content at the start of the footer: help text, a “Don’t show again” checkbox.',
      table: { type: { summary: 'ReactNode' } },
    },
    children: {
      control: false,
      description: 'The body. It scrolls when long; the header and footer stay visible.',
      table: { type: { summary: 'ReactNode' } },
    },
  },
  parameters: {
    // Open dialogs make the rest of the page inert, so each story renders in its own iframe.
    docs: {
      story: { inline: false, height: '480px' },
      description: {
        component: [
          'A dialog that blocks the page until the merchant finishes or dismisses a focused task. Built on Radix Dialog: focus is trapped inside, Escape and a backdrop click close it, and focus returns to the trigger.',
          '',
          '**Use** for short, self-contained tasks that need full attention — edit a note, rename a location, confirm a change. Use `ConfirmDialog` for destructive confirmations: it states what will be deleted and how many.',
          '',
          '**Don’t use** for long forms or content the merchant wants to compare with the page (use a Drawer or a page), for information that could sit inline (use a Banner), or from inside another modal. A title is required — `hideTitle` hides it visually only.',
          '',
          'Compose with `ModalRoot`, `ModalTrigger`, `ModalContent`, `ModalHeader`, `ModalBody` and `ModalFooter` when the simple API is not enough.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Closed: Story = {
  args: { defaultOpen: false },
  parameters: { docs: { story: { inline: true, height: undefined } } },
};

export const Small: Story = {
  args: {
    size: 'sm',
    title: 'Archive order #1042?',
    description: 'Archived orders are hidden from the list but stay searchable.',
    children: undefined,
    trigger: <Button>Archive</Button>,
    primaryAction: { content: 'Archive order', onAction: fn() },
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    title: 'Import products',
    description: 'Upload a CSV with one product per row.',
    trigger: <Button>Import</Button>,
    primaryAction: { content: 'Import 128 products', onAction: fn() },
    footer: 'Existing products with the same SKU are updated.',
    children: (
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-fg-muted">
            <tr>
              {['SKU', 'Title', 'Price', 'Stock'].map((h) => (
                <th key={h} className="px-3 py-2 text-start font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              ['TS-001', 'Organic cotton tee', '$24.00', '140'],
              ['TS-002', 'Linen shirt', '$58.00', '32'],
              ['HD-010', 'Merino hoodie', '$96.00', '12'],
            ].map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) => (
                  <td key={i} className="px-3 py-2 text-fg">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
};

export const Fullscreen: Story = {
  args: {
    size: 'fullscreen',
    title: 'Edit email template',
    trigger: <Button>Edit template</Button>,
    primaryAction: { content: 'Save template', onAction: fn() },
    children: (
      <textarea
        aria-label="Template"
        defaultValue={'Hi {{ customer.first_name }},\n\nThanks for your order.'}
        className="h-full min-h-64 w-full rounded-md border border-border-input bg-surface p-3 font-mono text-sm text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
    ),
  },
};

/** Loading: the primary action is saving. It keeps its size; the rest of the dialog stays put. */
export const Loading: Story = {
  args: { primaryAction: { content: 'Save note', loading: true } },
};

/** Error: the save failed. The reason sits at the top of the body; the form keeps what was typed. */
export const ErrorState: Story = {
  name: 'Error',
  args: {
    primaryAction: { content: 'Try again', onAction: fn() },
    children: (
      <Stack gap={4}>
        <Notice tone="critical" icon={<AlertTriangle />}>
          The note couldn’t be saved: the order was edited by someone else. Reload the order and try again.
        </Notice>
        <NoteField />
      </Stack>
    ),
  },
};

/** Permission: the merchant can read but not change it. Say why and who can. */
export const Permission: Story = {
  args: {
    primaryAction: { content: 'Save note', disabled: true },
    secondaryActions: [{ content: 'Close' }],
    children: (
      <Stack gap={4}>
        <Notice tone="info" icon={<Lock />}>
          Only staff with the “Edit orders” permission can change notes. Ask a store owner for access.
        </Notice>
        <NoteField />
      </Stack>
    ),
  },
};

/** Offline: saving needs the network. The action waits; nothing typed is lost. */
export const Offline: Story = {
  args: {
    primaryAction: { content: 'Save note', disabled: true },
    children: (
      <Stack gap={4}>
        <Notice tone="warning" icon={<WifiOff />}>
          You’re offline. Your note is kept here and you can save it when you reconnect.
        </Notice>
        <NoteField />
      </Stack>
    ),
  },
};

/** Empty: the task has nothing to choose from yet — say so and offer the way forward. */
export const Empty: Story = {
  args: {
    title: 'Add products to collection',
    description: undefined,
    primaryAction: { content: 'Add products', disabled: true },
    children: (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <p className="text-md font-medium text-fg">You don’t have any products yet</p>
        <p className="text-sm text-fg-muted">Create a product first, then add it to this collection.</p>
        <Button variant="secondary" size="sm" className="mt-2">
          Create product
        </Button>
      </div>
    ),
  },
};

/** Overflow: a long title wraps; long content scrolls between a fixed header and footer. */
export const Overflow: Story = {
  args: {
    title: 'Review changes to the “Summer clearance — 40% off selected swimwear, sandals and accessories” discount',
    description: 'These changes apply to every order placed after you save.',
    primaryAction: { content: 'Save discount', onAction: fn() },
    footer: '24 changes',
    children: (
      <ol className="flex list-decimal flex-col gap-3 ps-5 text-md">
        {Array.from({ length: 24 }, (_, i) => (
          <li key={i}>
            Changed the minimum purchase requirement on rule {i + 1} from $50.00 to $75.00 and excluded sale items.
          </li>
        ))}
      </ol>
    ),
  },
};

export const HiddenTitle: Story = {
  args: {
    title: 'Product image',
    hideTitle: true,
    description: undefined,
    primaryAction: undefined,
    secondaryActions: undefined,
    children: (
      <div className="flex aspect-video items-center justify-center rounded-md bg-surface-sunken text-fg-muted">
        Image preview
      </div>
    ),
  },
};

/** Controlled: the parent owns `open` and closes the modal once the save finishes. */
export const Controlled: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    const [saving, setSaving] = useState(false);
    return (
      <Modal
        {...args}
        open={open}
        onOpenChange={setOpen}
        defaultOpen={undefined}
        primaryAction={{
          content: 'Save note',
          loading: saving,
          onAction: () => {
            setSaving(true);
            setTimeout(() => {
              setSaving(false);
              setOpen(false);
            }, 1200);
          },
        }}
      />
    );
  },
};

/** Composed from parts, for layouts the simple API does not cover. */
export const Composed: Story = {
  render: () => (
    <ModalRoot defaultOpen>
      <ModalTrigger asChild>
        <Button>Customer details</Button>
      </ModalTrigger>
      <ModalContent size="sm" aria-describedby={undefined}>
        <ModalHeader title="Ana Souza" />
        <ModalBody>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-md">
            <dt className="text-fg-muted">Email</dt>
            <dd>ana@example.com</dd>
            <dt className="text-fg-muted">Orders</dt>
            <dd>12</dd>
            <dt className="text-fg-muted">Spent</dt>
            <dd>$1,284.00</dd>
          </dl>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary">View customer</Button>
        </ModalFooter>
      </ModalContent>
    </ModalRoot>
  ),
};

/** ConfirmDialog: says what will be deleted and how many, lists the items, and focuses Cancel first. */
export const ConfirmDelete: Story = {
  render: () => (
    <ConfirmDialog
      defaultOpen
      trigger={
        <Button variant="critical" icon={<Trash2 aria-hidden />}>
          Delete 7 products
        </Button>
      }
      resourceName={{ singular: 'product', plural: 'products' }}
      count={7}
      items={['Organic cotton tee', 'Linen shirt', 'Merino hoodie', 'Canvas tote', 'Wool beanie', 'Silk scarf', 'Denim jacket']}
      onConfirm={fn()}
    />
  ),
};

export const ConfirmSingle: Story = {
  render: () => (
    <ConfirmDialog
      defaultOpen
      trigger={<Button variant="critical">Delete customer</Button>}
      resourceName={{ singular: 'customer', plural: 'customers' }}
      items={['Ana Souza']}
      consequence="Their order history stays, but is no longer linked to a customer."
      onConfirm={fn()}
    />
  ),
};

/** ConfirmDialog, async: returning a promise keeps it open with a loading button; a failure keeps it open with the error. */
export const ConfirmError: Story = {
  name: 'Confirm error',
  render: function Render() {
    const [error, setError] = useState<string | undefined>('3 of the orders are still being fulfilled. Cancel fulfilment first.');
    return (
      <ConfirmDialog
        defaultOpen
        trigger={<Button variant="critical">Delete orders</Button>}
        resourceName={{ singular: 'order', plural: 'orders' }}
        count={12}
        error={error}
        onConfirm={() =>
          new Promise((_, reject) =>
            setTimeout(() => {
              setError('Still failing — try again later.');
              reject(new Error('failed'));
            }, 800),
          )
        }
      />
    );
  },
};
