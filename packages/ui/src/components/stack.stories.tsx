import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inline, Stack } from './stack';

const Box = ({ label }: { label: string }) => (
  <div className="rounded-md border border-primary-border bg-primary-subtle px-3 py-2 text-sm text-primary-subtle-fg">{label}</div>
);

const meta = {
  title: 'primitives/Stack',
  component: Stack,
  args: { gap: 4, direction: 'column' },
  argTypes: {
    direction: { control: 'inline-radio', options: ['column', 'row'], description: 'Main axis.', table: { type: { summary: "'column' | 'row'" }, defaultValue: { summary: 'column' } } },
    gap: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12],
      description: 'Space between children on the 4px grid (`4` = 16px).',
      table: { type: { summary: '0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12' }, defaultValue: { summary: '4' } },
    },
    align: { control: 'select', options: ['start', 'center', 'end', 'baseline', 'stretch'], description: 'Cross-axis alignment.', table: { type: { summary: "'start' | 'center' | 'end' | 'baseline' | 'stretch'" } } },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between'], description: 'Main-axis distribution.', table: { type: { summary: "'start' | 'center' | 'end' | 'between'" } } },
    wrap: { control: 'boolean', description: 'Allow wrapping onto new lines.', table: { type: { summary: 'boolean' } } },
    as: { control: false, description: 'Element — use `ul`/`ol` for lists.', table: { type: { summary: 'ElementType' } } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'One-dimensional layout with consistent gaps. `Inline` is a wrapping row. **Use** for nearly all in-page layout. **Don’t** space children with margins, and don’t use it for two-dimensional grids — use CSS grid utilities.',
      },
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <Box label="Customer" />
      <Box label="Shipping" />
      <Box label="Payment" />
    </Stack>
  ),
};

export const InlineRow: Story = {
  name: 'Inline',
  render: () => (
    <Inline>
      {['Paid', 'Fulfilled', 'Archived', 'Wholesale', 'VIP', 'Net 30'].map((l) => (
        <Box key={l} label={l} />
      ))}
    </Inline>
  ),
};

export const Overflow: Story = {
  render: () => (
    <div className="w-72 rounded-md border border-dashed border-border-strong p-2">
      <Inline>
        {['Paid', 'Partially fulfilled', 'Archived', 'Wholesale', 'Priority shipping', 'Net 30'].map((l) => (
          <Box key={l} label={l} />
        ))}
      </Inline>
    </div>
  ),
};
