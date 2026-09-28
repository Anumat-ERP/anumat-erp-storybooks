import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './spinner';
import { Inline } from './stack';

const meta = {
  title: 'primitives/Spinner',
  component: Spinner,
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: '`sm` fits inside a small button; `lg` is for a region-level wait.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    label: {
      control: 'text',
      description: 'Announced text (role="status"). `null` when a parent already announces busy.',
      table: { type: { summary: 'string | null' }, defaultValue: { summary: "'Loading'" } },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Indeterminate activity. **Use** for short waits with no measurable progress. **Don’t use** for page loads (use skeletons so the layout stays still) or when progress is known (use ProgressBar).',
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Inline gap={4}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Inline>
  ),
};

export const Loading: Story = {
  name: 'Loading (in context)',
  render: () => (
    <div className="flex h-32 w-80 items-center justify-center gap-2 rounded-lg border border-border bg-surface text-fg-muted" aria-busy>
      <Spinner label={null} />
      <span role="status">Loading stock levels…</span>
    </div>
  ),
};

export const OnColour: Story = {
  name: 'Inherits colour',
  render: () => (
    <Inline gap={4}>
      <span className="text-primary"><Spinner /></span>
      <span className="rounded-md bg-surface-inverse p-2 text-fg-inverse"><Spinner /></span>
    </Inline>
  ),
};
