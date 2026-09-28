import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd, KbdShortcut } from './kbd';
import { Inline, Stack } from './stack';

const meta = {
  title: 'primitives/Kbd',
  component: Kbd,
  subcomponents: { KbdShortcut },
  args: { children: 'Esc' },
  argTypes: {
    children: { control: 'text', description: 'The key’s name or symbol. Symbols like ⌘ ⇧ ⌥ get a spoken name automatically.', table: { type: { summary: 'ReactNode' } } },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      description: '`md` in body text; `sm` in menus and tooltips.',
      table: { type: { summary: "'sm' | 'md'" }, defaultValue: { summary: 'md' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A keyboard key. `KbdShortcut` renders a combination as the HTML `<kbd>`-in-`<kbd>` pattern, read as “Command plus K”.',
          '',
          '**Use** to show shortcuts next to the action they trigger — in menus, tooltips and help text.',
          '',
          '**Don’t use** for code or file names (Text `variant="mono"`), or as a generic badge. Don’t make a shortcut the only way to do something.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Shortcut: Story = {
  render: () => (
    <Stack gap={3}>
      <Inline>
        <KbdShortcut keys={['⌘', 'K']} /> <span className="text-sm text-fg-muted">Search</span>
      </Inline>
      <Inline>
        <KbdShortcut keys={['Ctrl', 'Shift', 'P']} /> <span className="text-sm text-fg-muted">Command palette</span>
      </Inline>
      <Inline>
        <KbdShortcut keys={['⇧', '↵']} size="sm" /> <span className="text-sm text-fg-muted">Save and add another</span>
      </Inline>
    </Stack>
  ),
};

export const InText: Story = {
  render: () => (
    <p className="max-w-prose text-md text-fg">
      Press <Kbd>/</Kbd> to focus search, <Kbd>J</Kbd> and <Kbd>K</Kbd> to move between orders, and <Kbd>Esc</Kbd> to close.
    </p>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Inline>
      <Kbd size="sm">Tab</Kbd>
      <Kbd size="md">Tab</Kbd>
    </Inline>
  ),
};

/** Overflow: long key names don’t wrap inside the key; the row wraps between keys. */
export const Overflow: Story = {
  render: () => (
    <div className="w-40 rounded-md border border-dashed border-border-strong p-2">
      <KbdShortcut keys={['Ctrl', 'Alt', 'Shift', 'Page Down']} className="flex-wrap" />
    </div>
  ),
};
