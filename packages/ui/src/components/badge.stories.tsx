import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './badge';
import { Inline, Stack } from './stack';

const meta = {
  title: 'primitives/Badge',
  component: Badge,
  args: { children: 'Paid', tone: 'success' },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'info', 'success', 'warning', 'critical', 'primary'],
      description:
        '`neutral` plain label · `info` in progress · `success` done · `warning` needs attention · `critical` failed or blocked · `primary` brand emphasis ("New").',
      table: {
        type: { summary: "'neutral' | 'info' | 'success' | 'warning' | 'critical' | 'primary'" },
        defaultValue: { summary: 'neutral' },
      },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      description: '`sm` (20px) for dense tables; `md` (24px) elsewhere.',
      table: { type: { summary: "'sm' | 'md'" }, defaultValue: { summary: 'md' } },
    },
    dot: {
      control: 'boolean',
      description: 'A small decorative dot before the label, in the tone colour.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    progress: {
      control: 'inline-radio',
      options: [undefined, 'incomplete', 'partial', 'complete'],
      description:
        'Progress glyph (empty, half, full circle). Its meaning is also given as visually hidden text, so it isn’t conveyed by shape alone.',
      table: { type: { summary: "'incomplete' | 'partial' | 'complete'" } },
    },
    progressLabel: {
      control: 'text',
      description: 'Overrides the hidden text for `progress`.',
      table: { type: { summary: 'string' } },
    },
    children: { control: 'text', description: 'The status, in words.', table: { type: { summary: 'ReactNode' } } },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A short, non-interactive status label: “Paid”, “Draft”, “Partially fulfilled”.',
          '',
          '**Use** to show an object’s status at a glance in tables, lists and headers.',
          '',
          '**Don’t use** for actions (Button), removable values (Tag), or live counts. Never rely on colour alone — the label must say the status, and `progress` carries hidden text for its glyph.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <Inline>
      <Badge {...args} tone="neutral">Draft</Badge>
      <Badge {...args} tone="info">Scheduled</Badge>
      <Badge {...args} tone="success">Paid</Badge>
      <Badge {...args} tone="warning">Unfulfilled</Badge>
      <Badge {...args} tone="critical">Payment failed</Badge>
      <Badge {...args} tone="primary">New</Badge>
    </Inline>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Inline>
      <Badge {...args} size="sm">Small</Badge>
      <Badge {...args} size="md">Medium</Badge>
    </Inline>
  ),
};

export const WithDot: Story = {
  args: { dot: true },
  render: (args) => (
    <Inline>
      <Badge {...args} tone="success">Active</Badge>
      <Badge {...args} tone="warning">Pending review</Badge>
      <Badge {...args} tone="neutral">Archived</Badge>
    </Inline>
  ),
};

/** The glyph is decorative; its meaning is read from hidden text ("Partially complete: Partially fulfilled"). */
export const Progress: Story = {
  render: (args) => (
    <Inline>
      <Badge {...args} tone="warning" progress="incomplete">Unfulfilled</Badge>
      <Badge {...args} tone="warning" progress="partial">Partially fulfilled</Badge>
      <Badge {...args} tone="neutral" progress="complete">Fulfilled</Badge>
      <Badge {...args} tone="critical" progress="incomplete">Unpaid</Badge>
      <Badge {...args} tone="success" progress="complete">Paid</Badge>
    </Inline>
  ),
};

export const Loading: Story = {
  render: () => (
    <Inline>
      <Badge tone="info" dot>Syncing…</Badge>
      <span aria-hidden className="inline-block h-6 w-16 animate-pulse rounded-full bg-skeleton" />
    </Inline>
  ),
};

export const ErrorState: Story = {
  name: 'Error',
  render: () => (
    <Inline>
      <Badge tone="critical" dot>Sync failed</Badge>
      <Badge tone="critical" progress="incomplete">Payment declined</Badge>
    </Inline>
  ),
};

/** Permission: a badge can state that something is restricted; it is never the only explanation. */
export const Permission: Story = {
  render: () => (
    <Stack gap={2} align="start">
      <Badge tone="neutral">View only</Badge>
      <p className="text-sm text-fg-muted">Ask a store owner for edit access.</p>
    </Stack>
  ),
};

export const Offline: Story = {
  render: () => (
    <Badge tone="warning" dot>
      Offline — changes pending
    </Badge>
  ),
};

/** Long labels truncate inside a constrained parent; put the full text in a `title`. */
export const Overflow: Story = {
  render: () => (
    <div className="flex w-48 flex-col items-start gap-2 rounded-md border border-dashed border-border-strong p-2">
      <Badge tone="info" title="Awaiting carrier pickup at the Northern Distribution Centre">
        Awaiting carrier pickup at the Northern Distribution Centre
      </Badge>
      <Badge tone="success" size="sm" progress="partial" title="Partially refunded to the original payment method">
        Partially refunded to the original payment method
      </Badge>
    </div>
  ),
};
