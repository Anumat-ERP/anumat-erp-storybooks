import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, Filter, Lock, WifiOff } from 'lucide-react';
import type { ReactNode } from 'react';
import { fn } from 'storybook/test';
import { Button } from './button';
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTrigger } from './drawer';
import { Stack } from './stack';

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

function Filters() {
  const group = (legend: string, options: string[]) => (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-md font-medium text-fg">{legend}</legend>
      {options.map((o) => (
        <label key={o} className="flex items-center gap-2 text-md text-fg">
          <input type="checkbox" className="size-4 accent-(--a-color-primary)" />
          {o}
        </label>
      ))}
    </fieldset>
  );
  return (
    <Stack gap={6}>
      {group('Payment status', ['Paid', 'Pending', 'Refunded'])}
      {group('Fulfilment', ['Unfulfilled', 'Partially fulfilled', 'Fulfilled'])}
      {group('Channel', ['Online store', 'Point of sale', 'Wholesale'])}
    </Stack>
  );
}

function OrderDetails() {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-md">
      <dt className="text-fg-muted">Customer</dt>
      <dd>Ana Souza</dd>
      <dt className="text-fg-muted">Placed</dt>
      <dd>Mar 4, 2026 at 10:12</dd>
      <dt className="text-fg-muted">Items</dt>
      <dd>3</dd>
      <dt className="text-fg-muted">Total</dt>
      <dd className="tabular-nums">$182.40</dd>
      <dt className="text-fg-muted">Shipping</dt>
      <dd>Standard · Rua Augusta 1200, São Paulo</dd>
    </dl>
  );
}

