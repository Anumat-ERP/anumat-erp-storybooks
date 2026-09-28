import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RadioGroup, RadioGroupItem } from './radio-group';

const SHIPPING = [
  { value: 'standard', label: 'Standard', helpText: '3–5 business days · Free' },
  { value: 'express', label: 'Express', helpText: '1–2 business days · $12.00' },
  { value: 'pickup', label: 'Local pickup', helpText: 'Ready in 2 hours at Downtown store' },
];

const meta = {
  title: 'primitives/RadioGroup',
  component: RadioGroup,
  subcomponents: { RadioGroupItem },
  args: { legend: 'Shipping speed', defaultValue: 'standard', name: 'shipping', onValueChange: fn() },
  argTypes: {
    legend: { control: 'text', description: 'The question the options answer. Renders a `fieldset` + `legend`.', table: { type: { summary: 'ReactNode' } } },
    legendHidden: { control: 'boolean', description: 'Hide the legend visually; it still names the group.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    helpText: { control: 'text', description: 'Guidance for the whole group, under the options.', table: { type: { summary: 'ReactNode' } } },
    error: { control: 'text', description: 'Validation message; marks the group `aria-invalid`.', table: { type: { summary: 'ReactNode' } } },
    invalid: { control: 'boolean', description: 'Invalid without a message.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    required: { control: 'boolean', description: 'Asterisk on the legend; an option must be chosen.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    disabled: { control: 'boolean', description: 'Disables every option.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      description: 'Stack options, or lay them in a wrapping row (for 2–3 short options). Arrow keys follow it.',
      table: { type: { summary: "'vertical' | 'horizontal'" }, defaultValue: { summary: 'vertical' } },
    },
    value: { control: 'text', description: 'Selected value when controlled.', table: { type: { summary: 'string' } } },
    defaultValue: { control: 'text', description: 'Initially selected value when uncontrolled.', table: { type: { summary: 'string' } } },
    onValueChange: { control: false, description: 'Called with the new value.', table: { type: { summary: '(value: string) => void' } } },
    name: { control: 'text', description: 'Form field name.', table: { type: { summary: 'string' } } },
  },
  render: (args) => (
    <RadioGroup {...args}>
      {SHIPPING.map((option) => (
        <RadioGroupItem key={option.value} {...option} />
      ))}
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        component: [
          'Pick exactly one option from a short visible list (Radix RadioGroup), inside a `fieldset` with a `legend`. `RadioGroupItem` takes a `label` and optional `helpText` per option.',
          '',
          '**Use** for 2–6 options where comparing them side by side helps — shipping speed, billing period. Pre-select a sensible default when there is one.',
          '',
          '**Don’t use** for more options (Select), for yes/no (Checkbox or Switch), or when several may be chosen (checkboxes in a group Field). Always give it a legend — the options alone don’t say what the question is.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: { legend: 'Billing period', orientation: 'horizontal', defaultValue: 'monthly', name: 'billing' },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="monthly" label="Monthly" />
      <RadioGroupItem value="yearly" label="Yearly (save 20%)" />
    </RadioGroup>
  ),
};

export const WithHelpText: Story = { args: { helpText: 'Rates are calculated from the package weight.' } };

export const ErrorState: Story = {
  name: 'Error',
  args: { defaultValue: undefined, required: true, error: 'Choose a shipping speed to continue.' },
};

export const Disabled: Story = { args: { disabled: true, helpText: 'Shipping is set by the marketplace for this order.' } };

/** One option unavailable, with the reason in its help text. */
export const DisabledItem: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="standard" label="Standard" helpText="3–5 business days · Free" />
      <RadioGroupItem value="express" label="Express" helpText="1–2 business days · $12.00" />
      <RadioGroupItem value="pickup" label="Local pickup" helpText="Unavailable: no stock at pickup locations." disabled />
    </RadioGroup>
  ),
};

/** Permission: the choice is visible but locked, and says why. */
export const Permission: Story = {
  args: { legend: 'Payout schedule', defaultValue: 'weekly', disabled: true, helpText: 'Only the account owner can change payouts.' },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="daily" label="Daily" />
      <RadioGroupItem value="weekly" label="Weekly" />
      <RadioGroupItem value="monthly" label="Monthly" />
    </RadioGroup>
  ),
};

/** Overflow: long labels wrap; in a horizontal group, options wrap onto new rows. */
export const Overflow: Story = {
  args: {
    legend: 'When a customer orders a product that is out of stock at the location closest to them',
    orientation: 'horizontal',
    defaultValue: 'nearest',
  },
  decorators: [(Story) => <div className="w-96"><Story /></div>],
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="nearest" label="Fulfil from the nearest location that has stock, even if it ships separately" />
      <RadioGroupItem value="wait" label="Hold the order" helpText="Until the closest location is restocked, then ship everything together in one package." />
      <RadioGroupItem value="cancel" label="Cancel" />
    </RadioGroup>
  ),
};
