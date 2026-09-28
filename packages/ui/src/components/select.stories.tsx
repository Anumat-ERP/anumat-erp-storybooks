import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './button';
import { Field } from './field';
import { Select, type SelectOptionGroup } from './select';
import { Inline, Stack } from './stack';

const COUNTRIES = [
  { value: 'au', label: 'Australia' },
  { value: 'ca', label: 'Canada' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
  { value: 'th', label: 'Thailand' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
];

const GROUPED: SelectOptionGroup[] = [
  {
    label: 'Apparel',
    options: [
      { value: 'shirts', label: 'Shirts' },
      { value: 'trousers', label: 'Trousers' },
      { value: 'outerwear', label: 'Outerwear', disabled: true },
    ],
  },
  {
    label: 'Home',
    options: [
      { value: 'bed', label: 'Bed linen' },
      { value: 'kitchen', label: 'Kitchen' },
    ],
  },
];

const meta = {
  title: 'primitives/Select',
  component: Select,
  args: { 'aria-label': 'Country', placeholder: 'Select a country', options: COUNTRIES, onChange: fn() },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Control height; matches Input and Button at the same size.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    placeholder: {
      control: 'text',
      description: 'A first, disabled option with an empty value, shown until a choice is made. A `required` select can’t be submitted on it.',
      table: { type: { summary: 'string' } },
    },
    options: {
      control: 'object',
      description: 'Flat options or groups (rendered as `<optgroup>`). Or pass `<option>` children.',
      table: { type: { summary: 'Array<{ value, label, disabled? } | { label, options, disabled? }>' } },
    },
    invalid: {
      control: 'boolean',
      description: 'Critical border and `aria-invalid`. Inside a Field, set `error` on the Field instead.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: { control: 'boolean', description: 'Not changeable, not focusable, not submitted.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    required: { control: 'boolean', description: 'A real option must be chosen before submit.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    value: { control: 'text', description: 'Selected value when controlled.', table: { type: { summary: 'string' } } },
    defaultValue: { control: 'text', description: 'Initial value when uncontrolled.', table: { type: { summary: 'string' } } },
    className: { control: 'text', description: 'Classes for the outer box — size it with this.', table: { type: { summary: 'string' } } },
  },
  decorators: [
    (Story) => (
      <div className="w-72 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: [
          'Pick one value from a list with the browser’s native `<select>`, styled to match Input. Native is deliberate: it works with every keyboard, screen reader and mobile picker, and submits with the form.',
          '',
          '**Use** for one choice from roughly 5–15 known options in a form. For 2–6 options that benefit from being seen at once, use a RadioGroup.',
          '',
          '**Prefer a Combobox** when people need to type to search (products, customers, long lists), when options load asynchronously, when an option needs more than plain text (an image, a price, a description), or for multi-select. **Don’t use** a Select for navigation or actions — use a menu.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InField: Story = {
  args: { 'aria-label': undefined },
  render: (args) => (
    <Field label="Country of origin" helpText="Used for customs forms." required>
      <Select {...args} />
    </Field>
  ),
};

export const Selected: Story = { args: { defaultValue: 'th' } };

export const OptionGroups: Story = {
  args: { 'aria-label': 'Category', placeholder: 'Choose a category', options: GROUPED },
};

/** Sizes line up with Input and Button. */
export const Sizes: Story = {
  decorators: [(Story) => <div className="w-[30rem] max-w-full"><Story /></div>],
  render: (args) => (
    <Stack gap={3}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Inline key={size} wrap={false}>
          <Select {...args} size={size} aria-label={`Country (${size})`} defaultValue="ca" />
          <Button size={size}>Apply</Button>
        </Inline>
      ))}
    </Stack>
  ),
};

/** Children: pass native `<option>`s when you need full control. */
export const WithChildren: Story = {
  args: { options: undefined, placeholder: undefined, 'aria-label': 'Sort by', defaultValue: 'newest' },
  render: (args) => (
    <Select {...args}>
      <option value="newest">Newest first</option>
      <option value="oldest">Oldest first</option>
      <option value="total">Order total</option>
    </Select>
  ),
};

export const ErrorState: Story = {
  name: 'Error',
  args: { 'aria-label': undefined },
  render: (args) => (
    <Field label="Country of origin" required error="Choose the country the product was made in.">
      <Select {...args} />
    </Field>
  ),
};

export const Disabled: Story = {
  args: { 'aria-label': undefined, disabled: true, defaultValue: 'us' },
  render: (args) => (
    <Field label="Store country" helpText="Set when the store was created. Contact support to change it." disabled>
      <Select {...args} />
    </Field>
  ),
};

/** Permission: selects have no read-only mode, so show the locked value disabled with the reason. */
export const Permission: Story = {
  args: { 'aria-label': undefined, disabled: true, defaultValue: 'gb' },
  render: (args) => (
    <Field label="Tax region" helpText="Only store owners can change the tax region.">
      <Select {...args} />
    </Field>
  ),
};

/** Loading: while options load, show a disabled select saying so — or use a Combobox for async data. */
export const Loading: Story = {
  args: { 'aria-label': undefined, disabled: true, options: [], placeholder: 'Loading locations…' },
  render: (args) => (
    <Field label="Fulfil from">
      <Select {...args} aria-busy />
    </Field>
  ),
};

/** Empty: no options to choose from — say why and what to do. */
export const Empty: Story = {
  args: { 'aria-label': undefined, disabled: true, options: [], placeholder: 'No locations' },
  render: (args) => (
    <Field label="Fulfil from" helpText="Add a location in Settings › Locations first.">
      <Select {...args} />
    </Field>
  ),
};

/** Overflow: long values truncate in the box; the full text shows in the native list. */
export const Overflow: Story = {
  args: {
    'aria-label': 'Shipping profile',
    options: [
      { value: 'a', label: 'International express shipping profile for fragile, oversized and temperature-controlled goods' },
      { value: 'b', label: 'Domestic standard' },
    ],
    defaultValue: 'a',
    placeholder: undefined,
  },
};
