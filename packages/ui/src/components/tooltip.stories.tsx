import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy, Pencil, Printer, Trash2 } from 'lucide-react';
import { Button, IconButton } from './button';
import { KbdShortcut } from './kbd';
import { Inline } from './stack';
import { Tooltip, TooltipProvider } from './tooltip';

const meta = {
  title: 'primitives/Tooltip',
  component: Tooltip,
  subcomponents: { TooltipProvider },
  args: {
    content: 'Duplicate order',
    defaultOpen: true,
    children: <IconButton icon={<Copy />} label="Duplicate order" variant="secondary" />,
  },
  argTypes: {
    content: { control: 'text', description: 'Short plain-text hint. Nothing essential, nothing interactive.', table: { type: { summary: 'ReactNode' } } },
    children: { control: false, description: 'One focusable trigger element. Wrap a disabled button in `<span tabIndex={0}>`.', table: { type: { summary: 'ReactElement' } } },
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Preferred side; flips when there’s no room.',
      table: { type: { summary: "'top' | 'right' | 'bottom' | 'left'" }, defaultValue: { summary: 'top' } },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description: 'Alignment against the trigger.',
      table: { type: { summary: "'start' | 'center' | 'end'" }, defaultValue: { summary: 'center' } },
    },
    open: { control: 'boolean', description: 'Open state when controlled.', table: { type: { summary: 'boolean' } } },
    defaultOpen: { control: 'boolean', description: 'Initial open state (docs and tests).', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    delayDuration: { control: 'number', description: 'Hover delay in ms; overrides the provider.', table: { type: { summary: 'number' }, defaultValue: { summary: '400' } } },
    onOpenChange: { control: false, description: 'Called when it opens or closes.', table: { type: { summary: '(open: boolean) => void' } } },
  },
  decorators: [(Story) => <div className="flex min-h-40 items-center justify-center p-10"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component: [
          'A short label shown on hover and keyboard focus (Radix Tooltip). API: `<Tooltip content="…"><Button /></Tooltip>`. Put one `TooltipProvider` near the app root so moving between tooltips skips the delay; without it each Tooltip brings its own.',
          '',
          '**Use** to name icon-only buttons, show a keyboard shortcut, or reveal the full text of something truncated.',
          '',
          '**Don’t use** for essential information (touch and many magnifier users never see it), for interactive content like links or buttons (it can’t be reached — use a Popover), or on a disabled button directly: disabled elements get no hover or focus, so wrap the button in `<span tabIndex={0}>`.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sides: Story = {
  args: { defaultOpen: undefined },
  render: () => (
    <Inline gap={3}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} content={`On the ${side}`} side={side} defaultOpen={side === 'bottom'}>
          <Button>{side}</Button>
        </Tooltip>
      ))}
    </Inline>
  ),
};

/** With a shortcut: show the key combination for the action. */
export const WithShortcut: Story = {
  args: {
    content: (
      <span className="inline-flex items-center gap-2">
        Print <KbdShortcut keys={['⌘', 'P']} size="sm" className="[&_kbd]:border-fg-subtle [&_kbd]:bg-transparent [&_kbd]:text-fg-inverse" />
      </span>
    ),
    children: <IconButton icon={<Printer />} label="Print" variant="secondary" />,
  },
};

/** A toolbar sharing one provider: after the first tooltip, the rest open without delay. */
export const Toolbar: Story = {
  args: { defaultOpen: undefined },
  render: () => (
    <TooltipProvider>
      <Inline gap={1} className="rounded-md border border-border bg-surface p-1">
        <Tooltip content="Edit">
          <IconButton icon={<Pencil />} label="Edit" />
        </Tooltip>
        <Tooltip content="Duplicate">
          <IconButton icon={<Copy />} label="Duplicate" />
        </Tooltip>
        <Tooltip content="Delete">
          <IconButton icon={<Trash2 />} label="Delete" />
        </Tooltip>
      </Inline>
    </TooltipProvider>
  ),
};

/**
 * Disabled trigger: wrap it in a focusable span, and still put the reason on
 * the page — the tooltip is a convenience, not the explanation.
 */
export const Disabled: Story = {
  args: {
    content: 'Add a payment method to publish',
    children: (
      <span tabIndex={0} className="inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
        <Button variant="primary" disabled>
          Publish
        </Button>
      </span>
    ),
  },
};

/** Overflow: long text wraps at a max width instead of running off screen. */
export const Overflow: Story = {
  args: {
    content:
      'Duplicates the order with the same customer, line items and shipping address, as a draft you can edit before sending the invoice.',
    children: <Button>Duplicate</Button>,
  },
};
