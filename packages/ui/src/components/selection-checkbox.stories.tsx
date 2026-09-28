import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { SelectionCheckbox, type SelectionCheckboxProps } from './selection-checkbox';
import { Inline, Stack } from './stack';

const meta = {
  title: 'components/SelectionCheckbox',
  component: SelectionCheckbox,
  args: { checked: false, label: 'Select order #10240', onCheckedChange: fn() },
  argTypes: {
    checked: {
      control: 'inline-radio',
      options: [false, true, 'indeterminate'],
      description: '`indeterminate` when some — not all — rows on the page are selected.',
      table: { type: { summary: "boolean | 'indeterminate'" } },
    },
    onCheckedChange: { control: false, description: 'Called with the next state.', table: { type: { summary: '(checked: boolean) => void' } } },
    label: {
      control: 'text',
      description: 'Accessible name, specific to the row (“Select order #10240”).',
      table: { type: { summary: 'string' } },
    },
    disabled: { control: 'boolean', description: 'Can’t be selected.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'The row-selection checkbox used inside ResourceList, DataTable and IndexTable. Internal building block.',
          '',
          '**Use** only for selecting rows. It stops click, keydown and pointerdown from reaching the row, so selecting never opens the record, and its hit area is larger than the 16px box.',
          '',
          '**Don’t use** in forms — use `Checkbox`, which has a visible label and helper text.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof SelectionCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled(args: SelectionCheckboxProps) {
  const [checked, setChecked] = useState(args.checked);
  return <SelectionCheckbox {...args} checked={checked} onCheckedChange={setChecked} />;
}

export const Default: Story = { render: (args) => <Controlled {...args} /> };

export const States: Story = {
  render: () => (
    <Inline gap={4}>
      <SelectionCheckbox checked={false} label="Unselected" onCheckedChange={fn()} />
      <SelectionCheckbox checked label="Selected" onCheckedChange={fn()} />
      <SelectionCheckbox checked="indeterminate" label="Some selected" onCheckedChange={fn()} />
      <SelectionCheckbox checked={false} disabled label="Can’t be selected" onCheckedChange={fn()} />
    </Inline>
  ),
};

/** Clicking the checkbox selects without triggering the row's own click. */
export const InsideAClickableRow: Story = {
  render: () => {
    return <RowDemo />;
  },
};

function RowDemo() {
  const [checked, setChecked] = useState(false);
  const [opened, setOpened] = useState(0);
  return (
    <Stack gap={2}>
      <div className="relative flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2 hover:bg-surface-hover">
        <span className="relative z-1 flex">
          <SelectionCheckbox checked={checked} onCheckedChange={setChecked} label="Select order #10240" />
        </span>
        <button type="button" className="text-md font-semibold text-fg after:absolute after:inset-0" onClick={() => setOpened((n) => n + 1)}>
          Order #10240
        </button>
      </div>
      <p className="text-sm text-fg-muted" role="status">
        Row opened {opened} times · {checked ? 'selected' : 'not selected'}
      </p>
    </Stack>
  );
}

/** Permission: disabled with the reason beside it. */
export const Permission: Story = {
  render: () => (
    <Inline gap={2}>
      <SelectionCheckbox checked={false} disabled label="Select order #10240" onCheckedChange={fn()} aria-describedby="sc-perm" />
      <span id="sc-perm" className="text-sm text-fg-muted">
        Locked — this order is in a closed accounting period.
      </span>
    </Inline>
  ),
};
