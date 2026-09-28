import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, Lock, WifiOff } from 'lucide-react';
import type { ReactNode } from 'react';
import { fn } from 'storybook/test';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

function Panel({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-border bg-surface p-4 text-md text-fg">{children}</div>;
}

const views = [
  { value: 'all', label: 'All', badge: '1,284', badgeLabel: '1,284 orders' },
  { value: 'unfulfilled', label: 'Unfulfilled', badge: 12, badgeLabel: '12 unfulfilled orders' },
  { value: 'unpaid', label: 'Unpaid', badge: 3, badgeLabel: '3 unpaid orders' },
  { value: 'open', label: 'Open' },
  { value: 'archived', label: 'Archived' },
];

const meta = {
  title: 'components/Tabs',
  component: Tabs,
  args: { defaultValue: 'unfulfilled', activationMode: 'automatic', orientation: 'horizontal', onValueChange: fn() },
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'The tab selected initially, when uncontrolled.',
      table: { type: { summary: 'string' } },
    },
    value: { control: 'text', description: 'Controlled selected tab. Pair with `onValueChange`.', table: { type: { summary: 'string' } } },
    onValueChange: { control: false, description: 'Called with the new tab’s `value`.', table: { type: { summary: '(value: string) => void' } } },
    activationMode: {
      control: 'inline-radio',
      options: ['automatic', 'manual'],
      description:
        '`automatic`: arrowing to a tab shows its panel immediately — best when panels are already rendered. `manual`: arrows move focus only; Enter or Space activates — use when a panel fetches data, so arrowing past tabs does not fire requests.',
      table: { type: { summary: "'automatic' | 'manual'" }, defaultValue: { summary: 'automatic' } },
    },
    orientation: {
      control: false,
      description: 'Keyboard orientation. The underline style is designed for `horizontal`.',
      table: { type: { summary: "'horizontal' | 'vertical'" }, defaultValue: { summary: 'horizontal' } },
    },
  },
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="Order views">
        {views.map((v) => (
          <TabsTrigger key={v.value} value={v.value} badge={v.badge} badgeLabel={v.badgeLabel}>
            {v.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {views.map((v) => (
        <TabsContent key={v.value} value={v.value}>
          <Panel>{v.label} orders appear here.</Panel>
        </TabsContent>
      ))}
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        component: [
          'Switches between peer views of the same thing. Built on Radix Tabs: `tablist`/`tab`/`tabpanel` roles, arrow keys move between tabs, Home/End jump, disabled tabs are skipped.',
          '',
          '**Parts:** `Tabs` (root: `value`, `defaultValue`, `activationMode`), `TabsList` (`fitted`, `aria-label`), `TabsTrigger` (`badge`, `badgeLabel`, `disabled`), `TabsContent`.',
          '',
          '**Activation.** With `activationMode="automatic"` (default) focusing a tab selects it. With `"manual"` arrows only move focus and Enter/Space selects — use it when selecting a tab loads data.',
          '',
          '**Use** for filtered views of one list (All / Unfulfilled / Archived) or sections of one object (Details / Timeline / Refunds). When tabs don’t fit, the list scrolls sideways with a fade at the clipped edge.',
          '',
          '**Don’t use** for navigating between pages (use Navigation), for sequential steps, or for two options that change a setting (use radios or a segmented control). Don’t hide essential content behind a tab merchants won’t think to open.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Manual activation: arrow keys move focus; Enter or Space selects. */
export const ManualActivation: Story = { args: { activationMode: 'manual' } };

export const Fitted: Story = {
  render: (args) => (
    <div className="max-w-md">
      <Tabs {...args} defaultValue="details">
        <TabsList aria-label="Product sections" fitted>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Panel>Title, description and media.</Panel>
        </TabsContent>
        <TabsContent value="inventory">
          <Panel>Stock by location.</Panel>
        </TabsContent>
        <TabsContent value="pricing">
          <Panel>Price and cost per item.</Panel>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

/** Disabled tabs are shown, skipped by the keyboard, and explained in the panel area. */
export const Disabled: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="details">
      <TabsList aria-label="Order sections">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="refunds" disabled>
          Refunds
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <Panel>Refunds become available once the order is paid.</Panel>
      </TabsContent>
      <TabsContent value="timeline">
        <Panel>Timeline</Panel>
      </TabsContent>
    </Tabs>
  ),
};

/** Permission: a view the merchant can’t open stays visible, with the reason. */
export const Permission: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="overview">
      <TabsList aria-label="Customer sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="orders" badge={12}>
          Orders
        </TabsTrigger>
        <TabsTrigger value="payments" disabled>
          <Lock aria-hidden />
          Payment methods
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Panel>
          <p className="flex items-center gap-2 text-fg-muted">
            <Lock aria-hidden className="size-4" /> Payment methods are visible to store owners only.
          </p>
        </Panel>
      </TabsContent>
      <TabsContent value="orders">
        <Panel>Orders</Panel>
      </TabsContent>
    </Tabs>
  ),
};

/** Loading: counts that are still loading show a placeholder, not a wrong number. */
export const Loading: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="Order views">
        {views.map((v) => (
          <TabsTrigger
            key={v.value}
            value={v.value}
            badge={v.badge !== undefined ? <span className="block h-2 w-4 animate-pulse rounded-full bg-skeleton" /> : undefined}
            badgeLabel={v.badge !== undefined ? 'count loading' : undefined}
          >
            {v.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="unfulfilled">
        <div aria-busy="true" aria-label="Loading orders" className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
          {[90, 75, 82].map((w) => (
            <div key={w} className="h-4 animate-pulse rounded-sm bg-skeleton" style={{ width: `${w}%` }} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const ErrorState: Story = {
  name: 'Error',
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="Order views">
        {views.map((v) => (
          <TabsTrigger key={v.value} value={v.value} badge={v.badge} badgeLabel={v.badgeLabel}>
            {v.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="unfulfilled">
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-critical-border bg-critical-subtle p-4 text-md text-critical-subtle-fg">
          <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
          Unfulfilled orders couldn’t be loaded. Refresh to try again.
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const Offline: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="Order views">
        {views.map((v) => (
          <TabsTrigger key={v.value} value={v.value} badge={v.badge} badgeLabel={v.badgeLabel}>
            {v.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="unfulfilled">
        <div role="status" className="flex items-start gap-2 rounded-lg border border-warning-border bg-warning-subtle p-4 text-md text-warning-subtle-fg">
          <WifiOff aria-hidden className="mt-0.5 size-4 shrink-0" />
          You’re offline. Counts and lists are from 10:42 and may be out of date.
        </div>
      </TabsContent>
    </Tabs>
  ),
};

/** Empty: a view with nothing in it says so — and a count of 0 is shown, not hidden. */
export const Empty: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="Order views">
        <TabsTrigger value="all" badge={0}>
          All
        </TabsTrigger>
        <TabsTrigger value="unfulfilled" badge={0}>
          Unfulfilled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="unfulfilled">
        <Panel>
          <p className="font-medium">All orders are fulfilled</p>
          <p className="text-sm text-fg-muted">New orders that need shipping will appear here.</p>
        </Panel>
      </TabsContent>
    </Tabs>
  ),
};

/** Overflow: many tabs scroll horizontally, with a fade at the clipped edge. */
export const Overflow: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <Tabs {...args} defaultValue="v0">
        <TabsList aria-label="Saved views">
          {[
            'All',
            'Unfulfilled',
            'Unpaid',
            'Open',
            'Ready to ship — express',
            'High-value wholesale',
            'Returns in progress',
            'Archived',
            'Flagged for review',
          ].map((label, i) => (
            <TabsTrigger key={label} value={`v${i}`} badge={i % 3 === 0 ? i * 7 + 2 : undefined}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="v0">
          <Panel>All orders.</Panel>
        </TabsContent>
      </Tabs>
    </div>
  ),
};
