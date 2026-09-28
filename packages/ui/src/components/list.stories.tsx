import type { Meta, StoryObj } from '@storybook/react-vite';
import { List } from './list';

const meta = {
  title: 'components/List',
  component: List,
  args: { type: 'bullet', spacing: 'loose' },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['bullet', 'number'],
      description:
        '`bullet` → `<ul>`; `number` → `<ol>`. Numbered is announced as ordered; a `ul` with counters looks the same but isn’t.',
      table: { type: { summary: "'bullet' | 'number'" }, defaultValue: { summary: 'bullet' } },
    },
    spacing: {
      control: 'inline-radio',
      options: ['loose', 'tight'],
      description: '`loose` for scannable points; `tight` for short dense lists.',
      table: { type: { summary: "'loose' | 'tight'" }, defaultValue: { summary: 'loose' } },
    },
    start: {
      control: 'number',
      description: 'Numbered lists only: the first number.',
      table: { type: { summary: 'number' } },
    },
    children: { control: false, description: '`List.Item` elements.', table: { type: { summary: 'ReactNode' } } },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A plain text list of points (`type="bullet"`, a `<ul>`) or steps (`type="number"`, a real `<ol>`), with `List.Item`.',
          '',
          '**Use** for short, parallel text in body copy: requirements, steps, what’s included. **Don’t use** for rows of data with actions (resource list or table), navigation, or label/value pairs (DescriptionList).',
        ].join('\n'),
      },
    },
  },
  render: (args) => (
    <List {...args}>
      <List.Item>Free shipping on orders over £50</List.Item>
      <List.Item>30-day returns</List.Item>
      <List.Item>Gift wrapping available at checkout</List.Item>
    </List>
  ),
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Numbered: Story = {
  args: { type: 'number' },
  render: (args) => (
    <List {...args}>
      <List.Item>Connect your domain</List.Item>
      <List.Item>Add a payment provider</List.Item>
      <List.Item>Set up shipping rates</List.Item>
      <List.Item>Publish your store</List.Item>
    </List>
  ),
};

export const Tight: Story = { args: { spacing: 'tight' } };

export const Nested: Story = {
  args: { type: 'number' },
  render: (args) => (
    <List {...args}>
      <List.Item>
        Prepare your file
        <List spacing="tight">
          <List.Item>One product per row</List.Item>
          <List.Item>Prices without currency symbols</List.Item>
        </List>
      </List.Item>
      <List.Item>Upload the CSV</List.Item>
      <List.Item>Review and confirm</List.Item>
    </List>
  ),
};

export const StartAt: Story = {
  args: { type: 'number', start: 4 },
  render: (args) => (
    <List {...args}>
      <List.Item>Choose a theme</List.Item>
      <List.Item>Customise colours</List.Item>
    </List>
  ),
};

export const Overflow: Story = {
  render: (args) => (
    <div className="w-64">
      <List {...args}>
        <List.Item>A long point that wraps onto several lines and stays aligned with its marker</List.Item>
        <List.Item>https://store.example.com/admin/settings/checkout/very-long-path-without-spaces</List.Item>
      </List>
    </div>
  ),
};
