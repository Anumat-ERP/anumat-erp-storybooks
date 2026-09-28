import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';
import { Card } from './card';
import { Divider } from './divider';
import { Stack } from './stack';

const meta = {
  title: 'primitives/Divider',
  component: Divider,
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: '`horizontal` spans the width; `vertical` spans a row’s height (the row needs a height or `items-stretch`).',
      table: { type: { summary: "'horizontal' | 'vertical'" }, defaultValue: { summary: 'horizontal' } },
    },
    label: { control: 'text', description: 'Short text in the middle of a horizontal divider (“or”). Read as text; the lines are decorative.', table: { type: { summary: 'ReactNode' } } },
    tone: {
      control: 'inline-radio',
      options: ['default', 'strong'],
      description: '`strong` where the surface behind is busy.',
      table: { type: { summary: "'default' | 'strong'" }, defaultValue: { summary: 'default' } },
    },
    decorative: {
      control: 'boolean',
      description: 'Hidden from assistive technology (default). Set `false` to announce it as a separator when it marks a real boundary.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
  },
  decorators: [(Story) => <div className="w-96 max-w-full"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component: [
          'A thin line separating groups of content (Radix Separator), horizontal or vertical, optionally with a label.',
          '',
          '**Use** between groups inside one card or menu, or between items in a toolbar (`vertical`).',
          '',
          '**Don’t use** between cards (their borders separate them), or instead of headings and spacing — most groups need only a gap.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card>
      <Stack gap={3}>
        <p className="text-md text-fg">Subtotal · $120.00</p>
        <Divider {...args} />
        <p className="text-md font-semibold text-fg">Total · $132.00</p>
      </Stack>
    </Card>
  ),
};

export const WithLabel: Story = {
  args: { label: 'or' },
  render: (args) => (
    <Stack gap={3}>
      <Button variant="primary" fullWidth>
        Continue with email
      </Button>
      <Divider {...args} />
      <Button fullWidth>Continue with a passkey</Button>
    </Stack>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className="flex h-6 items-center gap-3 text-sm text-fg-muted">
      <span>Order #1042</span>
      <Divider {...args} />
      <span>Paid</span>
      <Divider {...args} />
      <span>3 items</span>
    </div>
  ),
};

export const Strong: Story = { args: { tone: 'strong' } };

/** Overflow: a long label wraps and the lines keep a minimum length. */
export const Overflow: Story = {
  args: { label: 'Earlier this month, including orders imported from the previous platform' },
};
