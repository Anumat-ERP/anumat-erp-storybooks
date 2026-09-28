import type { Meta, StoryObj } from '@storybook/react-vite';
import { AtSign } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from './button';
import { Field } from './field';
import { Input } from './input';
import { Inline, Stack } from './stack';

const meta = {
  title: 'primitives/Input',
  component: Input,
  args: { 'aria-label': 'Product title', placeholder: 'e.g. Linen shirt', onChange: fn(), onClear: fn() },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Control height. Matches Button and Select at the same size so rows align.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    type: {
      control: 'select',
      options: ['text', 'search', 'email', 'number', 'tel', 'url', 'password'],
      description: 'Native input type. `search` adds a search icon, is clearable and clears on Escape.',
      table: { type: { summary: "'text' | 'search' | 'email' | 'number' | 'tel' | 'url' | 'password' | …" }, defaultValue: { summary: 'text' } },
    },
    prefix: { control: 'text', description: 'Content before the value inside the box — currency, an icon.', table: { type: { summary: 'ReactNode' } } },
    suffix: { control: 'text', description: 'Content after the value inside the box — a unit.', table: { type: { summary: 'ReactNode' } } },
    clearable: {
      control: 'boolean',
      description: 'Shows a clear button while there is a value. Fires `onChange` with "" then `onClear`, and refocuses the input.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: "true for type='search', else false" } },
    },
    clearLabel: { control: 'text', description: 'Accessible name of the clear button.', table: { type: { summary: 'string' }, defaultValue: { summary: 'Clear' } } },
    onClear: { control: false, description: 'Called after clearing.', table: { type: { summary: '() => void' } } },
    invalid: {
      control: 'boolean',
      description: 'Critical border and `aria-invalid`. Inside a Field, set `error` on the Field instead — it also links the message.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: { control: 'boolean', description: 'Not editable, not focusable, not submitted. Say why nearby.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    readOnly: {
      control: 'boolean',
      description: 'Not editable but focusable, selectable and submitted. Use for values people need to see or copy.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    maxLength: { control: 'number', description: 'Character limit (native).', table: { type: { summary: 'number' } } },
    showCharacterCount: {
      control: 'boolean',
      description: 'With `maxLength`, shows “12/100” inside the box, linked by `aria-describedby`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    placeholder: { control: 'text', description: 'An example value, never the label.', table: { type: { summary: 'string' } } },
    className: { control: 'text', description: 'Classes for the outer box — size it with this.', table: { type: { summary: 'string' } } },
    inputClassName: { control: 'text', description: 'Classes for the `<input>` element.', table: { type: { summary: 'string' } } },
  },
  decorators: [
    (Story) => (
      <div className="w-80 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: [
          'A single-line text field with optional prefix/suffix, a clear button and a character count.',
          '',
          '**Use** for short free text, numbers, emails and search. Put it in a Field for its label, help and error — it picks up the ids from context. Standalone, give it an `aria-label`.',
          '',
          '**Don’t use** for long text (Textarea), a fixed set of options (Select, RadioGroup), or dates. Don’t use the placeholder as the label, and don’t put essential text only in the prefix/suffix — repeat units in the label (“Weight (kg)”) if they matter.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InField: Story = {
  args: { 'aria-label': undefined },
  render: (args) => (
    <Field label="Product title" helpText="Shown on the storefront." required>
      <Input {...args} />
    </Field>
  ),
};

/** Sizes match Button, so an input and a button in a row line up. */
export const Sizes: Story = {
  decorators: [(Story) => <div className="w-[34rem] max-w-full"><Story /></div>],
  render: (args) => (
    <Stack gap={3}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Inline key={size} wrap={false}>
          <Input {...args} size={size} aria-label={`Discount code (${size})`} placeholder={`Size ${size}`} clearable defaultValue="SPRING" />
          <Button size={size}>Apply</Button>
        </Inline>
      ))}
    </Stack>
  ),
};

export const PrefixAndSuffix: Story = {
  render: (args) => (
    <Stack gap={4}>
      <Field label="Price">
        <Input {...args} aria-label={undefined} prefix="$" suffix="USD" inputMode="decimal" defaultValue="24.00" placeholder="0.00" />
      </Field>
      <Field label="Weight">
        <Input {...args} aria-label={undefined} suffix="kg" inputMode="decimal" defaultValue="0.4" placeholder="0.0" />
      </Field>
      <Field label="Contact email">
        <Input {...args} aria-label={undefined} type="email" prefix={<AtSign aria-hidden />} placeholder="orders@example.com" />
      </Field>
    </Stack>
  ),
};

/** Clearable: the × appears once there’s a value; it clears, refocuses and fires `onChange`. */
export const Clearable: Story = {
  args: { clearable: true, defaultValue: 'Linen shirt' },
};

/** Controlled: clearing goes through `onChange`, so controlled inputs need no extra wiring. */
export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [value, setValue] = useState('Summer sale');
    return (
      <Stack gap={2}>
        <Input {...args} clearable value={value} onChange={(e) => setValue(e.target.value)} />
        <p className="text-sm text-fg-muted">Value: “{value}”</p>
      </Stack>
    );
  },
};

