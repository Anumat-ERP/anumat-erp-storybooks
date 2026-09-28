import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './progress-bar';
import { Stack } from './stack';

const meta = {
  title: 'components/ProgressBar',
  component: ProgressBar,
  args: { label: 'Uploading product images', value: 45, max: 100, showValue: true, tone: 'primary', size: 'md' },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress, 0 to `max`. Omit for indeterminate (no `value` attribute).',
      table: { type: { summary: 'number | null' } },
    },
    max: {
      control: 'number',
      description: 'The value that means done.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '100' } },
    },
    tone: {
      control: 'inline-radio',
      options: ['primary', 'success', 'critical'],
      description: '`primary` working · `success` complete · `critical` failed or over a limit.',
      table: { type: { summary: "'primary' | 'success' | 'critical'" }, defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Track thickness: 4 / 8 / 12px.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    label: {
      control: 'text',
      description: 'What is progressing. Required — it is the accessible name, even when hidden.',
      table: { type: { summary: 'ReactNode' } },
    },
    labelHidden: {
      control: 'boolean',
      description: 'Hide the label visually (still announced).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    showValue: {
      control: 'boolean',
      description: 'Show the percentage, or pass a string (“12 of 40 files”). Visual only; AT reads the element’s value.',
      table: { type: { summary: 'boolean | string' }, defaultValue: { summary: 'false' } },
    },
    wrapperClassName: { control: false, description: 'Classes for the outer wrapper.', table: { type: { summary: 'string' } } },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'How far along a measurable task is: an upload, an import, a setup checklist, usage against a plan limit.',
          '',
          'It is a real `<progress>` element, so the value reaches assistive technology with no ARIA, styled via `::-webkit-progress-bar`/`::-webkit-progress-value` and `::-moz-progress-bar`. Indeterminate mode omits `value`, so AT reports it as busy rather than a fake percentage.',
          '',
          '**Use** when you can measure progress. **Don’t use** for short waits (Spinner), for page loads (Skeleton), or as a decorative score or rating meter.',
        ].join('\n'),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <Stack gap={5}>
      <ProgressBar {...args} tone="primary" label="Importing customers" value={30} />
      <ProgressBar {...args} tone="success" label="Setup complete" value={100} />
      <ProgressBar {...args} tone="critical" label="Storage used" value={96} showValue="9.6 of 10 GB" />
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap={5}>
      <ProgressBar {...args} size="sm" label="Small" />
      <ProgressBar {...args} size="md" label="Medium" />
      <ProgressBar {...args} size="lg" label="Large" />
    </Stack>
  ),
};

export const HiddenLabel: Story = { args: { labelHidden: true } };

/** Empty: nothing done yet — 0 of max, not indeterminate. */
export const Empty: Story = { args: { value: 0, label: 'Setup checklist', showValue: '0 of 5 tasks' } };

/** Loading: indeterminate while the total isn't known yet. */
export const Loading: Story = { args: { value: undefined, label: 'Preparing export' } };

export const ErrorState: Story = {
  name: 'Error',
  render: (args) => (
    <Stack gap={2}>
      <ProgressBar {...args} tone="critical" value={62} label="Upload failed at 62%" />
      <p role="alert" className="text-sm text-critical-subtle-fg">
        The connection dropped. Retry to resume from where it stopped.
      </p>
    </Stack>
  ),
};

export const Offline: Story = {
  render: (args) => (
    <Stack gap={2}>
      <ProgressBar {...args} value={45} label="Upload paused" />
      <p className="text-sm text-fg-muted">You’re offline. The upload resumes when you reconnect.</p>
    </Stack>
  ),
};

export const Overflow: Story = {
  args: {
    label: 'Syncing inventory levels across all 14 warehouse locations including the new Northern Distribution Centre',
    showValue: '1,204 of 12,480 variants',
    value: 10,
  },
  render: (args) => (
    <div className="w-64">
      <ProgressBar {...args} />
    </div>
  ),
};
