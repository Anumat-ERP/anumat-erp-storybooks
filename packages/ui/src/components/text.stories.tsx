import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './stack';
import { Text } from './text';

const meta = {
  title: 'primitives/Text',
  component: Text,
  args: { children: 'Purchase order PO-2291 was approved by Dana Whitfield.' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['display', 'heading', 'title', 'subtitle', 'body', 'bodySm', 'caption', 'label', 'mono'],
      description: 'Typographic role — sets size and weight, not the element.',
      table: { type: { summary: "'display' | 'heading' | 'title' | 'subtitle' | 'body' | 'bodySm' | 'caption' | 'label' | 'mono'" }, defaultValue: { summary: 'body' } },
    },
    as: {
      control: 'select',
      options: ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'dt', 'dd', 'strong', 'code'],
      description: 'Element to render. Defaults by variant; set it to keep the heading outline correct.',
      table: { type: { summary: 'ElementType' } },
    },
    tone: {
      control: 'select',
      options: ['default', 'muted', 'subtle', 'disabled', 'critical', 'success', 'warning', 'info', 'inherit'],
      description: '`muted` for secondary copy; tones for status text. Never rely on colour alone.',
      table: { type: { summary: "'default' | 'muted' | 'subtle' | 'disabled' | 'critical' | 'success' | 'warning' | 'info' | 'inherit'" }, defaultValue: { summary: 'default' } },
    },
    weight: {
      control: 'inline-radio',
      options: ['regular', 'medium', 'semibold', 'bold'],
      description: 'Override the variant’s weight.',
      table: { type: { summary: "'regular' | 'medium' | 'semibold' | 'bold'" } },
    },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'], description: 'Text alignment (logical).', table: { type: { summary: "'start' | 'center' | 'end'" } } },
    truncate: { control: 'boolean', description: 'Single line with ellipsis.', table: { type: { summary: 'boolean' } } },
    numeric: { control: 'boolean', description: 'Tabular figures so numbers align in columns.', table: { type: { summary: 'boolean' } } },
    visuallyHidden: { control: 'boolean', description: 'Hidden visually, still announced.', table: { type: { summary: 'boolean' } } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Typography on the type scale. **Use** for all product copy. **Don’t use** a heading variant to make text bigger — choose `as` for the outline and `variant` for the look.',
      },
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Stack gap={3}>
      <Text variant="display">Display — Q3 revenue</Text>
      <Text variant="heading">Heading — Orders</Text>
      <Text variant="title">Title — Shipping address</Text>
      <Text variant="subtitle">Subtitle — Line items</Text>
      <Text>Body — The shipment left Warehouse B this morning.</Text>
      <Text variant="bodySm">Body small — Last synced 2 minutes ago</Text>
      <Text variant="caption" tone="muted">Caption — SKU-00421</Text>
      <Text variant="mono">INV-2024-001042</Text>
    </Stack>
  ),
};

export const Tones: Story = {
  render: () => (
    <Stack gap={1}>
      {(['default', 'muted', 'subtle', 'critical', 'success', 'warning', 'info'] as const).map((tone) => (
        <Text key={tone} tone={tone}>{tone} — Payment of $1,240.00</Text>
      ))}
      {/* `disabled` is below text contrast on purpose — WCAG exempts inactive controls. Only use it for those. */}
      <button type="button" disabled className="text-start">
        <Text tone="disabled" as="span">disabled — only inside inactive controls</Text>
      </button>
    </Stack>
  ),
};

export const Overflow: Story = {
  args: {
    truncate: true,
    children: 'Northwind Traders International Distribution Holdings Limited — Southern Hemisphere Division',
  },
  render: (args) => (
    <div className="w-72 rounded-md border border-dashed border-border-strong p-2">
      <Text {...args} title={String(args.children)} />
    </div>
  ),
};

export const Numeric: Story = {
  render: () => (
    <div className="flex w-40 flex-col items-end">
      <Text numeric>$1,111.11</Text>
      <Text numeric>$22,008.90</Text>
      <Text numeric>$314.00</Text>
    </div>
  ),
};
