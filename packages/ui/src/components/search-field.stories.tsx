import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { SearchField, type SearchFieldProps } from './search-field';
import { Stack } from './stack';

const meta = {
  title: 'patterns/SearchField',
  component: SearchField,
  args: { label: 'Search orders', placeholder: 'Search by order number, customer or SKU', onChange: fn(), onClear: fn() },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: 'text', description: 'Accessible name. Required — a placeholder is not a label.', table: { type: { summary: 'string' } } },
    labelHidden: {
      control: 'boolean',
      description: 'Hide the label visually (it is still announced). Fine when the context makes it obvious.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    placeholder: { control: 'text', description: 'Hint of what can be searched.', table: { type: { summary: 'string' }, defaultValue: { summary: 'Search' } } },
    value: { control: 'text', description: 'Query. Follows outside changes (e.g. “Clear all”).', table: { type: { summary: 'string' } } },
    defaultValue: { control: 'text', description: 'Initial query when uncontrolled.', table: { type: { summary: 'string' } } },
    onChange: {
      control: false,
      description: 'Called with the query after typing pauses for `debounceMs`; at once on Enter or clear.',
      table: { type: { summary: '(value: string) => void' } },
    },
    onInput: { control: false, description: 'Every keystroke, before debouncing.', table: { type: { summary: '(value: string) => void' } } },
    onClear: { control: false, description: 'The clear button or Escape emptied the field.', table: { type: { summary: '() => void' } } },
    debounceMs: { control: 'number', description: 'Delay before `onChange`, ms.', table: { type: { summary: 'number' }, defaultValue: { summary: '250' } } },
    loading: { control: 'boolean', description: 'Spinner while results load; the field stays editable.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    searchLandmark: {
      control: 'boolean',
      description: 'Wrap in `role="search"`. Once per page, for the main search.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    shortcut: {
      control: 'boolean',
      description: 'Cmd+K / Ctrl+K focuses the field; shows the hint. One per page.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    size: { control: 'inline-radio', options: ['sm', 'md'], description: 'Height; matches Button.', table: { type: { summary: "'sm' | 'md'" }, defaultValue: { summary: 'md' } } },
    disabled: { control: 'boolean', description: 'Not editable.', table: { type: { summary: 'boolean' } } },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A search input with a leading icon, a clear button (and Escape), a debounced `onChange`, a loading spinner and an optional Cmd/Ctrl+K shortcut.',
          '',
          '**Use** to narrow a list or table by free text, or as a page’s main search (`searchLandmark`).',
          '',
          '**Don’t use** for structured filters (status, dates) — use **Filters**, which puts this field beside filter pills. Don’t use for entering a known value on a form (an SKU field) — use an Input.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = { args: { defaultValue: 'Acme Trading' } };

export const VisibleLabel: Story = { args: { labelHidden: false, label: 'Find a customer', placeholder: 'Name, email or tax ID' } };

export const Small: Story = { args: { size: 'sm' } };

/** Main page search: a `search` landmark with the Cmd/Ctrl+K shortcut. */
export const WithShortcut: Story = { args: { shortcut: true, searchLandmark: true, label: 'Search everything', placeholder: 'Search orders, customers, products' } };

function DebounceDemo(args: SearchFieldProps) {
  const [query, setQuery] = useState('');
  const [calls, setCalls] = useState(0);
  return (
    <Stack gap={2}>
      <SearchField
        {...args}
        debounceMs={400}
        onChange={(v) => {
          setQuery(v);
          setCalls((n) => n + 1);
        }}
      />
      <p className="text-sm text-fg-muted">
        Searched for “{query}” · {calls} requests
      </p>
    </Stack>
  );
}

/** Type quickly: one request after you pause, not one per key. */
export const Debounced: Story = { render: (args) => <DebounceDemo {...args} /> };

export const Loading: Story = { args: { defaultValue: 'INV-2026', loading: true } };

export const ErrorState: Story = {
  name: 'Error',
  render: (args) => (
    <Stack gap={1}>
      <SearchField {...args} defaultValue="acme" aria-describedby="search-error" aria-invalid />
      <p id="search-error" role="alert" className="text-sm text-critical-subtle-fg">
        Search is unavailable right now. Try again in a minute.
      </p>
    </Stack>
  ),
};

export const Permission: Story = {
  render: (args) => (
    <Stack gap={1}>
      <SearchField {...args} disabled aria-describedby="search-perm" label="Search payroll" placeholder="Search payroll" />
      <p id="search-perm" className="text-sm text-fg-muted">
        You don’t have access to payroll records.
      </p>
    </Stack>
  ),
};

export const Offline: Story = {
  render: (args) => (
    <Stack gap={1}>
      <SearchField {...args} aria-describedby="search-offline" />
      <p id="search-offline" className="text-sm text-fg-muted">
        Offline — searching the 500 orders saved on this device.
      </p>
    </Stack>
  ),
};

export const Overflow: Story = {
  args: { defaultValue: 'Golden Leaf International Holdings (Asia-Pacific) Company Limited — Regional Procurement Office', loading: true },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};
