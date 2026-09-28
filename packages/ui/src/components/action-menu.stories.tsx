import type { Meta, StoryObj } from '@storybook/react-vite';
import { Archive, ChevronDown, Copy, Download, Mail, MoreHorizontal, Pencil, Printer, Share2, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { fn } from 'storybook/test';
import {
  ActionMenu,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  PageActions,
  type ActionMenuSection,
} from './action-menu';
import { Button, IconButton } from './button';

const trigger = <Button trailingIcon={<ChevronDown aria-hidden />}>More actions</Button>;

const sections: ActionMenuSection[] = [
  {
    items: [
      { content: 'Edit order', icon: <Pencil />, onAction: fn(), suffix: 'E' },
      { content: 'Duplicate', icon: <Copy />, onAction: fn() },
      { content: 'Print packing slip', icon: <Printer />, onAction: fn() },
    ],
  },
  {
    title: 'Share',
    items: [
      { content: 'Email invoice', icon: <Mail />, onAction: fn(), helpText: 'Sends to ana@example.com' },
      { content: 'Export as CSV', icon: <Download />, onAction: fn() },
    ],
  },
  {
    items: [
      { content: 'Archive', icon: <Archive />, onAction: fn() },
      { content: 'Delete order', icon: <Trash2 />, onAction: fn(), destructive: true },
    ],
  },
];

const Frame = ({ children }: { children: ReactNode }) => <div className="flex min-h-96 justify-end pe-4 pt-2">{children}</div>;

const meta = {
  title: 'components/ActionMenu',
  component: ActionMenu,
  args: { trigger, sections, defaultOpen: true, align: 'end', onOpenChange: fn() },
  argTypes: {
    trigger: {
      control: false,
      description: 'The element that opens the menu, usually a Button with a chevron or an IconButton with a “More” icon and label.',
      table: { type: { summary: 'ReactNode' } },
    },
    sections: {
      control: 'object',
      description: 'Grouped actions. A `title` names the group for assistive technology; groups are separated by a divider.',
      table: {
        type: {
          summary:
            '{ title?: string; items: { content: string; icon?: ReactNode; onAction?: () => void; href?: string; destructive?: boolean; disabled?: boolean; helpText?: ReactNode; suffix?: ReactNode }[] }[]',
        },
      },
    },
    items: {
      control: 'object',
      description: 'Ungrouped actions — shorthand for one untitled section, rendered first.',
      table: { type: { summary: 'ActionMenuItem[]' } },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description: 'Alignment against the trigger. `end` suits triggers at the right of a header.',
      table: { type: { summary: "'start' | 'center' | 'end'" }, defaultValue: { summary: 'end' } },
    },
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Preferred side; flips when there is no room.',
      table: { type: { summary: "'top' | 'right' | 'bottom' | 'left'" }, defaultValue: { summary: 'bottom' } },
    },
    open: { control: 'boolean', description: 'Controlled open state.', table: { type: { summary: 'boolean' } } },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onOpenChange: { control: false, description: 'Called when the menu opens or closes.', table: { type: { summary: '(open: boolean) => void' } } },
    className: { control: 'text', description: 'Classes for the menu surface.', table: { type: { summary: 'string' } } },
  },
  render: (args) => (
    <Frame>
      <ActionMenu {...args} />
    </Frame>
  ),
  parameters: {
    docs: {
      story: { inline: false, height: '440px' },
      description: {
        component: [
          'A button that opens a list of actions. Built on Radix DropdownMenu: arrow keys move (roving focus), typing jumps to the matching item, Enter runs it and Escape closes and returns focus to the trigger. Destructive items use the critical tone.',
          '',
          '**Use** for secondary actions on a page, card or row (“More actions”). `PageActions` shows the first few actions as buttons and overflows the rest into the menu. The styled `DropdownMenu*` primitives are exported for custom menus (checkbox and radio items, sub-menus).',
          '',
          '**Don’t use** for navigation between pages (use Navigation or Tabs), for picking a form value (use a Select), or to hide the action merchants need most — make that a visible primary Button. Don’t nest menus more than one level.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof ActionMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Closed: Story = { args: { defaultOpen: false }, parameters: { docs: { story: { inline: true } } } };

export const IconTrigger: Story = {
  args: {
    trigger: <IconButton icon={<MoreHorizontal />} label="Actions for order #1042" variant="secondary" />,
    sections: [sections[0]!, sections[2]!],
  },
};

/** Disabled items stay visible and say why, so merchants know the action exists. */
export const Permission: Story = {
  args: {
    sections: [
      {
        items: [
          { content: 'Edit order', icon: <Pencil />, onAction: fn() },
          { content: 'Refund', icon: <Download />, disabled: true, helpText: 'Needs the “Issue refunds” permission' },
          { content: 'Delete order', icon: <Trash2 />, destructive: true, disabled: true, helpText: 'Only store owners can delete orders' },
        ],
      },
    ],
  },
};

export const Offline: Story = {
  args: {
    sections: [
      {
        title: 'Available offline',
        items: [{ content: 'Print packing slip', icon: <Printer />, onAction: fn() }],
      },
      {
        title: 'Needs a connection',
        items: [
          { content: 'Email invoice', icon: <Mail />, disabled: true, helpText: 'You’re offline' },
          { content: 'Share link', icon: <Share2 />, disabled: true, helpText: 'You’re offline' },
        ],
      },
    ],
  },
};

/** Loading: an action is running. The trigger shows the busy state; the menu stays closed. */
export const Loading: Story = {
  args: { defaultOpen: false, trigger: <Button loading trailingIcon={<ChevronDown aria-hidden />}>More actions</Button> },
  parameters: { docs: { story: { inline: true } } },
};

/** Error: the action failed after the menu closed — report it beside the trigger, not in the menu. */
export const ErrorState: Story = {
  name: 'Error',
  args: { defaultOpen: false },
  render: (args) => (
    <div className="flex flex-col items-end gap-2">
      <ActionMenu {...args} />
      <p role="alert" className="text-sm text-critical-subtle-fg">
        The invoice couldn’t be emailed. Check the customer’s address and try again.
      </p>
    </div>
  ),
  parameters: { docs: { story: { inline: true } } },
};

/** Overflow: long labels truncate at the menu’s max width; long lists scroll. */
export const Overflow: Story = {
  args: {
    sections: [
      {
        title: 'Move to location',
        items: Array.from({ length: 16 }, (_, i) => ({
          content: `Warehouse ${i + 1} — Distribution centre, Avenida da Liberdade ${100 + i}, Lisboa`,
          onAction: fn(),
        })),
      },
    ],
  },
};

export const PageActionsStory: Story = {
  name: 'PageActions',
  render: () => (
    <Frame>
      <PageActions
        maxVisible={2}
        actions={[
          { content: 'Duplicate', icon: <Copy />, onAction: fn() },
          { content: 'Print', icon: <Printer />, onAction: fn() },
          { content: 'Export', icon: <Download />, onAction: fn() },
          { content: 'Archive', icon: <Archive />, onAction: fn() },
          { content: 'Delete product', icon: <Trash2 />, onAction: fn(), destructive: true },
        ]}
      />
    </Frame>
  ),
  parameters: { docs: { story: { inline: true } } },
};

/** The styled primitives, composed: checkbox items, a radio group and a sub-menu. */
export const Primitives: Story = {
  render: function Render() {
    const [columns, setColumns] = useState({ customer: true, total: true, channel: false });
    const [density, setDensity] = useState('comfortable');
    return (
      <Frame>
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button trailingIcon={<ChevronDown aria-hidden />}>View</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            {(Object.keys(columns) as (keyof typeof columns)[]).map((key) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={columns[key]}
                onCheckedChange={(checked) => setColumns((c) => ({ ...c, [key]: checked === true }))}
                onSelect={(e) => e.preventDefault()}
              >
                {key[0]!.toUpperCase() + key.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Density</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
              <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Download aria-hidden />
                Export
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>CSV</DropdownMenuItem>
                <DropdownMenuItem>Excel</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem destructive>
              <Trash2 aria-hidden />
              Reset view
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Frame>
    );
  },
};
