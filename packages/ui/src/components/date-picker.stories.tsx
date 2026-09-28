import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from './date-picker';

const meta = {
  title: 'primitives/DatePicker',
  component: DatePicker,
  args: { label: 'DatePicker' },
  parameters: {
    docs: {
      description: {
        component:
          '**First pass** — styled placeholder with the intended API; no calendar popover, range selection, or locale formatting — the input is plain text. Pick a date or range (invoice due dates, report periods).',
      },
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
