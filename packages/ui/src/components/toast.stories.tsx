import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef } from 'react';
import { Button } from './button';
import { Inline } from './stack';
import { ToastProvider, useToast, type ToastOptions } from './toast';

interface PlaygroundArgs extends ToastOptions {
  /** Fire these on mount as well (for visual review). */
  autoFire?: ToastOptions[];
}

function Fire({ title, description, tone, action, duration, autoFire }: PlaygroundArgs) {
  const { toast, dismiss } = useToast();
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current || !autoFire) return;
    fired.current = true;
    autoFire.forEach((t) => toast(t));
  }, [autoFire, toast]);
  return (
    <Inline>
      <Button variant="primary" onClick={() => toast({ title, description, tone, action, duration })}>
        Show toast
      </Button>
      <Button onClick={() => dismiss()}>Dismiss all</Button>
    </Inline>
  );
}

function Playground(args: PlaygroundArgs) {
  return (
    <ToastProvider>
      <Fire {...args} />
    </ToastProvider>
  );
}

const undo = { label: 'Undo', altText: 'Undo from the archived products list', onAction: () => undefined };

const meta = {
  title: 'components/Toast',
  component: Playground,
  args: { title: 'Product archived', tone: 'default', action: undo },
  argTypes: {
    title: {
      control: 'text',
      description: 'One short sentence: “Product archived”.',
      table: { type: { summary: 'ReactNode' } },
    },
    description: {
      control: 'text',
      description: 'Optional second line. Long content belongs in a Banner.',
      table: { type: { summary: 'ReactNode' } },
    },
    tone: {
      control: 'inline-radio',
      options: ['default', 'success', 'critical'],
      description:
        '`default` confirmation · `success` adds a check · `critical` failure, announced assertively (Radix `type="foreground"`). Others are `background` (polite).',
      table: { type: { summary: "'default' | 'critical' | 'success'" }, defaultValue: { summary: 'default' } },
    },
    action: {
      control: 'object',
      description:
        'One follow-up action, usually Undo. `altText` is required: it tells keyboard and screen reader users how to do the same without the toast.',
      table: { type: { summary: '{ label: string; onAction: () => void; altText: string }' } },
    },
    duration: {
      control: 'number',
      description: 'ms before auto-dismiss (default 5000). Paused while hovered or while focus is inside the toast region.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '5000' } },
    },
    autoFire: { control: false, table: { disable: true } },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, iframeHeight: 320 },
      description: {
        component: [
          'Brief, auto-dismissing confirmation of something the user just did. Built on Radix Toast.',
          '',
          'Mount `<ToastProvider>` once near the root; call `const { toast } = useToast()` and `toast({ title, description?, tone?, action?, duration? })`. Toasts stack bottom-centre above everything (`z-(--a-z-index-toast)`); F8 jumps to them.',
          '',
          '**Timer:** Radix pauses the dismiss timer on pointer hover *and* on keyboard focus inside the region (it listens for `pointermove`/`focusin` on the viewport, resuming on `pointerleave`/`focusout`), and when the window loses focus — so an Undo button can’t vanish as someone reaches for it.',
          '',
          '**Politeness:** `critical` toasts are `type="foreground"` (assertive live region); all others `background` (polite).',
          '',
          '**Use** to confirm an action (“Order archived — Undo”). **Don’t use** for errors the user must act on or information they need to keep (use a Banner), for form validation, or for anything that needs a decision (use a Dialog). Never put the only path to an action in a toast.',
        ].join('\n'),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-80 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Playground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  args: {
    duration: Infinity,
    autoFire: [
      { title: 'Draft saved', duration: Infinity },
      { title: 'Order marked as paid', tone: 'success', duration: Infinity },
      {
        title: 'Couldn’t archive product',
        description: 'Check your connection and try again.',
        tone: 'critical',
        duration: Infinity,
      },
    ],
  },
};

/** The timer pauses while the pointer is over the toast or focus is inside it, so Undo stays reachable. */
export const WithUndo: Story = {
  args: {
    title: '3 products archived',
    action: { ...undo, altText: 'Undo from the archived products list' },
    autoFire: [{ title: '3 products archived', action: undo, duration: Infinity }],
  },
};

export const WithDescription: Story = {
  args: {
    title: 'Export started',
    description: 'We’ll email a download link when it’s ready.',
    action: undefined,
    autoFire: [{ title: 'Export started', description: 'We’ll email a download link when it’s ready.', duration: Infinity }],
  },
};

export const ErrorState: Story = {
  name: 'Error',
  args: {
    title: 'Couldn’t save changes',
    description: 'The server didn’t respond.',
    tone: 'critical',
    action: { label: 'Retry', altText: 'Save again with the Save button', onAction: () => undefined },
    autoFire: [
      {
        title: 'Couldn’t save changes',
        description: 'The server didn’t respond.',
        tone: 'critical',
        action: { label: 'Retry', altText: 'Save again with the Save button', onAction: () => undefined },
        duration: Infinity,
      },
    ],
  },
};

export const Offline: Story = {
  args: {
    title: 'You’re offline',
    description: 'Changes will sync when you reconnect.',
    action: undefined,
    autoFire: [{ title: 'You’re offline', description: 'Changes will sync when you reconnect.', duration: Infinity }],
  },
};

export const Overflow: Story = {
  args: {
    title: 'Discount code SUMMER-SALE-2026-EXTENDED-FOR-LOYALTY-MEMBERS-ONLY was applied to 1,284 draft orders',
    description:
      'Customers who already checked out keep their original price. Orders created after this change will use the new discount automatically.',
    autoFire: [
      {
        title: 'Discount code SUMMER-SALE-2026-EXTENDED-FOR-LOYALTY-MEMBERS-ONLY was applied to 1,284 draft orders',
        description:
          'Customers who already checked out keep their original price. Orders created after this change will use the new discount automatically.',
        action: undo,
        duration: Infinity,
      },
    ],
  },
};
