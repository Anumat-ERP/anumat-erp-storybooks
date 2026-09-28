import type { Meta, StoryObj } from '@storybook/react-vite';
import { Download, Eye, Pencil, RefreshCw, WifiOff } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { fn } from 'storybook/test';
import type { Selection } from './bulk-actions';
import { Button, IconButton } from './button';
import { DataTable, type DataTableColumn, type DataTableProps, type DataTableSort } from './data-table';
import { dateFmt, makeOrders, makeStock, money, number, type Order, type OrderStatus, type StockLevel } from './data-table.fixtures';

/* ---------------------------------------------------------------- helpers */

const STATUS_TONE: Record<OrderStatus, string> = {
  Paid: 'bg-success-subtle text-success-subtle-fg',
  Pending: 'bg-warning-subtle text-warning-subtle-fg',
  Refunded: 'bg-surface-sunken text-fg-muted',
  Overdue: 'bg-critical-subtle text-critical-subtle-fg',
};

function StatusPill({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex rounded-sm px-1.5 py-0.5 text-xs font-medium ${STATUS_TONE[status]}`}>{status}</span>;
}

function EmptyBlock({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 py-4 text-center">
      <p className="text-lg font-semibold text-fg">{title}</p>
      <p className="max-w-md text-md text-fg-muted">{children}</p>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}

function Notice({ tone, icon, children }: { tone: 'warning' | 'critical'; icon?: ReactNode; children: ReactNode }) {
  const toneClass =
    tone === 'warning'
      ? 'border-warning-border bg-warning-subtle text-warning-subtle-fg'
      : 'border-critical-border bg-critical-subtle text-critical-subtle-fg';
  return (
    <div role={tone === 'critical' ? 'alert' : 'status'} className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${toneClass} [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0`}>
      {icon}
      <div>{children}</div>
    </div>
  );
}

const orderColumns: DataTableColumn<Order>[] = [
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
  { id: 'customer', header: 'Customer', sortable: true, truncate: true, width: 200 },
  { id: 'status', header: 'Payment', sortable: true, cell: (o) => <StatusPill status={o.status} /> },
  { id: 'fulfilment', header: 'Fulfilment', sortable: true },
  { id: 'items', header: 'Items', numeric: true, sortable: true },
  { id: 'total', header: 'Total', numeric: true, sortable: true, cell: (o) => money.format(o.total) },
];

const orders12 = makeOrders(12);
const orders50 = makeOrders(50);
const sum = (rows: Order[], key: 'items' | 'total') => rows.reduce((acc, r) => acc + r[key], 0);
const orderTotals = (rows: Order[]) => ({ items: number.format(sum(rows, 'items')), total: money.format(sum(rows, 'total')) });

const ORDERS = { singular: 'order', plural: 'orders' };

/* ---------------------------------------------------------------- meta */

