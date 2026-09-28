import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Pagination } from './pagination';

const meta = {
  title: 'components/Pagination',
  component: Pagination,
  args: {
    'aria-label': 'Orders pagination',
    page: 2,
    pageCount: 14,
    hasPrevious: true,
    hasNext: true,
    onPrevious: fn(),
    onNext: fn(),
  },
  argTypes: {
    'aria-label': {
      control: 'text',
      description: 'Name of the `nav` landmark. Say what is paginated when a page has more than one list.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Pagination' } },
    },
    hasPrevious: {
      control: 'boolean',
      description: 'A previous page exists. When false the previous button is disabled (page 1).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    hasNext: {
      control: 'boolean',
      description: 'A next page exists. When false the next button is disabled.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onPrevious: { control: false, description: 'Go to the previous page.', table: { type: { summary: '() => void' } } },
    onNext: { control: false, description: 'Go to the next page.', table: { type: { summary: '() => void' } } },
    page: {
      control: 'number',
      description: 'Current page, 1-based. With `pageCount`: “Page 2 of 14”. Alone (cursor mode): “Page 2”.',
      table: { type: { summary: 'number' } },
    },
    pageCount: {
      control: 'number',
      description: 'Total pages. Leave out for cursor-based APIs, where the total is unknown.',
      table: { type: { summary: 'number' } },
    },
    range: {
      control: 'object',
      description: 'Range label: “Showing 51–100 of 1,284 orders”. Wins over `page`. `total` is optional.',
      table: { type: { summary: '{ from: number; to: number; total?: number; resourceName?: string }' } },
    },
    label: { control: 'text', description: 'Custom label; wins over `range` and `page`.', table: { type: { summary: 'ReactNode' } } },
    loading: {
      control: 'boolean',
      description: 'A page is loading: both buttons disable and the nav is `aria-busy`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    keyboardShortcuts: {
      control: 'boolean',
      description: '`k` goes to the previous page and `j` to the next, from anywhere on the page except text fields, menus and dialogs. Enable for one Pagination per page.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    previousLabel: {
      control: 'text',
      description: 'Accessible name of the previous button.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Previous page' } },
    },
    nextLabel: {
      control: 'text',
      description: 'Accessible name of the next button.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Next page' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      description: 'Button size. `sm` under tables; `md` in a PageHeader.',
      table: { type: { summary: "'sm' | 'md'" }, defaultValue: { summary: 'sm' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Previous/next paging with a label saying where the merchant is. Renders a `<nav>` landmark; the label is a polite live region so page changes are announced.',
          '',
          '**Use** under tables and lists that load a page at a time, and in a PageHeader to step between records. Works with offset APIs (“Page 2 of 14”, “Showing 51–100 of 1,284 orders”) and cursor-based APIs (no total — pass only `hasPrevious`/`hasNext`).',
          '',
          '**Don’t use** when everything fits on one page — hide it. Don’t add numbered page links to resource lists; merchants search and filter rather than jump to page 7. Keyboard shortcuts (`j` next, `k` previous) are opt-in and should be enabled for only one Pagination per page.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FirstPage: Story = { args: { page: 1, hasPrevious: false } };

export const LastPage: Story = { args: { page: 14, hasNext: false } };

export const Range: Story = {
  args: { page: undefined, range: { from: 51, to: 100, total: 1284, resourceName: 'orders' } },
};

/** Cursor-based: the API has no total, so only direction is known. */
export const CursorBased: Story = { args: { page: undefined, pageCount: undefined, label: undefined } };

/** Interactive, with `j`/`k` shortcuts enabled. Click the canvas, then press j or k. */
export const KeyboardShortcuts: Story = {
  render: function Render(args) {
    const [page, setPage] = useState(1);
    const count = 14;
    return (
      <Pagination
        {...args}
        keyboardShortcuts
        page={page}
        pageCount={count}
        hasPrevious={page > 1}
        hasNext={page < count}
        onPrevious={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    );
  },
};

export const Loading: Story = { args: { loading: true } };

/** Error: loading the next page failed. The label keeps the last good page; say what happened. */
export const ErrorState: Story = {
  name: 'Error',
  render: (args) => (
    <div className="flex flex-col items-start gap-2">
      <Pagination {...args} />
      <p role="alert" className="text-sm text-critical-subtle-fg">
        Page 3 couldn’t be loaded. Try again.
      </p>
    </div>
  ),
};

/** Offline: only already-loaded pages are reachable. */
export const Offline: Story = {
  args: { hasNext: false },
  render: (args) => (
    <div className="flex flex-col items-start gap-2">
      <Pagination {...args} />
      <p className="text-sm text-fg-muted">You’re offline. More pages load when you reconnect.</p>
    </div>
  ),
};

/** Empty: one page or none — hide pagination rather than show two disabled buttons. */
export const Empty: Story = {
  args: { page: undefined, pageCount: undefined, hasPrevious: false, hasNext: false, label: 'No orders' },
  parameters: { docs: { description: { story: 'Shown for completeness; in product code, don’t render Pagination when there is a single page.' } } },
};

/** Overflow: very large totals stay on one line with tabular figures. */
export const Overflow: Story = {
  args: { page: undefined, range: { from: 1_284_001, to: 1_284_050, total: 12_840_519, resourceName: 'inventory adjustments' } },
  render: (args) => (
    <div className="w-80 rounded-md border border-dashed border-border-strong p-2">
      <Pagination {...args} className="flex-wrap" />
    </div>
  ),
};