const meta = {
  title: 'components/Drawer',
  component: Drawer,
  args: {
    title: 'Filter orders',
    defaultOpen: true,
    side: 'right',
    size: 'md',
    trigger: (
      <Button icon={<Filter aria-hidden />}>
        Filters
      </Button>
    ),
    primaryAction: { content: 'Apply filters', onAction: fn() },
    secondaryActions: [{ content: 'Clear all', onAction: fn() }],
    children: <Filters />,
    onOpenChange: fn(),
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title. Required — it is the drawer’s accessible name.',
      table: { type: { summary: 'ReactNode' } },
    },
    hideTitle: {
      control: 'boolean',
      description: 'Hide the title visually but keep it as the accessible name.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    description: {
      control: 'text',
      description: 'Supporting line under the title; the accessible description.',
      table: { type: { summary: 'ReactNode' } },
    },
    side: {
      control: 'inline-radio',
      options: ['right', 'left'],
      description: '`right` for details and filters; `left` for navigation (AppShell uses it on small screens).',
      table: { type: { summary: "'right' | 'left'" }, defaultValue: { summary: 'right' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Maximum width: `sm` 320px, `md` 448px, `lg` 640px. Always leaves a strip of the page visible.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    open: { control: 'boolean', description: 'Controlled open state.', table: { type: { summary: 'boolean' } } },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onOpenChange: {
      control: false,
      description: 'Called when the drawer asks to open or close.',
      table: { type: { summary: '(open: boolean) => void' } },
    },
    trigger: { control: false, description: 'Element that opens the drawer. Focus returns to it on close.', table: { type: { summary: 'ReactNode' } } },
    primaryAction: {
      control: 'object',
      description: 'The main action in the footer.',
      table: { type: { summary: '{ content: string; onAction?: () => void; loading?: boolean; destructive?: boolean; disabled?: boolean }' } },
    },
    secondaryActions: {
      control: 'object',
      description: 'Secondary buttons. One without `onAction` closes the drawer.',
      table: { type: { summary: 'ModalAction[]' } },
    },
    footer: { control: 'text', description: 'Content at the start of the footer.', table: { type: { summary: 'ReactNode' } } },
    children: { control: false, description: 'The body; scrolls between a fixed header and footer.', table: { type: { summary: 'ReactNode' } } },
  },
  parameters: {
    docs: {
      story: { inline: false, height: '480px' },
      description: {
        component: [
          'A side sheet that slides over the page from the right (or left). Built on Radix Dialog: focus is trapped, Escape and a backdrop click close it, focus returns to the trigger. Shares its header, body and footer with Modal.',
          '',
          '**Use** for the details of a row (an order preview from a list), filters, and secondary edits where the page behind still gives context.',
          '',
          '**Don’t use** for a task that needs full attention (use a Modal), for content worth its own URL (use a page), or stacked on another drawer. Don’t put the primary navigation in one on large screens — use AppShell, which does this for you on small screens.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Details: Story = {
  args: {
    title: 'Order #1042',
    description: 'Paid · Unfulfilled',
    trigger: <Button>Preview order</Button>,
    primaryAction: { content: 'Fulfil order', onAction: fn() },
    secondaryActions: [{ content: 'Open order', onAction: fn() }],
    children: <OrderDetails />,
  },
};

export const LeftSide: Story = {
  args: { side: 'left', size: 'sm', title: 'Saved views', primaryAction: undefined, secondaryActions: undefined, children: <p>Unfulfilled · Ready to ship · High value</p> },
};

/** Loading: the details are being fetched. Placeholders keep the layout still. */
export const Loading: Story = {
  args: {
    title: 'Order #1042',
    primaryAction: { content: 'Fulfil order', disabled: true },
    secondaryActions: undefined,
    children: (
      <div aria-busy="true" aria-label="Loading order" className="flex flex-col gap-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-4 animate-pulse rounded-sm bg-skeleton" style={{ width: `${80 - i * 9}%` }} />
        ))}
      </div>
    ),
  },
};

export const ErrorState: Story = {
  name: 'Error',
  args: {
    title: 'Order #1042',
    primaryAction: { content: 'Retry', onAction: fn() },
    secondaryActions: [{ content: 'Close' }],
    children: (
      <Notice tone="critical" icon={<AlertTriangle />}>
        The order couldn’t be loaded. Check your connection and try again.
      </Notice>
    ),
  },
};

export const Permission: Story = {
  args: {
    title: 'Order #1042',
    primaryAction: { content: 'Fulfil order', disabled: true },
    secondaryActions: [{ content: 'Close' }],
    children: (
      <Stack gap={4}>
        <Notice tone="info" icon={<Lock />}>
          You can view this order, but only staff with “Fulfil orders” can fulfil it.
        </Notice>
        <OrderDetails />
      </Stack>
    ),
  },
};

export const Offline: Story = {
  args: {
    title: 'Order #1042',
    primaryAction: { content: 'Fulfil order', disabled: true },
    secondaryActions: [{ content: 'Close' }],
    children: (
      <Stack gap={4}>
        <Notice tone="warning" icon={<WifiOff />}>
          You’re offline. Showing the order as of 10:42; fulfilment needs a connection.
        </Notice>
        <OrderDetails />
      </Stack>
    ),
  },
};

/** Empty: nothing to show for this record yet. */
export const Empty: Story = {
  args: {
    title: 'Order timeline',
    primaryAction: undefined,
    secondaryActions: [{ content: 'Close' }],
    children: (
      <div className="flex flex-col items-center gap-1 py-10 text-center">
        <p className="font-medium text-fg">No activity yet</p>
        <p className="text-sm text-fg-muted">Payments, fulfilments and comments will appear here.</p>
      </div>
    ),
  },
};

/** Overflow: a long title wraps and the body scrolls; header and footer stay visible. */
export const Overflow: Story = {
  args: {
    title: 'Wholesale order #WH-2026-000184 for Bairro Alto Home & Garden Supplies Ltda.',
    children: (
      <ul className="flex flex-col divide-y divide-border">
        {Array.from({ length: 30 }, (_, i) => (
          <li key={i} className="flex justify-between gap-4 py-2 text-md">
            <span>Terracotta planter, size {i + 1}</span>
            <span className="tabular-nums text-fg-muted">× {(i % 5) + 1}</span>
          </li>
        ))}
      </ul>
    ),
  },
};

export const Composed: Story = {
  render: () => (
    <DrawerRoot defaultOpen>
      <DrawerTrigger asChild>
        <Button>Customer</Button>
      </DrawerTrigger>
      <DrawerContent aria-describedby={undefined}>
        <DrawerHeader title="Ana Souza" />
        <DrawerBody>
          <OrderDetails />
        </DrawerBody>
        <DrawerFooter>
          <Button variant="primary">View customer</Button>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  ),
};
