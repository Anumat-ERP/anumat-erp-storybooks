import type { Meta, StoryObj } from '@storybook/react-vite';
import { WifiOff } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Filters, type AppliedFilter, type FilterDefinition, type FiltersProps } from './filters';
import { Stack } from './stack';

/* A small local checkbox group for filter content (the form Checkbox lives elsewhere). */
function CheckboxGroup({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 text-md text-fg">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={value.includes(option)}
            onChange={(e) => onChange(e.target.checked ? [...value, option] : value.filter((v) => v !== option))}
          />
          {option}
        </label>
      ))}
    </fieldset>
  );
}

function RadioGroup({ legend, options, value, onChange }: { legend: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 text-md text-fg">
          <input type="radio" className="size-4 accent-primary" name={legend} checked={value === option} onChange={() => onChange(option)} />
          {option}
        </label>
      ))}
    </fieldset>
  );
}

interface OrderFilterState {
  query: string;
  status: string[];
  fulfilment: string[];
  date: string;
  channel: string[];
}

function useOrderFilters(initial: Partial<OrderFilterState> = {}) {
  const [state, setState] = useState<OrderFilterState>({ query: '', status: [], fulfilment: [], date: '', channel: [], ...initial });
  const set = <K extends keyof OrderFilterState>(key: K, value: OrderFilterState[K]) => setState((s) => ({ ...s, [key]: value }));

  const filters: FilterDefinition[] = [
    {
      key: 'status',
      label: 'Payment status',
      pinned: true,
      filter: <CheckboxGroup legend="Payment status" options={['Paid', 'Pending', 'Refunded', 'Overdue']} value={state.status} onChange={(v) => set('status', v)} />,
    },
    {
      key: 'fulfilment',
      label: 'Fulfilment',
      filter: <CheckboxGroup legend="Fulfilment" options={['Fulfilled', 'Unfulfilled', 'Partial']} value={state.fulfilment} onChange={(v) => set('fulfilment', v)} />,
    },
    {
      key: 'date',
      label: 'Order date',
      filter: <RadioGroup legend="Order date" options={['Today', 'Last 7 days', 'Last 30 days', 'This quarter']} value={state.date} onChange={(v) => set('date', v)} />,
    },
    {
      key: 'channel',
      label: 'Sales channel',
      filter: <CheckboxGroup legend="Sales channel" options={['Wholesale portal', 'Point of sale', 'Marketplace']} value={state.channel} onChange={(v) => set('channel', v)} />,
    },
  ];

  const applied: AppliedFilter[] = [];
  if (state.status.length) applied.push({ key: 'status', label: state.status.join(', '), onRemove: () => set('status', []) });
  if (state.fulfilment.length) applied.push({ key: 'fulfilment', label: state.fulfilment.join(', '), onRemove: () => set('fulfilment', []) });
  if (state.date) applied.push({ key: 'date', label: state.date, onRemove: () => set('date', '') });
  if (state.channel.length) applied.push({ key: 'channel', label: state.channel.join(', '), onRemove: () => set('channel', []) });

  return {
    state,
    filters,
    applied,
    setQuery: (q: string) => set('query', q),
    clearAll: () => setState({ query: '', status: [], fulfilment: [], date: '', channel: [] }),
  };
}

function Demo({ initial, ...args }: Partial<FiltersProps> & { initial?: Partial<OrderFilterState> }) {
  const f = useOrderFilters(initial);
  return (
    <Stack gap={3}>
      <Filters
        queryPlaceholder="Search orders"
        {...args}
        filters={f.filters}
        appliedFilters={f.applied}
        queryValue={f.state.query}
        onQueryChange={f.setQuery}
        onClearAll={f.clearAll}
      />
      <p className="text-sm text-fg-muted">
        Query: “{f.state.query}” · {f.applied.length} filters applied
      </p>
    </Stack>
  );
}

