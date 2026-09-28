import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Checkbox } from './checkbox';
import { Field } from './field';
import { Stack } from './stack';

const meta = {
  title: 'primitives/Checkbox',
  component: Checkbox,
  args: { label: 'Charge tax on this product', onCheckedChange: fn() },
  argTypes: {
    label: { control: 'text', description: 'The option’s name, beside the box. Clicking it toggles the box.', table: { type: { summary: 'ReactNode' } } },
    labelHidden: { control: 'boolean', description: 'Hide the label visually; it remains the accessible name.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    helpText: { control: 'text', description: 'Explanation under the label, linked by `aria-describedby`.', table: { type: { summary: 'ReactNode' } } },
    checked: {
      control: 'inline-radio',
      options: [true, false, 'indeterminate'],
      description: 'Controlled state. `indeterminate` (“mixed”) means some of a group is selected.',
      table: { type: { summary: "boolean | 'indeterminate'" } },
    },
    defaultChecked: { control: 'boolean', description: 'Initial state when uncontrolled.', table: { type: { summary: "boolean | 'indeterminate'" } } },
    onCheckedChange: { control: false, description: 'Called with the new state.', table: { type: { summary: "(checked: boolean | 'indeterminate') => void" } } },
    invalid: { control: 'boolean', description: 'Critical border and `aria-invalid`. Pair with a message (Field `error`).', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    disabled: { control: 'boolean', description: 'Prevents interaction and mutes the label.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    required: { control: 'boolean', description: 'Must be checked to submit the form.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    name: { control: 'text', description: 'Form field name.', table: { type: { summary: 'string' } } },
    value: { control: 'text', description: 'Submitted value when checked.', table: { type: { summary: 'string' }, defaultValue: { summary: 'on' } } },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A box for an independent on/off choice, or for picking several options from a set (Radix Checkbox), with an indeterminate state.',
          '',
          '**Use** for choices saved with a form, and for multi-select. Put a set of related checkboxes in `<Field group label="…">` for a legend.',
          '',
          '**Don’t use** when the change applies instantly (Switch), when only one option may be chosen (RadioGroup), or for a setting saved by its own request (SettingToggle). Label the option positively (“Charge tax”, not “Don’t charge tax”).',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const WithHelpText: Story = {
  args: { defaultChecked: true, helpText: 'Tax is calculated at checkout from the customer’s address.' },
};

/** Indeterminate: the parent of a partly selected group. Checking it selects all. */
export const Indeterminate: Story = {
  args: { label: 'All locations' },
  render: function IndeterminateStory(args) {
    const [locations, setLocations] = useState({ warehouse: true, downtown: false, airport: true });
    const values = Object.values(locations);
    const all = values.every(Boolean) ? true : values.some(Boolean) ? 'indeterminate' : false;
    const setAll = (checked: boolean) => setLocations({ warehouse: checked, downtown: checked, airport: checked });
    return (
      <Stack gap={2}>
        <Checkbox {...args} checked={all} onCheckedChange={(c) => setAll(c === true)} />
        <Stack gap={2} className="ps-6">
          {(Object.keys(locations) as Array<keyof typeof locations>).map((key) => (
            <Checkbox
              key={key}
              label={{ warehouse: 'Main warehouse', downtown: 'Downtown store', airport: 'Airport kiosk' }[key]}
              checked={locations[key]}
              onCheckedChange={(c) => setLocations((prev) => ({ ...prev, [key]: c === true }))}
            />
          ))}
        </Stack>
      </Stack>
    );
  },
};

/** Group: several checkboxes share a legend and help text through a group Field. */
export const Group: Story = {
  render: () => (
    <Field group label="Sales channels" helpText="Where this product is available.">
      <Stack gap={2}>
        <Checkbox label="Online store" defaultChecked />
        <Checkbox label="Point of sale" helpText="All 3 retail locations." />
        <Checkbox label="Wholesale" />
      </Stack>
    </Field>
  ),
};

export const ErrorState: Story = {
  name: 'Error',
  args: { label: 'I confirm this product meets the listing policy', required: true },
  render: (args) => (
    <Field group label="Listing policy" labelHidden error="Confirm the product meets the listing policy to publish it.">
      <Checkbox {...args} />
    </Field>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Stack gap={2}>
      <Checkbox {...args} disabled label="Track quantity (unchecked)" />
      <Checkbox {...args} disabled defaultChecked label="Track quantity (checked)" />
      <Checkbox {...args} disabled checked="indeterminate" label="All locations (indeterminate)" />
    </Stack>
  ),
};

/** Permission: disabled with the reason as help text. */
export const Permission: Story = {
  args: { disabled: true, defaultChecked: true, label: 'Allow staff to issue refunds', helpText: 'Only the store owner can change staff permissions.' },
};

/** Overflow: long labels wrap and the box stays aligned with the first line. */
export const Overflow: Story = {
  args: {
    label:
      'Continue selling when out of stock, allowing customers to purchase this product even when inventory reaches zero or below at every location',
    helpText:
      'Orders placed while out of stock will be fulfilled when inventory is received. Customers see the expected delivery date at checkout.',
  },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};

/** Without a visible label (e.g. in a table row), pass `aria-label` or `labelHidden`. */
export const WithoutLabel: Story = { args: { label: undefined, 'aria-label': 'Select order #1042' } };
