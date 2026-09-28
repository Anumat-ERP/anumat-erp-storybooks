import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Banner } from './banner';
import { Card, CardHeader } from './card';
import { Stack } from './stack';

const meta = {
  title: 'components/Banner',
  component: Banner,
  args: {
    tone: 'info',
    title: 'Shipping rates have changed',
    children: 'New carrier rates apply to orders placed from 1 October. Review your shipping profiles.',
    action: { label: 'Review rates', onAction: fn() },
    onDismiss: fn(),
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'critical'],
      description:
        'Meaning and politeness. `critical` → `role="alert"` (interrupts). Others → `role="status"` (waits for a pause).',
      table: { type: { summary: "'info' | 'success' | 'warning' | 'critical'" }, defaultValue: { summary: 'info' } },
    },
    title: {
      control: 'text',
      description: 'One-line summary: what happened, not “Error”.',
      table: { type: { summary: 'ReactNode' } },
    },
    children: { control: 'text', description: 'Detail and what to do next.', table: { type: { summary: 'ReactNode' } } },
    action: {
      control: 'object',
      description: 'The main way to resolve it (secondary button).',
      table: { type: { summary: '{ label: string; onAction?: () => void; href?: string }' } },
    },
    secondaryAction: {
      control: 'object',
      description: 'A lesser alternative (plain button).',
      table: { type: { summary: '{ label: string; onAction?: () => void; href?: string }' } },
    },
    onDismiss: {
      control: false,
      description: 'Shows a close button. Don’t let critical banners be dismissed while the problem remains.',
      table: { type: { summary: '() => void' } },
    },
    inline: {
      control: 'boolean',
      description: 'Compact variant for inside a card or form section.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    icon: {
      control: false,
      description: 'Override the per-tone icon, or `null` to hide it.',
      table: { type: { summary: 'ReactNode | null' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A persistent message about the state of a page or section.',
          '',
          '**Use** for information that stays relevant until acted on: a failed payout, an expiring plan, a completed setup step. Use `inline` inside a card.',
          '',
          '**Don’t use** for confirmations of what the user just did (toast), field validation (on the field), or several at once on one page.',
          '',
          '**Politeness:** `critical` uses `role="alert"` (assertive); every other tone uses `role="status"` (polite). Reversed, info banners talk over people and failures go unheard.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <Stack gap={3}>
      <Banner {...args} tone="info" title="Shipping rates have changed" />
      <Banner {...args} tone="success" title="Your store is live" action={undefined}>
        Customers can now find and buy from your store.
      </Banner>
      <Banner {...args} tone="warning" title="Your plan renews in 3 days" action={{ label: 'Update billing' }}>
        The card on file expires before the renewal date.
      </Banner>
      <Banner
        {...args}
        tone="critical"
        title="Payouts are paused"
        onDismiss={undefined}
        action={{ label: 'Verify identity' }}
        secondaryAction={{ label: 'Learn why', href: '#payouts' }}
      >
        We couldn’t verify your bank account. Payouts resume once it’s verified.
      </Banner>
    </Stack>
  ),
};

export const TitleOnly: Story = { args: { children: undefined, action: undefined } };

export const Inline: Story = {
  args: { inline: true, tone: 'warning', title: undefined, action: undefined, onDismiss: undefined },
  render: (args) => (
    <Card className="flex max-w-lg flex-col gap-4">
      <CardHeader title="Inventory" />
      <Banner {...args}>3 variants are below their reorder point.</Banner>
      <p className="text-md text-fg-muted">Track stock at each location.</p>
    </Card>
  ),
};

export const Loading: Story = {
  args: { tone: 'info', title: 'Importing 1,284 products…', action: undefined, onDismiss: undefined },
  render: (args) => <Banner {...args}>This can take a few minutes. You can leave this page.</Banner>,
};

export const ErrorState: Story = {
  name: 'Error',
  args: {
    tone: 'critical',
    title: 'The import failed',
    children: '12 rows have an invalid SKU. Fix them and upload the file again.',
    action: { label: 'Download error report' },
    secondaryAction: { label: 'Upload again' },
    onDismiss: undefined,
  },
};

export const Permission: Story = {
  args: {
    tone: 'warning',
    title: 'You can’t edit payment settings',
    children: 'Only the store owner can change how you get paid.',
    action: { label: 'Request access' },
    onDismiss: undefined,
  },
};

export const Offline: Story = {
  args: {
    tone: 'warning',
    title: 'You’re offline',
    children: 'Changes are saved on this device and sync when you reconnect.',
    action: undefined,
    onDismiss: undefined,
  },
};

export const Overflow: Story = {
  args: {
    tone: 'info',
    title: 'A very long banner title that keeps going to show how the heading wraps across several lines in a narrow column',
    children:
      'Long content wraps inside the banner, and unbroken strings like https://example.com/admin/settings/shipping/profiles/very-long-identifier-0123456789 wrap too.',
    secondaryAction: { label: 'Read the full shipping policy update' },
  },
  render: (args) => (
    <div className="w-80">
      <Banner {...args} />
    </div>
  ),
};