/** Search: search icon, clear button, and Escape clears. */
export const SearchVariant: Story = {
  name: 'Search',
  args: { type: 'search', 'aria-label': 'Search orders', placeholder: 'Search orders', defaultValue: '#1042' },
};

export const CharacterCount: Story = {
  args: { maxLength: 70, showCharacterCount: true, defaultValue: 'Linen shirt — relaxed fit' },
  render: (args) => (
    <Field label="SEO title" helpText="Search engines show about 70 characters.">
      <Input {...args} aria-label={undefined} />
    </Field>
  ),
};

/** Error: set `error` on the Field — the input gets `aria-invalid` and the message is linked. */
export const ErrorState: Story = {
  name: 'Error',
  args: { defaultValue: '-4', prefix: '$' },
  render: (args) => (
    <Field label="Price" required error="Enter a price of 0.01 or more.">
      <Input {...args} aria-label={undefined} />
    </Field>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'LINEN-SHIRT-01' },
  render: (args) => (
    <Field label="SKU" helpText="Turn on inventory tracking to edit the SKU." disabled>
      <Input {...args} aria-label={undefined} />
    </Field>
  ),
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 'gid://shop/Product/7781234', clearable: true },
  render: (args) => (
    <Field label="Product ID" helpText="Use this ID when contacting support.">
      <Input {...args} aria-label={undefined} />
    </Field>
  ),
};

/** Permission: visible and copyable, but locked, with the reason. */
export const Permission: Story = {
  args: { readOnly: true, defaultValue: '12.40', prefix: '$' },
  render: (args) => (
    <Field label="Cost per item" helpText="Only staff with the “View costs” permission can edit costs.">
      <Input {...args} aria-label={undefined} />
    </Field>
  ),
};

/** Offline: editing still works locally; the reason saving is paused sits in the help text. */
export const Offline: Story = {
  args: { defaultValue: 'Linen shirt' },
  render: (args) => (
    <Field label="Product title" helpText="You’re offline. Changes will save when you reconnect.">
      <Input {...args} aria-label={undefined} />
    </Field>
  ),
};

/** Overflow: long values scroll inside the box; prefix, suffix and clear button keep their place. */
export const Overflow: Story = {
  args: {
    clearable: true,
    prefix: '$',
    suffix: 'USD per unit, excluding tax',
    defaultValue: '1234567890123456789012345678901234567890.00',
  },
  render: (args) => (
    <Field label="Wholesale price per unit for orders over one thousand units, before discounts and regional taxes">
      <Input {...args} aria-label={undefined} />
    </Field>
  ),
};
