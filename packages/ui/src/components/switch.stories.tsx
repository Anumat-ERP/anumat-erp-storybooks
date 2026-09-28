import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Stack } from './stack';
import { Switch } from './switch';

const meta = {
  title: 'primitives/Switch',
  component: Switch,
  args: { label: 'Show sold-out products', onCheckedChange: fn() },
  argTypes: {
    label: { control: 'text', description: 'What the switch turns on. Without it, pass `aria-label`.', table: { type: { summary: 'ReactNode' } } },
    labelHidden: { control: 'boolean', description: 'Hide the label visually; it remains the accessible name.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    helpText: { control: 'text', description: 'Explanation under the label, linked by `aria-describedby`.', table: { type: { summary: 'ReactNode' } } },
    labelPosition: {
      control: 'inline-radio',
      options: ['end', 'start'],
      description: '`end` puts the label after the switch; `start` puts it first with the switch at the row’s end (settings lists).',
      table: { type: { summary: "'end' | 'start'" }, defaultValue: { summary: 'end' } },
    },
    checked: { control: 'boolean', description: 'On when controlled.', table: { type: { summary: 'boolean' } } },
    defaultChecked: { control: 'boolean', description: 'Initial state when uncontrolled.', table: { type: { summary: 'boolean' } } },
    onCheckedChange: { control: false, description: 'Called with the new state. Apply it right away — there’s no save step.', table: { type: { summary: '(checked: boolean) => void' } } },
    disabled: { control: 'boolean', description: 'Prevents interaction. Say why nearby.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
  },
  decorators: [(Story) => <div className="w-96 max-w-full"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component: [
          'An on/off control that **applies instantly** (Radix Switch, `role="switch"`).',
          '',
          '**Use** for preferences that take effect the moment they’re flipped and are easy to flip back: show archived items, compact tables, email me a copy.',
          '',
          '**Don’t use** inside a form that’s saved later (use a Checkbox), or for a setting that submits a request which can fail or needs confirming — a switch says “it’s done” before the server agrees. Use a SettingToggle (a Button) for those.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const On: Story = { args: { defaultChecked: true } };

export const WithHelpText: Story = {
  args: { defaultChecked: true, helpText: 'Sold-out products appear at the end of the list, greyed out.' },
};

/** Settings list: label first, switch at the end of the row. */
export const LabelStart: Story = {
  render: (args) => (
    <Stack gap={4}>
      <Switch {...args} labelPosition="start" label="Compact tables" helpText="Fit more rows on screen." />
      <Switch {...args} labelPosition="start" label="Show sold-out products" defaultChecked />
    </Stack>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Stack gap={3}>
      <Switch {...args} disabled label="Off, disabled" />
      <Switch {...args} disabled defaultChecked label="On, disabled" />
    </Stack>
  ),
};

/** Error: a switch applies instantly, so if applying fails, flip it back and say why. */
export const ErrorState: Story = {
  name: 'Error',
  render: (args) => (
    <Stack gap={2}>
      <Switch {...args} label="Show prices with tax" aria-describedby="switch-error" />
      <p id="switch-error" role="alert" className="text-sm text-critical-subtle-fg">
        Couldn’t change this. Your connection dropped — try again.
      </p>
    </Stack>
  ),
};

/** Permission: disabled with the reason as help text. */
export const Permission: Story = {
  args: { disabled: true, defaultChecked: true, label: 'Allow guest checkout', helpText: 'Only the store owner can change checkout settings.' },
};

/** Offline: a local-only preference still works offline; this one needs the server, so it says so. */
export const Offline: Story = {
  args: { disabled: true, label: 'Sync inventory across locations', helpText: 'You’re offline. Reconnect to change this.' },
};

export const Overflow: Story = {
  args: {
    labelPosition: 'start',
    label: 'Automatically archive orders once they are fulfilled, paid and older than thirty days',
    helpText: 'Archived orders stay searchable and can be unarchived at any time from the order page.',
  },
};
