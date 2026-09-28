import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, ChevronDown, Lock, WifiOff } from 'lucide-react';
import type { ReactNode } from 'react';
import { fn } from 'storybook/test';
import { Button } from './button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

function Example({ label = 'Advanced settings', children, disabled }: { label?: string; children: ReactNode; disabled?: boolean }) {
  return (
    <div className="flex max-w-md flex-col items-start gap-2">
      <CollapsibleTrigger asChild disabled={disabled}>
        <Button
          variant="tertiary"
          className="group -ms-2"
          trailingIcon={
            <ChevronDown
              aria-hidden
              className="transition-transform duration-(--a-duration-base) ease-standard group-data-[state=open]:rotate-180"
            />
          }
        >
          {label}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="w-full">
        <div className="rounded-lg border border-border bg-surface p-4 text-md text-fg">{children}</div>
      </CollapsibleContent>
    </div>
  );
}

const settings = (
  <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
    <dt className="text-fg-muted">Webhook API version</dt>
    <dd>2026-07</dd>
    <dt className="text-fg-muted">Order ID prefix</dt>
    <dd>#</dd>
    <dt className="text-fg-muted">Checkout timeout</dt>
    <dd>30 minutes</dd>
  </dl>
);

const meta = {
  title: 'components/Collapsible',
  component: Collapsible,
  args: { defaultOpen: true, onOpenChange: fn() },
  argTypes: {
    open: { control: 'boolean', description: 'Controlled open state. Pair with `onOpenChange`.', table: { type: { summary: 'boolean' } } },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onOpenChange: { control: false, description: 'Called when the region opens or closes.', table: { type: { summary: '(open: boolean) => void' } } },
    disabled: {
      control: 'boolean',
      description: 'Prevents toggling.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
  },
  render: (args) => (
    <Collapsible {...args}>
      <Example>{settings}</Example>
    </Collapsible>
  ),
  parameters: {
    docs: {
      description: {
        component: [
          'Shows and hides one region, animating its height. Built on Radix Collapsible: the trigger carries `aria-expanded` and `aria-controls`; parts are `Collapsible`, `CollapsibleTrigger` (use `asChild` with a Button) and `CollapsibleContent`. Rotate a chevron with `group-data-[state=open]:rotate-180`.',
          '',
          '**Use** for optional detail most merchants skip: advanced settings, a raw event payload, “Show 12 more line items”.',
          '',
          '**Don’t use** to hide what merchants need to finish the task, or for a set of related sections (use Accordion).',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Closed: Story = { args: { defaultOpen: false } };

export const Loading: Story = {
  render: (args) => (
    <Collapsible {...args}>
      <Example label="Event payload">
        <div role="status" aria-busy="true" aria-label="Loading payload" className="flex flex-col gap-2">
          {[80, 60, 72].map((w) => (
            <div key={w} className="h-3 animate-pulse rounded-sm bg-skeleton" style={{ width: `${w}%` }} />
          ))}
        </div>
      </Example>
    </Collapsible>
  ),
};

export const ErrorState: Story = {
  name: 'Error',
  render: (args) => (
    <Collapsible {...args}>
      <Example label="Event payload">
        <p role="alert" className="flex items-start gap-2 text-critical-subtle-fg">
          <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
          The payload couldn’t be loaded.
        </p>
      </Example>
    </Collapsible>
  ),
};

/** Permission: the trigger is disabled and the reason is next to it. */
export const Permission: Story = {
  args: { defaultOpen: false, disabled: true },
  render: (args) => (
    <Collapsible {...args}>
      <Example disabled>{settings}</Example>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-fg-muted">
        <Lock aria-hidden className="size-3.5" /> Only store owners can change advanced settings.
      </p>
    </Collapsible>
  ),
};

export const Offline: Story = {
  render: (args) => (
    <Collapsible {...args}>
      <Example>
        <p className="mb-3 flex items-start gap-2 text-sm text-fg-muted">
          <WifiOff aria-hidden className="mt-0.5 size-4 shrink-0" /> You’re offline. Showing values saved at 10:42.
        </p>
        {settings}
      </Example>
    </Collapsible>
  ),
};

export const Empty: Story = {
  render: (args) => (
    <Collapsible {...args}>
      <Example label="Metafields">
        <p className="text-fg-muted">No metafields on this product.</p>
      </Example>
    </Collapsible>
  ),
};

/** Overflow: long content grows the region; the page scrolls, not the region. */
export const Overflow: Story = {
  render: (args) => (
    <Collapsible {...args}>
      <Example label="Show 12 more line items">
        <ul className="flex flex-col divide-y divide-border">
          {Array.from({ length: 12 }, (_, i) => (
            <li key={i} className="flex justify-between gap-4 py-1.5">
              <span className="truncate">Hand-thrown stoneware mug, speckled glaze, batch {i + 1}</span>
              <span className="tabular-nums text-fg-muted">× {i + 1}</span>
            </li>
          ))}
        </ul>
      </Example>
    </Collapsible>
  ),
};
