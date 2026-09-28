import type { Meta, StoryObj } from '@storybook/react-vite';
import { Combobox } from './combobox';

const meta = {
  title: 'primitives/Combobox',
  component: Combobox,
  args: { label: 'Combobox' },
  parameters: {
    docs: {
      description: {
        component:
          '**First pass** — styled placeholder with the intended API; no listbox, filtering, or keyboard option navigation. Searchable single/multi select for long option lists (customers, SKUs).',
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