const meta = {
  title: 'components/DataTable',
  component: DataTable<Order>,
  args: {
    caption: 'Recent orders',
    columns: orderColumns,
    rows: orders12,
    totals: orderTotals(orders12),
    density: 'dense',
    onSort: fn(),
  },
  argTypes: {
    caption: {
      control: 'text',
      description: 'Names the table and its scroll region for assistive tech. Required.',
      table: { type: { summary: 'string' } },
    },
    captionHidden: {
      control: 'boolean',
      description: 'Hide the caption visually (e.g. when a Card heading already says it). Still announced.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    columns: {
      control: false,
      description:
        'Column definitions. `numeric` end-aligns in tabular figures and sorts numerically; `sortValue` sorts by a raw value when the cell is formatted.',
      table: {
        type: {
          summary:
            "{ id; header; align?: 'start' | 'end'; numeric?; sortable?; width?; truncate?; cell?: (row) => ReactNode; sortValue?: (row) => value }[]",
        },
      },
    },
    rows: { control: false, description: 'Rows on this page.', table: { type: { summary: 'T[]' } } },
    getRowId: { control: false, description: 'Stable row id. Defaults to `row.id`.', table: { type: { summary: '(row, index) => string' } } },
    getRowLabel: {
      control: false,
      description: 'Short row name for its checkbox label — “Select order #10240”.',
      table: { type: { summary: '(row) => string' } },
    },
    sort: {
      control: false,
      description: 'Controlled sort. When set, rows render in the order given — sort on the server.',
      table: { type: { summary: "{ columnId: string; direction: 'ascending' | 'descending' } | null" } },
    },
    defaultSort: {
      control: false,
      description: 'Initial sort when uncontrolled.',
      table: { type: { summary: "{ columnId: string; direction: 'ascending' | 'descending' } | null" } },
    },
    onSort: {
      control: false,
      description: 'Called with the next sort. Headers cycle ascending → descending.',
      table: { type: { summary: '(sort: DataTableSort) => void' } },
    },
    totals: {
      control: false,
      description: 'Totals keyed by column id. The first column shows `totalsLabel` if it has no total.',
      table: { type: { summary: 'Partial<Record<string, ReactNode>>' } },
    },
    totalsPosition: {
      control: 'inline-radio',
      options: ['top', 'bottom'],
      description: '`top` puts totals in `thead` (read first on long tables); `bottom` in `tfoot`.',
      table: { type: { summary: "'top' | 'bottom'" }, defaultValue: { summary: 'bottom' } },
    },
    totalsLabel: { control: 'text', description: 'Label for the totals row.', table: { type: { summary: 'string' }, defaultValue: { summary: 'Total' } } },
    stickyHeader: {
      control: 'boolean',
      description: 'Keep the header visible while scrolling. Needs `maxHeight`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    stickyFirstColumn: {
      control: 'boolean',
      description: 'Keep the first column visible while scrolling sideways.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    maxHeight: { control: 'text', description: 'Max height of the scroll area.', table: { type: { summary: 'number | string' } } },
    density: {
      control: 'inline-radio',
      options: ['dense', 'comfortable'],
      description: '`dense` for analysis screens; `comfortable` for short tables with few columns.',
      table: { type: { summary: "'dense' | 'comfortable'" }, defaultValue: { summary: 'dense' } },
    },
    bordered: {
      control: 'boolean',
      description: 'Outer border and radius. Turn off inside a flush Card.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    loading: {
      control: 'boolean',
      description: 'Keeps the header; skeleton rows when there are no rows yet, otherwise dims rows under a spinner.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    loadingVariant: {
      control: 'inline-radio',
      options: ['auto', 'skeleton', 'overlay'],
      description: 'Force a loading style.',
      table: { type: { summary: "'auto' | 'skeleton' | 'overlay'" }, defaultValue: { summary: 'auto' } },
    },
    loadingRows: { control: 'number', description: 'Skeleton rows.', table: { type: { summary: 'number' }, defaultValue: { summary: '5' } } },
    emptyState: { control: false, description: 'Body content when there are no rows.', table: { type: { summary: 'ReactNode' } } },
    error: { control: false, description: 'Body content when loading failed. Include a retry.', table: { type: { summary: 'ReactNode' } } },
    toolbar: { control: false, description: 'Above the table — filters, export.', table: { type: { summary: 'ReactNode' } } },
    alert: { control: false, description: 'A notice above the table, e.g. offline.', table: { type: { summary: 'ReactNode' } } },
    footer: { control: false, description: 'Below the table — pagination.', table: { type: { summary: 'ReactNode' } } },
    selectable: {
      control: 'boolean',
      description: 'Show row checkboxes. Implied by `onSelectionChange`.',
      table: { type: { summary: 'boolean' } },
    },
    selectedRows: {
      control: false,
      description: 'Controlled selection: ids, or `"All"` for every matching row across pages.',
      table: { type: { summary: "string[] | 'All'" } },
    },
    onSelectionChange: {
      control: false,
      description: 'Called with the next selection. The header checkbox selects the visible page only.',
      table: { type: { summary: "(selected: string[] | 'All') => void" } },
    },
    totalCount: { control: 'number', description: 'Rows matching the filters across all pages — enables “Select all N”.', table: { type: { summary: 'number' } } },
    resourceName: { control: 'object', description: 'Record name for counts.', table: { type: { summary: '{ singular: string; plural: string }' } } },
    promotedBulkActions: {
      control: false,
      description: 'Bulk actions shown as buttons. Destructive ones are labelled with the count.',
      table: { type: { summary: 'BulkAction[]' } },
    },
    bulkActions: { control: false, description: 'Bulk actions in “More actions”.', table: { type: { summary: 'BulkAction[]' } } },
    actionsDisabled: { control: 'boolean', description: 'Disable bulk actions (e.g. offline).', table: { type: { summary: 'boolean' } } },
    actionsDisabledReason: { control: 'text', description: 'Why bulk actions are disabled.', table: { type: { summary: 'string' } } },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A real `<table>` for reading and comparing figures across records — orders by value, stock by warehouse, invoices by age.',
          '',
          '**Use** when people *analyse numbers*: sort a column, scan totals, compare rows. Numeric columns end-align in tabular figures; sorting compares numbers numerically and text with `localeCompare`.',
          '',
          '**Don’t use** to find and open one record by name — use **ResourceList**, which is built for finding and acting on records. Don’t use for layout, or for two columns of label/value — use a description list.',
          '',
          'Wide tables scroll inside a focusable region (`role="region"`, named by the caption) so keyboard users can scroll them; `stickyFirstColumn` keeps the row label in view. The header checkbox selects **the visible page only** — “Select all 1,284 orders” is a separate, explicit step.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof DataTable<Order>>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------- stories */

export const Default: Story = {};

export const TotalsOnTop: Story = {
  args: { totalsPosition: 'top', totalsLabel: 'Totals' },
};

export const Comfortable: Story = {
  args: { density: 'comfortable', rows: orders12.slice(0, 5), totals: undefined },
};

/** Controlled sort: the table reports the sort and shows rows in the order given (server sorting). */
function ServerSorted(args: DataTableProps<Order>) {
  const [sort, setSort] = useState<DataTableSort | null>({ columnId: 'total', direction: 'descending' });
  const rows = useMemo(() => {
    if (!sort) return orders12;
    const f = sort.direction === 'ascending' ? 1 : -1;
    return [...orders12].sort((a, b) => {
      const x = a[sort.columnId as keyof Order];
      const y = b[sort.columnId as keyof Order];
      return (x < y ? -1 : x > y ? 1 : 0) * f;
    });
  }, [sort]);
  return (
    <DataTable
      {...args}
      rows={rows}
      sort={sort}
      onSort={(next) => {
        setSort(next);
        args.onSort?.(next);
      }}
    />
  );
}

export const ControlledSort: Story = { render: (args) => <ServerSorted {...args} /> };

const warehouseColumns: DataTableColumn<StockLevel>[] = [
  { id: 'product', header: 'Product', sortable: true, truncate: true, width: 220 },
  { id: 'sku', header: 'SKU', sortable: true, cell: (s) => <span className="font-mono text-sm">{s.sku}</span> },
  { id: 'bangkok', header: 'Bangkok', numeric: true, sortable: true, cell: (s) => number.format(s.bangkok) },
  { id: 'chiangMai', header: 'Chiang Mai', numeric: true, sortable: true, cell: (s) => number.format(s.chiangMai) },
  { id: 'singapore', header: 'Singapore', numeric: true, sortable: true, cell: (s) => number.format(s.singapore) },
  { id: 'kualaLumpur', header: 'Kuala Lumpur', numeric: true, sortable: true, cell: (s) => number.format(s.kualaLumpur) },
  { id: 'reserved', header: 'Reserved', numeric: true, sortable: true, cell: (s) => number.format(s.reserved) },
  {
    id: 'available',
    header: 'Available',
    numeric: true,
    sortable: true,
    sortValue: (s) => available(s),
    cell: (s) => {
      const a = available(s);
      return a < s.reorderPoint ? (
        <span className="font-semibold text-critical-subtle-fg">
          {number.format(a)}
          <span className="sr-only"> (below reorder point)</span>
        </span>
      ) : (
        number.format(a)
      );
    },
  },
  { id: 'reorderPoint', header: 'Reorder at', numeric: true, sortable: true, cell: (s) => number.format(s.reorderPoint) },
  { id: 'unitCost', header: 'Unit cost', numeric: true, sortable: true, cell: (s) => money.format(s.unitCost) },
  { id: 'value', header: 'Stock value', numeric: true, sortable: true, sortValue: (s) => value(s), cell: (s) => money.format(value(s)) },
];

function available(s: StockLevel) {
  return s.bangkok + s.chiangMai + s.singapore + s.kualaLumpur - s.reserved;
}
function value(s: StockLevel) {
  return (s.bangkok + s.chiangMai + s.singapore + s.kualaLumpur) * s.unitCost;
}

const stock30 = makeStock(30);

/** Wide table: scrolls sideways inside a focusable region; the product column and header stay put. */
export const StickyHeaderAndColumn: Story = {
  render: (args) => (
    <div className="max-w-[720px]">
      <DataTable<StockLevel>
        caption="Stock levels by warehouse"
        columns={warehouseColumns}
        rows={stock30}
        density={args.density}
        stickyHeader
        stickyFirstColumn
        maxHeight={360}
        defaultSort={{ columnId: 'available', direction: 'ascending' }}
        totals={{ value: money.format(stock30.reduce((a, s) => a + value(s), 0)) }}
      />
    </div>
  ),
};

/* --------------------------------------------------------- selection */

function SelectableOrders({
  initial = [],
  ...args
}: DataTableProps<Order> & { initial?: Selection }) {
  const [selected, setSelected] = useState<Selection>(initial);
  return (
    <DataTable
      {...args}
      rows={orders50}
      totals={undefined}
      totalCount={1284}
      resourceName={ORDERS}
      getRowLabel={(o) => `order ${o.number}`}
      selectedRows={selected}
      onSelectionChange={setSelected}
      stickyHeader
      maxHeight={420}
      promotedBulkActions={[
        { content: 'Mark as paid', onAction: fn() },
        { content: 'Print packing slips', icon: <Download aria-hidden />, onAction: fn() },
      ]}
      bulkActions={[
        { content: 'Add tags', onAction: fn() },
        { content: 'Archive', onAction: fn() },
        { content: 'Delete', destructive: true, onAction: fn() },
      ]}
    />
  );
}

/** Tick rows, or the header checkbox — which selects the 50 visible orders only. */
export const WithSelection: Story = {
  render: (args) => <SelectableOrders {...args} initial={orders50.slice(0, 3).map((o) => o.id)} />,
};

/**
 * The whole page is selected: the bar says “50 selected on this page” and
 * offers “Select all 1,284 orders”. After that it reads “All 1,284 orders
 * selected”, and destructive actions say “Delete all 1,284 orders”.
 */
export const BulkSelectAll: Story = {
  render: (args) => <SelectableOrders {...args} initial={orders50.map((o) => o.id)} />,
};

/* --------------------------------------------------------- states */

export const EmptyFirstRun: Story = {
  args: {
    rows: [],
    totals: undefined,
    emptyState: (
      <EmptyBlock title="No orders yet" action={<Button variant="primary">Create order</Button>}>
        Orders from every sales channel appear here. Create your first order or connect a channel.
      </EmptyBlock>
    ),
  },
};

export const EmptyFiltered: Story = {
  args: {
    rows: [],
    totals: undefined,
    toolbar: <p className="text-sm text-fg-muted">Filters: Status is Refunded · Date is last 7 days</p>,
    emptyState: (
      <EmptyBlock title="No orders match these filters" action={<Button>Clear filters</Button>}>
        No refunded orders in the last 7 days. Try a wider date range or clear the filters.
      </EmptyBlock>
    ),
  },
};

export const EmptyCleared: Story = {
  args: {
    caption: 'Overdue invoices',
    rows: [],
    totals: undefined,
    emptyState: (
      <EmptyBlock title="All invoices are paid">Nothing is overdue. New overdue invoices will show up here.</EmptyBlock>
    ),
  },
};

/** First load: skeleton rows under the real header, so the layout doesn't jump. */
export const Loading: Story = { args: { rows: [], totals: undefined, loading: true } };

/** Refresh: existing rows stay, dimmed under a spinner. */
export const LoadingOverlay: Story = { args: { loading: true } };

export const ErrorState: Story = {
  name: 'Error',
  args: {
    rows: [],
    totals: undefined,
    error: (
      <div role="alert" className="flex flex-col items-center gap-2 py-4 text-center">
        <p className="text-lg font-semibold text-fg">Couldn’t load orders</p>
        <p className="text-md text-fg-muted">The order service didn’t respond (timeout after 30 s). Your data is safe.</p>
        <Button icon={<RefreshCw aria-hidden />} onClick={fn()}>
          Try again
        </Button>
      </div>
    ),
  },
};

/** Permission: the cost column is hidden for this role, and deleting is disabled — both with the reason. */
function PermissionTable(args: DataTableProps<StockLevel>) {
  const [selected, setSelected] = useState<Selection>([]);
  const cols = warehouseColumns.filter((c) => c.id !== 'unitCost' && c.id !== 'value');
  return (
    <DataTable<StockLevel>
      {...args}
      caption="Stock levels"
      columns={cols}
      rows={stock30.slice(0, 8)}
      stickyFirstColumn
      selectedRows={selected}
      onSelectionChange={setSelected}
      resourceName={{ singular: 'product', plural: 'products' }}
      getRowLabel={(s) => s.product}
      promotedBulkActions={[
        { content: 'Transfer stock', onAction: fn() },
        { content: 'Delete', destructive: true, disabled: true, disabledReason: 'Only inventory managers can delete products', onAction: fn() },
      ]}
      alert={
        <p className="text-sm text-fg-muted">
          Unit cost and stock value are hidden — your role (Warehouse staff) can’t see costs. Ask an inventory manager for access.
        </p>
      }
    />
  );
}

export const Permission: Story = {
  render: ({ caption: _c, columns: _cols, rows: _r, totals: _t, onSort: _s, ...args }) => (
    <PermissionTable {...(args as DataTableProps<StockLevel>)} />
  ),
};

const longOrders = makeOrders(200, 3).map((o, i) =>
  i % 7 === 0
    ? { ...o, customer: `${o.customer} International Holdings (Asia-Pacific) Company Limited — Head Office` }
    : o,
);

/** Overflow: 200 rows, long customer names truncated with a title, many columns scrolling sideways. */
export const Overflow: Story = {
  render: (args) => (
    <div className="max-w-[760px]">
      <DataTable<Order>
        {...args}
        caption="All orders, September 2026"
        rows={longOrders}
        columns={[
          ...orderColumns,
          { id: 'channel', header: 'Sales channel', cell: (o) => (Number(o.id.slice(4)) % 2 ? 'Wholesale portal' : 'Point of sale — Bangkok flagship') },
          { id: 'tax', header: 'VAT (7%)', numeric: true, cell: (o) => money.format(o.total * 0.07) },
          { id: 'net', header: 'Net', numeric: true, cell: (o) => money.format(o.total * 0.93) },
        ]}
        totals={orderTotals(longOrders)}
        stickyHeader
        stickyFirstColumn
        maxHeight={420}
      />
    </div>
  ),
};

/** Offline: stale data with its timestamp; row actions that need the network are disabled. */
export const Offline: Story = {
  args: {
    alert: (
      <Notice tone="warning" icon={<WifiOff aria-hidden />}>
        You’re offline. Showing orders as of <time dateTime="2026-09-28T09:42:00+07:00">Sep 28, 2026, 9:42 AM</time>. Editing is
        unavailable until you reconnect.
      </Notice>
    ),
    columns: [
      ...orderColumns,
      {
        id: 'actions',
        header: <span className="sr-only">Actions</span>,
        align: 'end',
        cell: (o) => (
          <span className="inline-flex gap-1">
            <IconButton size="sm" icon={<Eye />} label={`View order ${o.number}`} />
            <IconButton size="sm" icon={<Pencil />} label={`Edit order ${o.number} (unavailable offline)`} disabled />
          </span>
        ),
      },
    ],
  },
};
