import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, RefreshCw, WifiOff } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { fn } from 'storybook/test';
import type { Selection } from './bulk-actions';
import { Button } from './button';
import { Card } from './card';
import { makeCustomers, money, number, type Customer } from './data-table.fixtures';
import { Filters } from './filters';
import { ResourceItem, ResourceList, type ResourceListProps } from './resource-list';

/* ---------------------------------------------------------------- helpers */

function Initials({ name }: { name: string }) {
  const letters = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
  return (
    <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-primary-subtle text-sm font-semibold text-primary-subtle-fg">
      {letters}
    </span>
  );
}

function EmptyBlock({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="text-lg font-semibold text-fg">{title}</p>
      <p className="max-w-md text-md text-fg-muted">{children}</p>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}

const CUSTOMERS = { singular: 'customer', plural: 'customers' };
const customers = makeCustomers(10);
const sortOptions = [
  { label: 'Last order (newest)', value: 'recent' },
  { label: 'Total spent (high–low)', value: 'spent-desc' },
  { label: 'Name (A–Z)', value: 'name' },
];

function renderCustomer(c: Customer, _id: string, _index: number, opts: { actionsDisabled?: boolean } = {}) {
  return (
    <ResourceItem
      name={c.name}
      url={`#customers/${c.id}`}
      media={<Initials name={c.name} />}
      shortcutActions={
        <Button size="sm" variant="tertiary" icon={<Mail aria-hidden />} disabled={opts.actionsDisabled} aria-label={`Email ${c.name}`}>
          Email
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
        <span className="truncate">{c.email}</span>
        <span>{c.city}</span>
        <span className="tabular-nums">
          {number.format(c.orders)} orders · {money.format(c.spent)} spent
        </span>
      </div>
    </ResourceItem>
  );
}

/* ---------------------------------------------------------------- meta */

const meta = {
  title: 'components/ResourceList',
  component: ResourceList<Customer>,
  args: {
    items: customers,
    renderItem: renderCustomer,
    resourceName: CUSTOMERS,
    totalItemsCount: 1284,
    sortOptions,
    sortValue: 'recent',
    onSortChange: fn(),
  },
  decorators: [
    (Story) => (
      <Card flush className="max-w-3xl">
        <Story />
      </Card>
    ),
  ],
  argTypes: {
    items: { control: false, description: 'Records on this page.', table: { type: { summary: 'T[]' } } },
    renderItem: {
      control: false,
      description: 'Render one record, usually a `ResourceItem`.',
      table: { type: { summary: '(item: T, id: string, index: number) => ReactNode' } },
    },
    idForItem: { control: false, description: 'Stable id. Defaults to `item.id`.', table: { type: { summary: '(item: T, index: number) => string' } } },
    resourceName: {
      control: 'object',
      description: 'Record name in counts and labels (“Showing 10 of 1,284 customers”).',
      table: { type: { summary: '{ singular: string; plural: string }' }, defaultValue: { summary: "{ singular: 'item', plural: 'items' }" } },
    },
    totalItemsCount: {
      control: 'number',
      description: 'Records matching the filters across all pages. Enables “Showing 10 of 1,284” and “Select all 1,284”.',
      table: { type: { summary: 'number' } },
    },
    selectable: { control: 'boolean', description: 'Show checkboxes. Implied by `onSelectionChange`.', table: { type: { summary: 'boolean' } } },
    selectedItems: {
      control: false,
      description: 'Controlled selection: ids, or `"All"` for every matching record across pages.',
      table: { type: { summary: "string[] | 'All'" } },
    },
    onSelectionChange: {
      control: false,
      description: 'Called with the next selection. The header checkbox selects the page; “Select all N” yields `"All"`.',
      table: { type: { summary: "(selected: string[] | 'All') => void" } },
    },
    promotedBulkActions: { control: false, description: 'Bulk actions as buttons.', table: { type: { summary: 'BulkAction[]' } } },
    bulkActions: { control: false, description: 'Bulk actions in “More actions”.', table: { type: { summary: 'BulkAction[]' } } },
    sortOptions: { control: false, description: 'Choices for the “Sort by” select.', table: { type: { summary: '{ label: string; value: string }[]' } } },
    sortValue: { control: 'text', description: 'Current sort value.', table: { type: { summary: 'string' } } },
    onSortChange: { control: false, description: 'Called with the chosen sort.', table: { type: { summary: '(value: string) => void' } } },
    filterControl: { control: false, description: 'Filters above the header; stays when the list is empty.', table: { type: { summary: 'ReactNode' } } },
    loading: {
      control: 'boolean',
      description: 'Keeps rows, dims them under a spinner, sets `aria-busy`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    emptyState: { control: false, description: 'Shown when there are no items. Pick the right empty.', table: { type: { summary: 'ReactNode' } } },
    error: { control: false, description: 'Shown when loading failed. Include a retry.', table: { type: { summary: 'ReactNode' } } },
    alert: { control: false, description: 'A notice above the list, e.g. offline.', table: { type: { summary: 'ReactNode' } } },
    actionsDisabled: { control: 'boolean', description: 'Disable bulk actions.', table: { type: { summary: 'boolean' } } },
    actionsDisabledReason: { control: 'text', description: 'Why bulk actions are disabled.', table: { type: { summary: 'string' } } },
    showHeader: {
      control: 'boolean',
      description: 'Show the header (count, sort, select-all).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A list of records — customers, products, suppliers — for **finding and acting on** them.',
          '',
          '**Use** when people scan for a record by name and open it, or select a few for a bulk action. Each row’s name is a real link; the whole row is clickable; shortcut actions appear on hover and focus.',
          '',
          '**Don’t use** to analyse or compare numbers across records — use **DataTable**, which aligns figures in sortable columns with totals. Don’t use for a handful of fixed items — a plain list in a Card is enough.',
          '',
          'Selection is controlled (`string[] | "All"`). The header checkbox selects **the visible page only**; “Select all 1,284 customers” is a separate step. Row checkboxes stop their events, so selecting never opens the record. With items selected, Space on a focused row toggles it.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof ResourceList<Customer>>;

export default meta;
type Story = StoryObj<typeof meta>;

function Selectable({ initial = [], ...args }: ResourceListProps<Customer> & { initial?: Selection }) {
  const [selected, setSelected] = useState<Selection>(initial);
  return (
    <ResourceList
      {...args}
      selectedItems={selected}
      onSelectionChange={setSelected}
      promotedBulkActions={[{ content: 'Add tags', onAction: fn() }]}
      bulkActions={[
        { content: 'Export', onAction: fn() },
        { content: 'Merge', onAction: fn(), disabled: true, disabledReason: 'Select exactly two customers' },
        { content: 'Delete', destructive: true, onAction: fn() },
      ]}
    />
  );
}

export const Default: Story = { render: (args) => <Selectable {...args} /> };

export const WithSelection: Story = {
  render: (args) => <Selectable {...args} initial={customers.slice(0, 2).map((c) => c.id)} />,
};

/** The whole page is selected — “10 selected on this page · Select all 1,284 customers”. */
export const BulkSelectAll: Story = {
  render: (args) => <Selectable {...args} initial={customers.map((c) => c.id)} />,
};

/** Read-only list without selection. */
export const NotSelectable: Story = {};

function WithFiltersDemo(args: ResourceListProps<Customer>) {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState<string[]>(['Bangkok']);
  const items = useMemo(
    () =>
      makeCustomers(40).filter(
        (c) => (city.length === 0 || city.includes(c.city)) && c.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [city, query],
  );
  return (
    <ResourceList
      {...args}
      items={items.slice(0, 10)}
      totalItemsCount={items.length}
      filterControl={
        <Filters
          queryValue={query}
          onQueryChange={setQuery}
          queryPlaceholder="Search customers"
          filters={[
            {
              key: 'city',
              label: 'City',
              filter: (
                <fieldset className="flex flex-col gap-1.5">
                  <legend className="sr-only">City</legend>
                  {['Bangkok', 'Chiang Mai', 'Singapore', 'Phuket'].map((c) => (
                    <label key={c} className="flex items-center gap-2 text-md">
                      <input
                        type="checkbox"
                        checked={city.includes(c)}
                        onChange={(e) => setCity((prev) => (e.target.checked ? [...prev, c] : prev.filter((x) => x !== c)))}
                      />
                      {c}
                    </label>
                  ))}
                </fieldset>
              ),
            },
          ]}
          appliedFilters={city.length ? [{ key: 'city', label: city.join(', '), onRemove: () => setCity([]) }] : []}
          onClearAll={() => {
            setCity([]);
            setQuery('');
          }}
        />
      }
      emptyState={
        <EmptyBlock
          title="No customers match these filters"
          action={
            <Button
              onClick={() => {
                setCity([]);
                setQuery('');
              }}
            >
              Clear filters
            </Button>
          }
        >
          Try another search or remove a filter.
        </EmptyBlock>
      }
    />
  );
}

export const WithFilters: Story = { render: (args) => <WithFiltersDemo {...args} /> };

export const EmptyFirstRun: Story = {
  args: {
    items: [],
    totalItemsCount: 0,
    emptyState: (
      <EmptyBlock title="Add your first customer" action={<Button variant="primary">Add customer</Button>}>
        Customers you add or import appear here, with their orders and balances.
      </EmptyBlock>
    ),
  },
};

export const EmptyFiltered: Story = {
  args: {
    items: [],
    totalItemsCount: 0,
    filterControl: (
      <Filters
        queryValue="zzz trading"
        onQueryChange={fn()}
        queryPlaceholder="Search customers"
        filters={[{ key: 'city', label: 'City', filter: <p className="text-sm">City options</p> }]}
        appliedFilters={[{ key: 'city', label: 'Phuket', onRemove: fn() }]}
        onClearAll={fn()}
      />
    ),
    emptyState: (
      <EmptyBlock title="No customers match “zzz trading” in Phuket" action={<Button>Clear filters</Button>}>
        Check the spelling or remove the City filter.
      </EmptyBlock>
    ),
  },
};

export const EmptyCleared: Story = {
  args: {
    items: [],
    totalItemsCount: 0,
    resourceName: { singular: 'customer awaiting review', plural: 'customers awaiting review' },
    emptyState: (
      <EmptyBlock title="All caught up">Every new customer has been reviewed. New sign-ups will appear here.</EmptyBlock>
    ),
  },
};

/** Loading keeps the current rows (dimmed) under a spinner and sets `aria-busy`. */
export const Loading: Story = { args: { loading: true } };

export const ErrorState: Story = {
  name: 'Error',
  args: {
    error: (
      <div role="alert" className="flex flex-col items-center gap-2 text-center">
        <p className="text-lg font-semibold text-fg">Couldn’t load customers</p>
        <p className="text-md text-fg-muted">The server returned an error (503). Nothing was changed.</p>
        <Button icon={<RefreshCw aria-hidden />} onClick={fn()}>
          Try again
        </Button>
      </div>
    ),
  },
};

/** Permission: selection works, but Delete is unavailable to this role — with the reason. */
function PermissionDemo(args: ResourceListProps<Customer>) {
  const [selected, setSelected] = useState<Selection>([customers[0]?.id ?? '']);
  return (
    <ResourceList
      {...args}
      selectedItems={selected}
      onSelectionChange={setSelected}
      promotedBulkActions={[
        { content: 'Export', onAction: fn() },
        { content: 'Delete', destructive: true, disabled: true, disabledReason: 'Only account owners can delete customers', onAction: fn() },
      ]}
      alert={<p className="text-sm text-fg-muted">Your role (Sales rep) can view and export customers but not delete them.</p>}
    />
  );
}

export const Permission: Story = { render: (args) => <PermissionDemo {...args} /> };

const many = makeCustomers(200, 21).map((c, i) =>
  i % 5 === 0 ? { ...c, name: `${c.name} International Holdings (Asia-Pacific) Company Limited — Regional Procurement Office` } : c,
);

/** Overflow: 200 rows and very long names. Names truncate; secondary lines wrap. */
export const Overflow: Story = {
  args: { items: many, totalItemsCount: 200 },
  render: (args) => (
    <div className="max-h-[560px] overflow-auto" tabIndex={0} role="region" aria-label="Customers (scrollable)">
      <Selectable {...args} />
    </div>
  ),
};

/** Offline: stale data with a timestamp; row shortcuts and bulk actions are disabled. */
export const Offline: Story = {
  render: (args) => (
    <Selectable
      {...args}
      initial={[customers[1]?.id ?? '']}
      renderItem={(c, id, i) => renderCustomer(c, id, i, { actionsDisabled: true })}
      actionsDisabled
      actionsDisabledReason="Unavailable offline"
      alert={
        <div role="status" className="flex items-start gap-2 rounded-md border border-warning-border bg-warning-subtle px-3 py-2 text-sm text-warning-subtle-fg">
          <WifiOff aria-hidden className="mt-0.5 size-4 shrink-0" />
          <span>
            You’re offline. Showing customers as of <time dateTime="2026-09-28T09:42:00+07:00">Sep 28, 2026, 9:42 AM</time>.
          </span>
        </div>
      }
    />
  ),
};
