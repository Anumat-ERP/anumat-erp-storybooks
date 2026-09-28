import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronLeft, ChevronRight, RefreshCw, WifiOff } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { fn } from 'storybook/test';
import type { Selection } from './bulk-actions';
import { Button, IconButton } from './button';
import type { DataTableColumn } from './data-table';
import { dateFmt, makeOrders, money, number, type Order, type OrderStatus } from './data-table.fixtures';
import { IndexTable, type IndexTableProps } from './index-table';

/* ---------------------------------------------------------------- helpers */

const TONE: Record<OrderStatus, string> = {
  Paid: 'bg-success-subtle text-success-subtle-fg',
  Pending: 'bg-warning-subtle text-warning-subtle-fg',
  Refunded: 'bg-surface-sunken text-fg-muted',
  Overdue: 'bg-critical-subtle text-critical-subtle-fg',
};

function EmptyBlock({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 py-4 text-center">
      <p className="text-lg font-semibold text-fg">{title}</p>
      <p className="max-w-md text-md text-fg-muted">{children}</p>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}

function Checks({ legend, options, value, onChange }: { legend: string; options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="sr-only">{legend}</legend>
      {options.map((o) => (
        <label key={o} className="flex items-center gap-2 text-md text-fg">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={value.includes(o)}
            onChange={(e) => onChange(e.target.checked ? [...value, o] : value.filter((x) => x !== o))}
          />
          {o}
        </label>
      ))}
    </fieldset>
  );
}

const ORDERS = { singular: 'order', plural: 'orders' };
const PAGE = 50;
const allOrders = makeOrders(1284, 17);

const columns: DataTableColumn<Order>[] = [
  {
    id: 'number',
    header: 'Order',
    sortable: true,
    sortValue: (o) => Number(o.number.slice(1)),
    cell: (o) => (
      <a href={`#orders/${o.id}`} className="text-fg-link hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
        {o.number}
      </a>
    ),
  },
  { id: 'date', header: 'Date', sortable: true, cell: (o) => dateFmt.format(o.date) },
  { id: 'customer', header: 'Customer', sortable: true, truncate: true, width: 220 },
  {
    id: 'status',
    header: 'Payment',
    cell: (o) => <span className={`inline-flex rounded-sm px-1.5 py-0.5 text-xs font-medium ${TONE[o.status]}`}>{o.status}</span>,
  },
  { id: 'fulfilment', header: 'Fulfilment' },
  { id: 'items', header: 'Items', numeric: true, sortable: true },
  { id: 'total', header: 'Total', numeric: true, sortable: true, cell: (o) => money.format(o.total) },
];

type Scenario = 'ok' | 'loading' | 'error' | 'first-run' | 'cleared' | 'offline' | 'permission';

interface DemoProps extends Partial<IndexTableProps<Order>> {
  scenario?: Scenario;
  initialStatus?: string[];
  initialQuery?: string;
  initialSelection?: 'page' | 'all' | 'some';
  source?: Order[];
  pageSize?: number;
}

/** The “orders index”: filters → sortable table → selection → bulk actions → pagination. */
function OrdersIndex({ scenario = 'ok', initialStatus = [], initialQuery = '', initialSelection, source = allOrders, pageSize = PAGE, ...args }: DemoProps) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<string[]>(initialStatus);
  const [fulfilment, setFulfilment] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  const matching = useMemo(() => {
    if (scenario === 'first-run' || scenario === 'cleared' || scenario === 'error') return [];
    const q = query.trim().toLowerCase();
    return source.filter(
      (o) =>
        (status.length === 0 || status.includes(o.status)) &&
        (fulfilment.length === 0 || fulfilment.includes(o.fulfilment)) &&
        (!q || o.customer.toLowerCase().includes(q) || o.number.includes(q)),
    );
  }, [scenario, source, query, status, fulfilment]);
  const rows = scenario === 'loading' ? [] : matching.slice(page * pageSize, page * pageSize + pageSize);

  const initial: Selection =
    initialSelection === 'all' ? 'All' : initialSelection === 'page' ? rows.map((r) => r.id) : initialSelection === 'some' ? rows.slice(0, 3).map((r) => r.id) : [];
  const [selected, setSelected] = useState<Selection>(initial);

  // Changing filters changes what “all” means, so selection resets.
  const refilter = (apply: () => void) => {
    apply();
    setPage(0);
    setSelected([]);
  };

  const pages = Math.max(1, Math.ceil(matching.length / pageSize));
  const offline = scenario === 'offline';
  const permission = scenario === 'permission';

  return (
    <IndexTable<Order>
      caption="Orders"
      columns={permission ? columns.filter((c) => c.id !== 'total') : columns}
      rows={rows}
      resourceName={ORDERS}
      totalCount={matching.length}
      getRowLabel={(o) => `order ${o.number}`}
      selectedRows={selected}
      onSelectionChange={setSelected}
      maxHeight={520}
      loading={scenario === 'loading'}
      promotedBulkActions={[
        { content: 'Mark as paid', onAction: fn() },
        permission
          ? { content: 'Delete', destructive: true, disabled: true, disabledReason: 'Only finance admins can delete orders', onAction: fn() }
          : { content: 'Delete', destructive: true, onAction: fn() },
      ]}
      bulkActions={[
        { content: 'Print packing slips', onAction: fn() },
        { content: 'Add tags', onAction: fn() },
        { content: 'Archive', onAction: fn() },
      ]}
      actionsDisabled={offline}
      actionsDisabledReason={offline ? 'Unavailable offline' : undefined}
      filters={{
        queryPlaceholder: 'Search by customer or order number',
        queryValue: query,
        onQueryChange: (q) => refilter(() => setQuery(q)),
        disabled: offline,
        filters: [
          {
            key: 'status',
            label: 'Payment',
            pinned: true,
            filter: <Checks legend="Payment" options={['Paid', 'Pending', 'Refunded', 'Overdue']} value={status} onChange={(v) => refilter(() => setStatus(v))} />,
          },
          {
            key: 'fulfilment',
            label: 'Fulfilment',
            filter: <Checks legend="Fulfilment" options={['Fulfilled', 'Unfulfilled', 'Partial']} value={fulfilment} onChange={(v) => refilter(() => setFulfilment(v))} />,
          },
        ],
        appliedFilters: [
          ...(status.length ? [{ key: 'status', label: status.join(', '), onRemove: () => refilter(() => setStatus([])) }] : []),
          ...(fulfilment.length ? [{ key: 'fulfilment', label: fulfilment.join(', '), onRemove: () => refilter(() => setFulfilment([])) }] : []),
        ],
        onClearAll: () =>
          refilter(() => {
            setQuery('');
            setStatus([]);
            setFulfilment([]);
          }),
      }}
      alert={
        offline ? (
          <div role="status" className="flex items-start gap-2 rounded-md border border-warning-border bg-warning-subtle px-3 py-2 text-sm text-warning-subtle-fg">
            <WifiOff aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span>
              You’re offline. Showing orders as of <time dateTime="2026-09-28T09:42:00+07:00">Sep 28, 2026, 9:42 AM</time>. Bulk actions and
              filtering are paused.
            </span>
          </div>
        ) : permission ? (
          <p className="text-sm text-fg-muted">Order totals are hidden for your role (Fulfilment staff). Deleting needs a finance admin.</p>
        ) : undefined
      }
      error={
        scenario === 'error' ? (
          <div role="alert" className="flex flex-col items-center gap-2 py-4 text-center">
            <p className="text-lg font-semibold text-fg">Couldn’t load orders</p>
            <p className="text-md text-fg-muted">The order service didn’t respond. Filters and selection are kept.</p>
            <Button icon={<RefreshCw aria-hidden />} onClick={fn()}>
              Try again
            </Button>
          </div>
        ) : undefined
      }
      emptyState={
        scenario === 'first-run' ? (
          <EmptyBlock title="No orders yet" action={<Button variant="primary">Create order</Button>}>
            Orders from the wholesale portal, point of sale and marketplaces appear here.
          </EmptyBlock>
        ) : scenario === 'cleared' ? (
          <EmptyBlock title="Every order is fulfilled">Nothing is waiting to ship. New orders will appear here.</EmptyBlock>
        ) : (
          <EmptyBlock
            title="No orders match these filters"
            action={
              <Button
                onClick={() =>
                  refilter(() => {
                    setQuery('');
                    setStatus([]);
                    setFulfilment([]);
                  })
                }
              >
                Clear filters
              </Button>
            }
          >
            Try a different search, or remove a filter.
          </EmptyBlock>
        )
      }
      footer={
        rows.length > 0 ? (
          <nav aria-label="Pagination" className="flex items-center justify-between gap-2">
            <span className="text-sm text-fg-muted tabular-nums">
              {number.format(page * pageSize + 1)}–{number.format(page * pageSize + rows.length)} of {number.format(matching.length)}
            </span>
            <span className="flex gap-1">
              <IconButton size="sm" variant="secondary" icon={<ChevronLeft />} label="Previous page" disabled={page === 0} onClick={() => setPage((p) => p - 1)} />
              <IconButton size="sm" variant="secondary" icon={<ChevronRight />} label="Next page" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} />
            </span>
          </nav>
        ) : undefined
      }
      {...args}
    />
  );
}

