import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { fn } from 'storybook/test';
import { Button, IconButton } from './button';
import { Inline, Stack } from './stack';

const meta = {
  title: 'primitives/Button',
  component: Button,
  args: { children: 'Save', onClick: fn() },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'tertiary', 'critical', 'plain'],
      description:
        '`primary` — the one main action in a view. `secondary` — everything else. `tertiary` — low-emphasis actions in dense UI. `critical` — destructive. `plain` — looks like a link.',
      table: { type: { summary: "'primary' | 'secondary' | 'tertiary' | 'critical' | 'plain'" }, defaultValue: { summary: 'secondary' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Control height. Matches Input and Select at the same size.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    loading: {
      control: 'boolean',
      description: 'Replaces the label with a spinner, keeping the button’s size. Announces `aria-busy`; ignores clicks.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction. Say why nearby — a silently disabled button is a dead end.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretches to the container width.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    asChild: {
      control: false,
      description: 'Render the child element (e.g. an `<a>`) with button styling. Use for navigation.',
      table: { type: { summary: 'boolean' } },
    },
    icon: { control: false, description: 'Icon before the label.', table: { type: { summary: 'ReactNode' } } },
    trailingIcon: { control: false, description: 'Icon after the label.', table: { type: { summary: 'ReactNode' } } },
    children: { control: 'text', description: 'Label. A verb: “Save”, not “OK”.', table: { type: { summary: 'ReactNode' } } },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Triggers an action.',
          '',
          '**Use** for actions — submit, save, open a dialog. One `primary` per view.',
          '',
          '**Don’t use** for navigation: render a link with `asChild`. Don’t disable without explaining why, and don’t swap a button for a spinner — `loading` keeps its box so the layout stays still.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Inline>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="tertiary">Tertiary</Button>
      <Button {...args} variant="critical">Delete</Button>
      <Button {...args} variant="plain">Plain</Button>
    </Inline>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Inline>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </Inline>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <Inline>
      <Button {...args} variant="primary" icon={<Plus />}>Add product</Button>
      <Button {...args} trailingIcon={<ChevronDown />}>More actions</Button>
      <IconButton icon={<Trash2 />} label="Delete order" variant="secondary" />
      <IconButton icon={<Trash2 />} label="Delete order" />
    </Inline>
  ),
};

/** Loading keeps the button's width, so the row around it does not move. */
export const Loading: Story = {
  args: { loading: true, variant: 'primary', children: 'Save changes' },
  render: (args) => (
    <Stack gap={3}>
      <Inline>
        <Button {...args} />
        <Button variant="secondary">Cancel</Button>
      </Inline>
      <Inline>
        <Button {...args} loading={false} />
        <Button variant="secondary">Cancel</Button>
      </Inline>
    </Stack>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Stack gap={2}>
      <Inline>
        <Button {...args} variant="primary">Publish</Button>
        <Button {...args}>Duplicate</Button>
        <Button {...args} variant="critical">Delete</Button>
      </Inline>
      <p className="text-sm text-fg-muted">Add a title before publishing.</p>
    </Stack>
  ),
};

/** Error: the action failed — the button returns to rest and the reason sits beside it. */
export const ErrorState: Story = {
  name: 'Error',
  args: { variant: 'primary', children: 'Retry payment' },
  render: (args) => (
    <Stack gap={2} align="start">
      <Button {...args} />
      <p role="alert" className="text-sm text-critical-subtle-fg">
        The card was declined. Try another payment method.
      </p>
    </Stack>
  ),
};

/** Permission: visible but unavailable, with the reason — not hidden, not silently disabled. */
export const Permission: Story = {
  args: { disabled: true, variant: 'critical', children: 'Delete customer' },
  render: (args) => (
    <Stack gap={2} align="start">
      <Button {...args} aria-describedby="perm-hint" />
      <p id="perm-hint" className="text-sm text-fg-muted">
        Only store owners can delete customers.
      </p>
    </Stack>
  ),
};

/** Offline: actions needing the network are disabled with an explanation. */
export const Offline: Story = {
  args: { disabled: true, variant: 'primary', children: 'Sync now' },
  render: (args) => (
    <Stack gap={2} align="start">
      <Button {...args} aria-describedby="offline-hint" />
      <p id="offline-hint" className="text-sm text-fg-muted">
        You’re offline. Changes will sync when you reconnect.
      </p>
    </Stack>
  ),
};

/** Overflow: long labels do not wrap; the container decides whether to clip. */
export const Overflow: Story = {
  args: { children: 'Export all orders including archived and test orders as CSV' },
  render: (args) => (
    <div className="flex w-64 flex-col gap-2 rounded-md border border-dashed border-border-strong p-2">
      <Button {...args} className="max-w-full" />
      <Button {...args} fullWidth className="[&>span]:truncate [&>span]:block" />
    </div>
  ),
};

export const FullWidth: Story = { args: { fullWidth: true, variant: 'primary', children: 'Continue' } };

export const AsLink: Story = {
  render: () => (
    <Button asChild variant="secondary">
      <a href="#orders">View orders</a>
    </Button>
  ),
};
