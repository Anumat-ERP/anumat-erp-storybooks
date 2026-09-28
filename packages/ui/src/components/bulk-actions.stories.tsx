import type { Meta, StoryObj } from '@storybook/react-vite';
import { Archive, Printer, Tag } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { BulkActions, SelectAllActions, type BulkAction, type BulkActionsProps } from './bulk-actions';
import { Stack } from './stack';

const ORDERS = { singular: 'order', plural: 'orders' };

const promoted: BulkAction[] = [
  { content: 'Mark as paid', onAction: fn() },
  { content: 'Print packing slips', icon: <Printer aria-hidden />, onAction: fn() },
];
const more: BulkAction[] = [
  { content: 'Add tags', icon: <Tag aria-hidden />, onAction: fn() },
  { content: 'Archive', icon: <Archive aria-hidden />, onAction: fn() },
  { content: 'Delete', destructive: true, onAction: fn() },
];

const meta = {
  title: 'components/BulkActions',
  component: BulkActions,
  args: {
    selectedCount: 12,
    pageItemCount: 50,
    totalCount: 1284,
    resourceName: ORDERS,
    promotedActions: promoted,
    actions: more,
    onSelectAll: fn(),
    onClearSelection: fn(),
    onUndoSelectAll: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl rounded-lg border border-border bg-surface-muted px-3 py-2">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    selectedCount: { control: 'number', description: 'Rows selected. Ignored when `allSelected`.', table: { type: { summary: 'number' } } },
    pageItemCount: { control: 'number', description: 'Rows visible on this page.', table: { type: { summary: 'number' } } },
    totalCount: {
      control: 'number',
      description: 'Records matching the filters across all pages. When the whole page is selected and more exist, “Select all N” appears.',
      table: { type: { summary: 'number' }, defaultValue: { summary: 'pageItemCount' } },
    },
    allSelected: {
      control: 'boolean',
      description: 'Every matching record is selected (`"All"`), including unloaded pages.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    resourceName: { control: 'object', description: 'Record name in counts and destructive labels.', table: { type: { summary: '{ singular: string; plural: string }' } } },
    selectedIds: { control: false, description: 'Ids passed to actions. Empty when `allSelected`.', table: { type: { summary: 'string[]' } } },
    promotedActions: {
      control: false,
      description: 'Up to three actions as buttons. `destructive` ones get the count appended (“Delete 12 orders”).',
      table: { type: { summary: '{ content; onAction(scope); destructive?; disabled?; disabledReason?; icon? }[]' } },
    },
    actions: { control: false, description: 'Further actions in “More actions”.', table: { type: { summary: 'BulkAction[]' } } },
    onSelectAll: { control: false, description: 'Escalate to every matching record.', table: { type: { summary: '() => void' } } },
    onClearSelection: { control: false, description: 'Clear the selection.', table: { type: { summary: '() => void' } } },
    onUndoSelectAll: { control: false, description: 'From “all”, go back to the visible page.', table: { type: { summary: '() => void' } } },
    disabled: { control: 'boolean', description: 'Disable every action (e.g. offline).', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    disabledReason: { control: 'text', description: 'Why actions are disabled; shown beside them.', table: { type: { summary: 'string' } } },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'The bar shown while rows are selected: the exact count and scope, the explicit step up to every record, and the actions that apply.',
          '',
          '**Use** with ResourceList, DataTable and IndexTable (they render it from `promotedBulkActions` / `bulkActions`) or a custom list.',
          '',
          '**Don’t use** for actions on one record — put those on the row. Don’t hide the scope: a header checkbox selects the *visible page*, and people assume it selected everything. The bar says “50 selected on this page” and offers “Select all 1,284 orders”; once taken it says “All 1,284 orders selected”, and destructive actions read “Delete all 1,284 orders”.',
          '',
          'The count is announced politely (`aria-live`) whenever it changes. `SelectAllActions` is exported separately for custom bars.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof BulkActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The whole visible page is selected, and more exist. */
export const PageSelected: Story = { args: { selectedCount: 50 } };

/** Every matching record is selected. Destructive labels change to “all 1,284”. */
export const AllSelected: Story = { args: { selectedCount: 50, allSelected: true } };

function FlowDemo(args: BulkActionsProps) {
  const [state, setState] = useState<'none' | 'page' | 'all'>('page');
  return (
    <Stack gap={3}>
      <BulkActions
        {...args}
        selectedCount={state === 'none' ? 0 : 50}
        allSelected={state === 'all'}
        onSelectAll={() => setState('all')}
        onUndoSelectAll={() => setState('page')}
        onClearSelection={() => setState('none')}
      />
      {state === 'none' ? (
        <button type="button" className="self-start text-sm text-fg-link underline" onClick={() => setState('page')}>
          Select the page again
        </button>
      ) : null}
    </Stack>
  );
}

/** Try it: select all 1,284, undo, clear. The count is announced each time. */
export const SelectAllFlow: Story = { render: (args) => <FlowDemo {...args} /> };

/** Only the count and scope — for a custom bar. */
export const SelectAllActionsOnly: Story = {
  render: () => (
    <Stack gap={3}>
      <SelectAllActions selectedCount={50} pageItemCount={50} totalCount={1284} resourceName={ORDERS} onSelectAll={fn()} onClearSelection={fn()} />
      <SelectAllActions selectedCount={50} pageItemCount={50} totalCount={1284} allSelected resourceName={ORDERS} onUndoSelectAll={fn()} onClearSelection={fn()} />
    </Stack>
  ),
};

/** Loading isn't a bar state — actions show progress themselves; here, one action is still running. */
export const Loading: Story = {
  args: { promotedActions: [{ content: 'Mark as paid', onAction: fn(), disabled: true, disabledReason: 'Marking 12 orders as paid…' }] },
};

export const ErrorState: Story = {
  name: 'Error',
  render: (args) => (
    <Stack gap={2}>
      <BulkActions {...args} />
      <p role="alert" className="text-sm text-critical-subtle-fg">
        Couldn’t archive 3 of 12 orders — they have open returns. The other 9 were archived.
      </p>
    </Stack>
  ),
};

/** Permission: delete is unavailable to this role, with the reason in the menu. */
export const Permission: Story = {
  args: {
    promotedActions: [
      promoted[0] as BulkAction,
      { content: 'Delete', destructive: true, disabled: true, disabledReason: 'Only admins can delete orders', onAction: fn() },
    ],
    actions: [{ content: 'Refund', disabled: true, disabledReason: 'Needs the Refunds permission', onAction: fn() }],
  },
};

/** Offline: every action is disabled, and the bar says why. */
export const Offline: Story = { args: { disabled: true, disabledReason: 'You’re offline — actions resume when you reconnect.' } };

/** Overflow: long labels and big counts wrap onto a second line instead of overflowing. */
export const Overflow: Story = {
  args: {
    selectedCount: 250,
    pageItemCount: 250,
    totalCount: 1_284_503,
    resourceName: { singular: 'purchase order line', plural: 'purchase order lines' },
    promotedActions: [
      { content: 'Send to supplier for confirmation', onAction: fn() },
      { content: 'Delete', destructive: true, onAction: fn() },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};
