import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, CalendarDays, ChevronDown, Lock, WifiOff } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './button';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from './popover';
import { Spinner } from './spinner';
import { Stack } from './stack';

const ranges = ['Today', 'Last 7 days', 'Last 30 days', 'This quarter', 'Custom range…'];

function DateRangeBody() {
  return (
    <Stack gap={3}>
      <p className="text-md font-semibold text-fg">Date range</p>
      <fieldset className="flex flex-col gap-2">
        <legend className="sr-only">Date range</legend>
        {ranges.map((r, i) => (
          <label key={r} className="flex items-center gap-2 text-md text-fg">
            <input type="radio" name="range" defaultChecked={i === 1} className="size-4 accent-(--a-color-primary)" />
            {r}
          </label>
        ))}
      </fieldset>
      <div className="flex justify-end gap-2 border-t border-border pt-3">
        <PopoverClose asChild>
          <Button size="sm" variant="tertiary">
            Cancel
          </Button>
        </PopoverClose>
        <PopoverClose asChild>
          <Button size="sm" variant="primary">
            Apply
          </Button>
        </PopoverClose>
      </div>
    </Stack>
  );
}

function Frame({
  children,
  open = true,
  label = 'Last 7 days',
  contentLabel = 'Date range',
  ...props
}: { children: ReactNode; open?: boolean; label?: string; contentLabel?: string } & Parameters<typeof PopoverContent>[0]) {
  return (
    <div className="flex min-h-96 items-start justify-center pt-4">
      <Popover defaultOpen={open}>
        <PopoverTrigger asChild>
          <Button icon={<CalendarDays aria-hidden />} trailingIcon={<ChevronDown aria-hidden />}>
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent {...props} aria-label={contentLabel}>
          {children}
        </PopoverContent>
      </Popover>
    </div>
  );
}

const meta = {
  title: 'components/Popover',
  component: PopoverContent,
  args: { arrow: false, side: 'bottom', align: 'center', sideOffset: 6, flush: false },
  argTypes: {
    arrow: {
      control: 'boolean',
      description: 'Draw an arrow pointing at the trigger. Helps when the anchor is small or among similar controls.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Preferred side of the trigger. Flips automatically when there is no room.',
      table: { type: { summary: "'top' | 'right' | 'bottom' | 'left'" }, defaultValue: { summary: 'bottom' } },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description: 'Alignment against the trigger on the cross axis.',
      table: { type: { summary: "'start' | 'center' | 'end'" }, defaultValue: { summary: 'center' } },
    },
    sideOffset: {
      control: 'number',
      description: 'Gap between trigger and popover, in px.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '6' } },
    },
    flush: {
      control: 'boolean',
      description: 'Remove the inner padding, for lists that run edge to edge.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    className: { control: 'text', description: 'Classes for the surface, e.g. a width (`w-80`).', table: { type: { summary: 'string' } } },
  },
  render: (args) => (
    <Frame {...args}>
      <DateRangeBody />
    </Frame>
  ),
  parameters: {
    docs: {
      story: { inline: false, height: '420px' },
      description: {
        component: [
          'Floating, non-modal content anchored to a trigger. Built on Radix Popover: it opens on click, moves focus inside, closes on Escape or an outside click and returns focus to the trigger. Parts: `Popover`, `PopoverTrigger`, `PopoverContent` (`arrow`, `flush`), `PopoverAnchor`, `PopoverClose`.',
          '',
          '**Use** for small interactive panels opened on demand: a date-range picker, a filter, a quick edit, extra details about a value.',
          '',
          '**Don’t use** for a list of actions (use ActionMenu — it has menu semantics and typeahead), for hover-only hints (use a Tooltip), for a task that must be completed or cancelled (use a Modal), or for content too large to fit beside the trigger (use a Drawer).',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithArrow: Story = { args: { arrow: true } };

export const Closed: Story = {
  render: (args) => (
    <Frame {...args} open={false}>
      <DateRangeBody />
    </Frame>
  ),
  parameters: { docs: { story: { inline: true } } },
};

export const Details: Story = {
  args: { arrow: true, side: 'right', align: 'start' },
  render: (args) => (
    <Frame {...args} label="Stock: 12" contentLabel="Stock by location">
      <Stack gap={2}>
        <p className="text-md font-semibold text-fg">Stock by location</p>
        <dl className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-md">
          <dt className="text-fg-muted">Lisbon warehouse</dt>
          <dd className="tabular-nums">8</dd>
          <dt className="text-fg-muted">Porto store</dt>
          <dd className="tabular-nums">4</dd>
          <dt className="text-fg-muted">In transit</dt>
          <dd className="tabular-nums">0</dd>
        </dl>
      </Stack>
    </Frame>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <Frame {...args}>
      <div className="flex items-center gap-2 py-4 text-md text-fg-muted">
        <Spinner size="sm" label={null} />
        <span role="status">Loading saved ranges…</span>
      </div>
    </Frame>
  ),
};

export const ErrorState: Story = {
  name: 'Error',
  render: (args) => (
    <Frame {...args}>
      <div role="alert" className="flex items-start gap-2 text-md text-critical-subtle-fg [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0">
        <AlertTriangle aria-hidden />
        <div className="flex flex-col items-start gap-2">
          <span>Saved ranges couldn’t be loaded.</span>
          <Button size="sm">Try again</Button>
        </div>
      </div>
    </Frame>
  ),
};

export const Permission: Story = {
  render: (args) => (
    <Frame {...args}>
      <div className="flex items-start gap-2 text-md text-fg-muted [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0">
        <Lock aria-hidden />
        <span>Custom ranges beyond 90 days need the Analytics add-on. Ask a store owner to enable it.</span>
      </div>
    </Frame>
  ),
};

export const Offline: Story = {
  render: (args) => (
    <Frame {...args}>
      <div className="flex items-start gap-2 text-md text-fg-muted [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0">
        <WifiOff aria-hidden />
        <span>You’re offline. Only today’s data is available until you reconnect.</span>
      </div>
    </Frame>
  ),
};

export const Empty: Story = {
  render: (args) => (
    <Frame {...args}>
      <div className="flex flex-col gap-1 py-2 text-center">
        <p className="font-medium text-fg">No saved ranges</p>
        <p className="text-sm text-fg-muted">Pick a custom range and save it to reuse it here.</p>
      </div>
    </Frame>
  ),
};

/** Overflow: long content wraps inside the fixed width; very long content scrolls. */
export const Overflow: Story = {
  render: (args) => (
    <Frame {...args} label="PO-2026-000184" contentLabel="Purchase order notes">
      <div className="flex max-h-60 flex-col gap-2 overflow-y-auto" tabIndex={0} aria-label="Notes">
        <p className="text-md font-semibold text-fg break-words">
          Notes for PO-2026-000184-WHOLESALE-BAIRRO-ALTO-HOME-GARDEN
        </p>
        {Array.from({ length: 8 }, (_, i) => (
          <p key={i} className="text-md text-fg-muted">
            Supplier confirmed partial shipment {i + 1}; remaining units arrive next week.
          </p>
        ))}
      </div>
    </Frame>
  ),
};
