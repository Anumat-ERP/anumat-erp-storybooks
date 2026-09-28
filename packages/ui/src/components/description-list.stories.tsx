import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardHeader } from './card';
import { DescriptionList } from './description-list';
import { EmptyState } from './empty-state';
import { SkeletonText } from './skeleton';
import { Stack } from './stack';

const ORDER = [
  { term: 'Order', description: '#1042' },
  { term: 'Placed', description: '12 March 2026, 14:05' },
  { term: 'Payment', description: <Badge tone="success" size="sm">Paid</Badge> },
  { term: 'Customer', description: 'Ada Lovelace' },
  { term: 'Channel', description: 'Online store' },
];

const meta = {
  title: 'components/DescriptionList',
  component: DescriptionList,
  args: { items: ORDER, layout: 'stacked', spacing: 'tight', dividers: false },
  argTypes: {
    items: {
      control: 'object',
      description: 'Term / value pairs, in reading order.',
      table: { type: { summary: '{ term: ReactNode; description: ReactNode }[]' } },
    },
    layout: {
      control: 'inline-radio',
      options: ['stacked', 'inline'],
      description: '`stacked` puts the value under its term. `inline` is a term | value grid that stacks on small screens.',
      table: { type: { summary: "'stacked' | 'inline'" }, defaultValue: { summary: 'stacked' } },
    },
    spacing: {
      control: 'inline-radio',
      options: ['tight', 'loose'],
      description: '`tight` for cards and sidebars; `loose` for a full page of details.',
      table: { type: { summary: "'tight' | 'loose'" }, defaultValue: { summary: 'tight' } },
    },
    dividers: {
      control: 'boolean',
      description: 'A rule between pairs.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    emptyValue: {
      control: 'text',
      description: 'Shown for a missing value, so a blank isn’t mistaken for a failed load.',
      table: { type: { summary: 'ReactNode' }, defaultValue: { summary: '—' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Pairs of labels and values: order details, customer info, a settings summary.',
          '',
          'It is a real `<dl>` with a `<div>` around each `<dt>`/`<dd>`, so assistive technology reads each term with its value.',
          '',
          '**Use** for read-only facts about one object. **Don’t use** for many objects (table), editable fields (form), or running text.',
        ].join('\n'),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inline: Story = { args: { layout: 'inline', dividers: true } };

export const InCard: Story = {
  args: { layout: 'inline' },
  render: (args) => (
    <Card className="flex flex-col gap-4">
      <CardHeader title="Order details" />
      <DescriptionList {...args} />
    </Card>
  ),
};

export const MissingValues: Story = {
  args: {
    items: [
      { term: 'Phone', description: '' },
      { term: 'Company', description: undefined },
      { term: 'Email', description: 'ada@example.com' },
    ],
  },
};

export const EmptyFirstRun: Story = {
  render: () => (
    <EmptyState size="card" image={null} heading="Add customer details" action={<Button size="sm">Add details</Button>}>
      Contact details help you follow up on orders.
    </EmptyState>
  ),
};

export const EmptyFiltered: Story = {
  render: () => (
    <EmptyState size="card" image={null} heading="No fields match “tax”" action={<Button size="sm">Clear search</Button>}>
      Try another search term.
    </EmptyState>
  ),
};

export const EmptyCleared: Story = {
  render: () => (
    <EmptyState size="card" image={null} heading="No custom fields">
      All custom fields were removed from this customer.
    </EmptyState>
  ),
};

export const Loading: Story = {
  render: () => (
    <Stack gap={4}>
      <span role="status" className="sr-only">
        Loading order details…
      </span>
      {[0, 1, 2].map((i) => (
        <Stack key={i} gap={1}>
          <SkeletonText lines={1} size="sm" className="w-24" />
          <SkeletonText lines={1} className="w-48" />
        </Stack>
      ))}
    </Stack>
  ),
};

export const ErrorState: Story = {
  name: 'Error',
  args: {
    items: [
      { term: 'Order', description: '#1042' },
      { term: 'Payment', description: <span className="text-critical-subtle-fg">Couldn’t load payment status</span> },
    ],
  },
};

export const Permission: Story = {
  args: {
    items: [
      { term: 'Customer', description: 'Ada Lovelace' },
      { term: 'Card', description: <span className="text-fg-muted">Hidden — you need “View payment details”</span> },
    ],
  },
};

export const Offline: Story = {
  render: (args) => (
    <Stack gap={2}>
      <DescriptionList {...args} />
      <p className="text-sm text-fg-muted">You’re offline. Showing details from 14:05.</p>
    </Stack>
  ),
};

export const Overflow: Story = {
  args: {
    layout: 'inline',
    items: [
      { term: 'Shipping address for international wholesale orders', description: 'Unit 4, 1200 Very Long Industrial Estate Road, Northern Distribution Park, Manchester M1 1AA, United Kingdom' },
      { term: 'Tracking', description: 'https://tracking.example.com/shipments/0123456789012345678901234567890123456789' },
    ],
  },
  render: (args) => (
    <div className="w-80">
      <DescriptionList {...args} />
    </div>
  ),
};
