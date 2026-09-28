import type { Meta, StoryObj } from '@storybook/react-vite';
import { RangeSlider } from './range-slider';

const meta = {
  title: 'primitives/RangeSlider',
  component: RangeSlider,
  args: { label: 'RangeSlider' },
  parameters: {
    docs: {
      description: {
        component:
          '**First pass** — styled placeholder with the intended API; no slider track, thumbs, dual range or keyboard stepping. Choose a numeric value or range (price, quantity).',
      },
    },
  },
} satisfies Meta<typeof RangeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
