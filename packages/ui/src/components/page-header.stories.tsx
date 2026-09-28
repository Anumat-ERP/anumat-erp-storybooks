import type { Meta, StoryObj } from '@storybook/react-vite';
import { Archive, Copy, Download, Plus, Printer, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { fn } from 'storybook/test';
import { Breadcrumbs } from './breadcrumbs';
import { PageHeader } from './page-header';
import { Pagination } from './pagination';

/** Local stand-in for Badge (being built separately). */
function Tag({ tone = 'neutral', children }: { tone?: 'neutral' | 'success' | 'warning' | 'critical'; children: ReactNode }) {
  const tones = {
    neutral: 'bg-surface-sunken text-fg-muted',
    success: 'bg-success-subtle text-success-subtle-fg',
    warning: 'bg-warning-subtle text-warning-subtle-fg',
    critical: 'bg-critical-subtle text-critical-subtle-fg',
  } as const;
  return <span className={`inline-flex h-5 items-center rounded-full px-2 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

const secondary = [
  { content: 'Print', icon: <Printer />, onAction: fn() },
  { content: 'Duplicate', icon: <Copy />, onAction: fn() },
  { content: 'Export', icon: <Download />, onAction: fn() },
  { content: 'Archive', icon: <Archive />, onAction: fn() },
  { content: 'Delete order', icon: <Trash2 />, onAction: fn(), destructive: true },
];

const meta = {
  title: 'components/PageHeader',
  component: PageHeader,
  args: {
    title: '#1042',
    subtitle: 'Mar 4, 2026 at 10:12 from Online store',
    titleMetadata: (
      <>
        <Tag tone="success">Paid</Tag>
        <Tag tone="warning">Unfulfilled</Tag>
      </>
    ),
    backAction: { content: 'Orders', href: '#orders' },
    primaryAction: { content: 'Fulfil items', onAction: fn() },
    secondaryActions: secondary,
    maxVisibleSecondaryActions: 2,
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The page’s `h1`. Truncates to one line; a string title is also set as the tooltip.',
      table: { type: { summary: 'ReactNode' } },
    },
    subtitle: { control: 'text', description: 'A line under the title: key facts about the record.', table: { type: { summary: 'ReactNode' } } },
    titleMetadata: { control: false, description: 'Beside the title: status badges.', table: { type: { summary: 'ReactNode' } } },
    backAction: {
      control: 'object',
      description: 'Back button to the parent page, announced “Back to {content}”. Use this or `breadcrumbs`.',
      table: { type: { summary: '{ content: string; href?: string; onAction?: () => void }' } },
    },
    breadcrumbs: { control: false, description: 'Breadcrumbs above the title, for pages deeper than one level.', table: { type: { summary: 'ReactNode' } } },
    primaryAction: {
      control: 'object',
      description: 'The one main action: a primary Button (a link when `href` is set).',
      table: { type: { summary: '{ content: string; onAction?: () => void; href?: string; icon?: ReactNode; loading?: boolean; disabled?: boolean; destructive?: boolean }' } },
    },
    secondaryActions: {
      control: 'object',
      description: 'Other actions in priority order; the first few are buttons, the rest overflow into “More actions”.',
      table: { type: { summary: 'ActionMenuItem[]' } },
    },
    maxVisibleSecondaryActions: {
      control: { type: 'number', min: 0 },
      description: 'How many secondary actions stay visible as buttons.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '2' } },
    },
    pagination: { control: false, description: 'A Pagination to step between records.', table: { type: { summary: 'ReactNode' } } },
    renderLink: {
      control: false,
      description: 'Render the back link with your router.',
      table: { type: { summary: '(props: { href; className; aria-label; title; children }) => ReactNode' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'The top of a page: a way back, the title (`h1`) with status badges, a subtitle, and the page’s actions — one primary Button, secondary actions that overflow into an ActionMenu, and an optional record Pagination.',
          '',
          '**Use** once per page, as its first element. Put the most common action in `primaryAction`; order `secondaryActions` by frequency.',
          '',
          '**Don’t use** inside cards or modals (use CardHeader or the modal title), and don’t put filters, tabs or search in it — they go below. Use a back link or breadcrumbs, not both.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBreadcrumbs: Story = {
  args: {
    title: 'Europe',
    subtitle: '14 countries · 3 rates',
    titleMetadata: undefined,
    backAction: undefined,
    breadcrumbs: (
      <Breadcrumbs
        items={[
          { label: 'Settings', href: '#settings' },
          { label: 'Shipping', href: '#shipping' },
          { label: 'Europe' },
        ]}
      />
    ),
    primaryAction: { content: 'Add rate', icon: <Plus />, onAction: fn() },
    secondaryActions: [{ content: 'Delete zone', destructive: true, onAction: fn() }],
  },
};

export const WithPagination: Story = {
  args: {
    pagination: <Pagination aria-label="Orders" hasPrevious hasNext size="md" onPrevious={fn()} onNext={fn()} />,
  },
};

export const TitleOnly: Story = {
  args: { title: 'Orders', subtitle: undefined, titleMetadata: undefined, backAction: undefined, secondaryActions: [{ content: 'Export', onAction: fn() }], primaryAction: { content: 'Create order', onAction: fn() } },
};

/** Loading: the record’s name isn’t known yet; actions wait. */
export const Loading: Story = {
  args: {
    title: (
      <>
        <span className="sr-only">Loading order</span>
        <span aria-hidden className="inline-block h-6 w-40 animate-pulse rounded-md bg-skeleton align-middle" />
      </>
    ),
    subtitle: undefined,
    titleMetadata: undefined,
    primaryAction: { content: 'Fulfil items', disabled: true },
    secondaryActions: [],
  },
};

/** Error: the record failed to load; keep the way back and say what happened. */
export const ErrorState: Story = {
  name: 'Error',
  args: {
    title: 'Order not found',
    subtitle: 'It may have been deleted, or the link is wrong.',
    titleMetadata: undefined,
    primaryAction: undefined,
    secondaryActions: [],
  },
};

/** Permission: actions the merchant can’t take are disabled with a reason in the menu. */
export const Permission: Story = {
  args: {
    primaryAction: { content: 'Fulfil items', disabled: true },
    subtitle: 'You can view this order. Fulfilling needs the “Fulfil orders” permission.',
    secondaryActions: [
      { content: 'Print', icon: <Printer />, onAction: fn() },
      { content: 'Refund', disabled: true, helpText: 'Needs “Issue refunds”' },
      { content: 'Delete order', destructive: true, disabled: true, helpText: 'Store owners only' },
    ],
    maxVisibleSecondaryActions: 1,
  },
};

export const Offline: Story = {
  args: {
    titleMetadata: (
      <>
        <Tag tone="success">Paid</Tag>
        <Tag>Offline</Tag>
      </>
    ),
    subtitle: 'You’re offline. Showing the order as of 10:42.',
    primaryAction: { content: 'Fulfil items', disabled: true },
    secondaryActions: [{ content: 'Print', icon: <Printer />, onAction: fn() }],
  },
};

/** Overflow: a long title truncates on one line (full text in the tooltip); actions wrap below on narrow screens. */
export const Overflow: Story = {
  args: {
    title: 'Bairro Alto Home & Garden Supplies Ltda. — Wholesale price list for Spring/Summer 2026 terracotta and ceramics',
    subtitle: 'Wholesale customer since 2021 · 184 orders · Net 30',
  },
  render: (args) => (
    <div className="flex flex-col gap-8">
      <PageHeader {...args} />
      <div className="max-w-sm rounded-md border border-dashed border-border-strong p-3">
        <PageHeader {...args} />
      </div>
    </div>
  ),
};