/* ---------------------------------------------------------------- meta */

const meta = {
  title: 'components/IndexTable',
  component: IndexTable<Order>,
  args: { caption: 'Orders', columns, rows: [], resourceName: ORDERS },
  argTypes: {
    resourceName: { control: 'object', description: 'Record name for counts and destructive labels. Required.', table: { type: { summary: '{ singular: string; plural: string }' } } },
    filters: {
      control: false,
      description: 'Props for the Filters bar (query, pills, add filter, clear all).',
      table: { type: { summary: 'FiltersProps' } },
    },
    toolbar: { control: false, description: 'Extra toolbar content under the filters.', table: { type: { summary: 'ReactNode' } } },
    caption: { control: 'text', description: 'Names the table and its scroll region.', table: { type: { summary: 'string' } } },
    columns: { control: false, description: 'DataTable columns.', table: { type: { summary: 'DataTableColumn<T>[]' } } },
    rows: { control: false, description: 'Rows on this page.', table: { type: { summary: 'T[]' } } },
    selectable: { control: 'boolean', description: 'Row checkboxes.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } } },
    selectedRows: { control: false, description: 'Controlled selection.', table: { type: { summary: "string[] | 'All'" } } },
    onSelectionChange: { control: false, description: 'Next selection; header checkbox = page only.', table: { type: { summary: "(selected: string[] | 'All') => void" } } },
    totalCount: { control: 'number', description: 'Rows matching the filters across pages.', table: { type: { summary: 'number' } } },
    stickyHeader: { control: 'boolean', description: 'Sticky header (needs `maxHeight`).', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } } },
    loading: { control: 'boolean', description: 'Skeleton rows or overlay; header stays.', table: { type: { summary: 'boolean' } } },
    emptyState: { control: false, description: 'Body when there are no rows.', table: { type: { summary: 'ReactNode' } } },
    error: { control: false, description: 'Body when loading failed.', table: { type: { summary: 'ReactNode' } } },
    footer: { control: false, description: 'Pagination.', table: { type: { summary: 'ReactNode' } } },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'The index screen of a record type — all orders, all invoices: **Filters** above a sortable **DataTable** with row selection and **BulkActions**, wired together.',
          '',
          '**Use** for a module’s main list screen, where people filter, select many records and act in bulk.',
          '',
          '**Don’t use** for a read-only report (use DataTable without selection) or for finding one record by name (use ResourceList).',
          '',
          'Selection is scope-honest: the header checkbox selects the visible 50; “Select all 1,284 orders” is separate, and destructive actions say “Delete all 1,284 orders”. Clear the selection when filters change so “all” never silently means a different set. All props besides `filters`/`toolbar` are DataTable props.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof IndexTable<Order>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <OrdersIndex /> };

export const WithSelection: Story = { render: () => <OrdersIndex initialSelection="some" /> };

/** “50 selected on this page · Select all 1,284 orders”. */
export const BulkSelectAll: Story = { render: () => <OrdersIndex initialSelection="page" /> };

/** After “Select all”: “All 1,284 orders selected” and “Delete all 1,284 orders”. */
export const AllSelected: Story = { render: () => <OrdersIndex initialSelection="all" /> };

export const Filtered: Story = { render: () => <OrdersIndex initialStatus={['Overdue']} /> };

export const EmptyFirstRun: Story = { render: () => <OrdersIndex scenario="first-run" /> };

export const EmptyFiltered: Story = { render: () => <OrdersIndex initialQuery="no such customer" initialStatus={['Refunded']} /> };

export const EmptyCleared: Story = { render: () => <OrdersIndex scenario="cleared" initialQuery="" /> };

export const Loading: Story = { render: () => <OrdersIndex scenario="loading" /> };

export const ErrorState: Story = { name: 'Error', render: () => <OrdersIndex scenario="error" /> };

export const Permission: Story = { render: () => <OrdersIndex scenario="permission" initialSelection="some" /> };

const longOrders = makeOrders(200, 9).map((o, i) =>
  i % 6 === 0 ? { ...o, customer: `${o.customer} International Holdings (Asia-Pacific) Company Limited — Head Office` } : o,
);

/** 200 rows, long names; the table scrolls inside its region with a sticky header. */
export const Overflow: Story = { render: () => <OrdersIndex source={longOrders} pageSize={200} maxHeight={480} stickyFirstColumn /> };

export const Offline: Story = { render: () => <OrdersIndex scenario="offline" initialSelection="some" /> };
