import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Icons from 'lucide-react';
import { useMemo, useState } from 'react';
import { Section, TokenName } from './swatch';

const meta = {
  title: 'foundations/Icons',
  parameters: {
    docs: {
      description: {
        component:
          'Icons come from `lucide-react` (ISC licence). Size them from the parent (`[&_svg]:size-4`), colour them with text colour, and mark them `aria-hidden` unless they are the only content — then the control needs an accessible name. Below: the set used by this library, plus a search over the full set.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const USED = [
  'Plus', 'X', 'Check', 'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight', 'ChevronsUpDown', 'ArrowUp', 'ArrowDown',
  'Search', 'Filter', 'MoreHorizontal', 'Trash2', 'Pencil', 'Copy', 'Download', 'Upload', 'ExternalLink',
  'Info', 'CircleCheck', 'TriangleAlert', 'CircleAlert', 'Bell', 'Lock', 'WifiOff', 'RefreshCw', 'Menu', 'Settings',
  'Package', 'ShoppingCart', 'Users', 'FileText', 'Receipt', 'Warehouse', 'Truck', 'ChartColumn', 'House', 'Image',
  'Play',
] as const;

type IconComponent = (props: { className?: string; 'aria-hidden'?: boolean }) => React.ReactNode;
const lookup = Icons as unknown as Record<string, IconComponent>;

function Grid({ names }: { names: readonly string[] }) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-2">
      {names.map((name) => {
        const Icon = lookup[name];
        if (!Icon) return null;
        return (
          <li key={name} className="flex flex-col items-center gap-2 rounded-md border border-border bg-surface p-3 text-fg">
            <Icon className="size-5" aria-hidden />
            <span className="max-w-full truncate text-xs text-fg-muted">{name}</span>
          </li>
        );
      })}
    </ul>
  );
}

export const InUse: Story = {
  name: 'In use',
  render: () => (
    <Section title="Icons used by components">
      <Grid names={USED} />
    </Section>
  ),
};

function SearchAll() {
  const [q, setQ] = useState('invoice');
  const names = useMemo(
    () =>
      Object.keys(Icons)
        .filter((n) => /^[A-Z]/.test(n) && !n.endsWith('Icon') && !n.startsWith('Lucide') && n.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 120),
    [q],
  );
  return (
    <Section title="Search the full set" description={<>Import by name: <TokenName>{"import { Receipt } from 'lucide-react'"}</TokenName></>}>
      <label className="flex max-w-sm flex-col gap-1 text-sm font-medium">
        Filter icons
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-control-md rounded-md border border-border-input bg-surface px-3 text-md font-regular focus-visible:outline-2 focus-visible:outline-ring"
        />
      </label>
      <Grid names={names} />
    </Section>
  );
}

export const Search: Story = { render: () => <SearchAll /> };
