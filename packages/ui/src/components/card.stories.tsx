import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pencil, RefreshCw, WifiOff } from 'lucide-react';
import { Button, IconButton } from './button';
import { Card, CardFooter, CardHeader, CardSection } from './card';
import { Stack } from './stack';

const meta = {
  title: 'components/Card',
  component: Card,
  argTypes: {
    tone: { control: 'inline-radio', options: ['default', 'muted'], description: '`muted` for secondary groups.', table: { type: { summary: "'default' | 'muted'" }, defaultValue: { summary: 'default' } } },
    flush: { control: 'boolean', description: 'No inner padding — for tables and lists that run edge to edge.', table: { type: { summary: 'boolean' } } },
    as: { control: false, description: 'Element. `section` gives a landmark when titled.', table: { type: { summary: 'ElementType' } } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A bordered surface for related content. **Use** to group what a person reads or acts on together. **Don’t** nest cards — use `CardSection` or a sub-heading.',
      },
    },
  },
  decorators: [(Story) => <div className="max-w-lg"><Story /></div>],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const Address = () => (
  <address className="text-md not-italic text-fg">
    Dana Whitfield<br />
    41 Harbour Street<br />
    Wellington 6011, New Zealand
  </address>
);

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <Stack gap={3}>
        <CardHeader title="Shipping address" actions={<IconButton icon={<Pencil />} label="Edit shipping address" />} />
        <Address />
      </Stack>
    </Card>
  ),
};

export const WithSections: Story = {
  render: (args) => (
    <Card {...args}>
      <Stack gap={4}>
        <CardHeader title="Customer" description="Wholesale · Net 30" />
        <CardSection>
          <Address />
        </CardSection>
        <CardSection>
          <CardFooter>
            <Button variant="tertiary">Cancel</Button>
            <Button variant="primary">Save</Button>
          </CardFooter>
        </CardSection>
      </Stack>
    </Card>
  ),
};

export const EmptyFirstRun: Story = {
  render: (args) => (
    <Card {...args}>
      <Stack gap={3} align="start">
        <CardHeader title="Suppliers" />
        <p className="text-md text-fg-muted">Add a supplier to raise purchase orders against them.</p>
        <Button variant="primary">Add supplier</Button>
      </Stack>
    </Card>
  ),
};

export const EmptyFiltered: Story = {
  render: (args) => (
    <Card {...args}>
      <Stack gap={3} align="start">
        <CardHeader title="Suppliers" />
        <p className="text-md text-fg-muted">No suppliers in “Germany”. Your other 42 suppliers are hidden by this filter.</p>
        <Button>Clear filter</Button>
      </Stack>
    </Card>
  ),
};

export const EmptyCleared: Story = {
  render: (args) => (
    <Card {...args}>
      <Stack gap={2}>
        <CardHeader title="Approvals" />
        <p className="text-md text-fg-muted">All caught up — nothing waiting for your approval.</p>
      </Stack>
    </Card>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <Card {...args} aria-busy>
      <Stack gap={3}>
        <CardHeader title="Shipping address" />
        <div className="flex flex-col gap-2" aria-hidden>
          <span className="h-3 w-40 animate-pulse rounded-sm bg-skeleton" />
          <span className="h-3 w-56 animate-pulse rounded-sm bg-skeleton" />
          <span className="h-3 w-48 animate-pulse rounded-sm bg-skeleton" />
        </div>
        <span className="sr-only" role="status">Loading shipping address</span>
      </Stack>
    </Card>
  ),
};

export const ErrorState: Story = {
  name: 'Error',
  render: (args) => (
    <Card {...args}>
      <Stack gap={3} align="start">
        <CardHeader title="Shipping address" />
        <p role="alert" className="text-md text-critical-subtle-fg">We couldn’t load this address. Your data is safe.</p>
        <Button icon={<RefreshCw />}>Try again</Button>
      </Stack>
    </Card>
  ),
};

export const Permission: Story = {
  render: (args) => (
    <Card {...args} tone="muted">
      <Stack gap={2}>
        <CardHeader title="Payout details" />
        <p className="text-md text-fg-muted">You don’t have permission to view payout details. Ask an account owner for the Finance role.</p>
      </Stack>
    </Card>
  ),
};

export const Offline: Story = {
  render: (args) => (
    <Card {...args}>
      <Stack gap={3}>
        <CardHeader title="Shipping address" actions={<IconButton icon={<Pencil />} label="Edit shipping address (unavailable offline)" disabled />} />
        <Address />
        <p className="flex items-center gap-1.5 text-sm text-fg-muted">
          <WifiOff className="size-4" aria-hidden /> Offline — showing details saved at 09:42.
        </p>
      </Stack>
    </Card>
  ),
};

export const Overflow: Story = {
  render: (args) => (
    <Card {...args} className="w-72">
      <Stack gap={2}>
        <CardHeader title="Northwind Traders International Distribution Holdings Limited" />
        <p className="text-md break-words text-fg">accounts-payable.southern-hemisphere@northwind-traders-international.example.com</p>
      </Stack>
    </Card>
  ),
};

export const Muted: Story = { args: { tone: 'muted' }, render: (args) => <Card {...args}><p className="text-md">Notes are only visible to staff.</p></Card> };