const meta = {
  title: 'patterns/Filters',
  component: Filters,
  args: {
    filters: [],
    appliedFilters: [],
    onClearAll: fn(),
    queryPlaceholder: 'Search orders',
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    filters: {
      control: false,
      description: 'Available filters. `filter` is the popover content; `pinned` shows the pill even when not applied.',
      table: { type: { summary: '{ key: string; label: string; filter: ReactNode; pinned?: boolean; disabled?: boolean }[]' } },
    },
    appliedFilters: {
      control: false,
      description: 'Applied filters with a value summary — shown as “Status: Paid, Refunded” with a “Remove Status filter” button.',
      table: { type: { summary: '{ key: string; label: string; onRemove: () => void }[]' } },
    },
    onClearAll: { control: false, description: 'Remove every filter and the query.', table: { type: { summary: '() => void' } } },
    queryValue: { control: 'text', description: 'Free-text query.', table: { type: { summary: 'string' } } },
    onQueryChange: { control: false, description: 'Debounced query change.', table: { type: { summary: '(value: string) => void' } } },
    onQueryClear: { control: false, description: 'Query cleared.', table: { type: { summary: '() => void' } } },
    queryPlaceholder: { control: 'text', description: 'Placeholder of the query field.', table: { type: { summary: 'string' }, defaultValue: { summary: 'Search' } } },
    queryLabel: { control: 'text', description: 'Accessible name of the query field. Defaults to the placeholder.', table: { type: { summary: 'string' } } },
    debounceMs: { control: 'number', description: 'Query debounce, ms.', table: { type: { summary: 'number' }, defaultValue: { summary: '250' } } },
    loading: { control: 'boolean', description: 'Spinner in the query field while results load.', table: { type: { summary: 'boolean' } } },
    hideQueryField: { control: 'boolean', description: 'Filter pills only.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    disabled: { control: 'boolean', description: 'Disable the bar, e.g. offline.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    children: { control: false, description: 'Extra controls beside the query, e.g. sort.', table: { type: { summary: 'ReactNode' } } },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A filter bar: free-text query, one pill per applied (or pinned) filter that opens its editor in a popover, “Add filter”, and “Clear all”.',
          '',
          '**Use** above a ResourceList, DataTable or IndexTable to narrow records. Pills state what is applied (“Payment status: Paid, Refunded”) so the list’s state is always visible, and each has a “Remove … filter” button. The applied-filter summary is announced when it changes.',
          '',
          '**Don’t use** for one yes/no toggle — a Switch or tabs read better — or for navigation between saved views (out of scope here).',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Filters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <Demo {...args} initial={{ status: ['Paid', 'Refunded'], date: 'Last 30 days' }} /> };

/** Nothing applied: the pinned filter shows as a dashed pill; “Add filter” lists the rest. */
export const Empty: Story = { render: (args) => <Demo {...args} /> };

export const WithSortControl: Story = {
  render: (args) => (
    <Demo {...args} initial={{ fulfilment: ['Unfulfilled'] }}>
      <label className="flex items-center gap-2 text-sm text-fg-muted">
        Sort
        <select className="h-control-sm rounded-md border border-border-input bg-surface px-2 text-sm text-fg">
          <option>Newest first</option>
          <option>Total (high–low)</option>
        </select>
      </label>
    </Demo>
  ),
};

export const PillsOnly: Story = { render: (args) => <Demo {...args} hideQueryField initial={{ channel: ['Marketplace'] }} /> };

export const Loading: Story = { render: (args) => <Demo {...args} loading initial={{ query: 'acme', status: ['Overdue'] }} /> };

export const ErrorState: Story = {
  name: 'Error',
  render: (args) => (
    <Stack gap={2}>
      <Demo {...args} initial={{ status: ['Paid'] }} />
      <p role="alert" className="text-sm text-critical-subtle-fg">
        Couldn’t apply filters — the order service timed out. Your filters are kept; try again.
      </p>
    </Stack>
  ),
};

/** Permission: a filter the role can't use is disabled, with the reason. */
export const Permission: Story = {
  render: (args) => (
    <Stack gap={2}>
      <Filters
        {...args}
        filters={[
          { key: 'status', label: 'Payment status', pinned: true, filter: null },
          { key: 'margin', label: 'Margin', pinned: true, disabled: true, filter: null },
        ]}
        appliedFilters={[{ key: 'status', label: 'Paid', onRemove: fn() }]}
      />
      <p className="text-sm text-fg-muted">Margin filtering needs the “View costs” permission.</p>
    </Stack>
  ),
};

export const Offline: Story = {
  render: (args) => (
    <Stack gap={2}>
      <Filters {...args} disabled queryValue="acme" filters={[{ key: 'status', label: 'Payment status', filter: null }]} appliedFilters={[{ key: 'status', label: 'Overdue', onRemove: fn() }]} />
      <p className="flex items-center gap-2 text-sm text-fg-muted">
        <WifiOff aria-hidden className="size-4" /> You’re offline — filters are locked to the data saved at 9:42 AM.
      </p>
    </Stack>
  ),
};

export const Overflow: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <Demo
        {...args}
        initial={{
          query: 'Golden Leaf International Holdings',
          status: ['Paid', 'Pending', 'Refunded', 'Overdue'],
          fulfilment: ['Fulfilled', 'Unfulfilled', 'Partial'],
          date: 'This quarter',
          channel: ['Wholesale portal', 'Point of sale', 'Marketplace'],
        }}
      />
    </div>
  ),
};
