import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BarChart3,
  Box,
  Home,
  Megaphone,
  Plus,
  Settings,
  ShoppingBag,
  Store,
  Tag,
  Users,
  Wallet,
} from 'lucide-react';
import { fn } from 'storybook/test';
import { IconButton } from './button';
import { Navigation, type NavigationSection } from './navigation';

export const navigationSections: NavigationSection[] = [
  {
    items: [
      { label: 'Home', href: '#home', icon: <Home /> },
      {
        label: 'Orders',
        href: '#orders',
        icon: <ShoppingBag />,
        badge: 12,
        badgeLabel: '12 unfulfilled',
        subItems: [
          { label: 'Drafts', href: '#orders/drafts' },
          { label: 'Abandoned checkouts', href: '#orders/abandoned', selected: true },
        ],
      },
      {
        label: 'Products',
        href: '#products',
        icon: <Box />,
        subItems: [
          { label: 'Collections', href: '#products/collections' },
          { label: 'Inventory', href: '#products/inventory' },
        ],
      },
      { label: 'Customers', href: '#customers', icon: <Users /> },
      { label: 'Marketing', href: '#marketing', icon: <Megaphone /> },
      { label: 'Discounts', href: '#discounts', icon: <Tag /> },
      { label: 'Analytics', href: '#analytics', icon: <BarChart3 />, disabled: true },
      { label: 'Finance', href: '#finance', icon: <Wallet /> },
    ],
  },
  {
    title: 'Sales channels',
    action: <IconButton icon={<Plus />} label="Add sales channel" size="sm" />,
    items: [{ label: 'Online store', href: 'https://example.com', icon: <Store />, external: true }],
  },
  {
    items: [{ label: 'Settings', href: '#settings', icon: <Settings /> }],
  },
];

const meta = {
  title: 'components/Navigation',
  component: Navigation,
  excludeStories: ['navigationSections'],
  args: { sections: navigationSections, 'aria-label': 'Main' },
  argTypes: {
    sections: {
      control: 'object',
      description:
        'Grouped destinations. Items take `label`, `href`, `icon`, `badge` (+ `badgeLabel`), `selected` (sets `aria-current="page"` and reveals `subItems`), `disabled`, `external` (new tab with an icon) and `onClick`.',
      table: {
        type: {
          summary:
            '{ title?: string; action?: ReactNode; items: { label; href; icon?; badge?; badgeLabel?; selected?; disabled?; external?; subItems?: { label; href; selected?; badge? }[]; onClick? }[] }[]',
        },
      },
    },
    renderLink: {
      control: false,
      description: 'Render links with your router. Receives `href`, `className`, `children`, `aria-current`, `target`, `rel`, `onClick`.',
      table: { type: { summary: '(props: NavigationLinkProps) => ReactNode' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Name of the `nav` landmark.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Main' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-60 rounded-lg border border-border bg-surface">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: [
          'The app’s primary navigation for the sidebar: sections with optional titles, items with icons, counts, and sub-items that appear under the selected item. The current page carries `aria-current="page"`. Takes `href`s and an optional `renderLink` for router links — no framework imports.',
          '',
          '**Use** once, inside AppShell’s sidebar (which moves it into a drawer on small screens).',
          '',
          '**Don’t use** for in-page views (use Tabs), for actions (use buttons or ActionMenu), or for more than two levels — deeper structure belongs in the page. Disabled items stay visible so merchants know the area exists; explain why elsewhere (e.g. an upgrade prompt on hover or in Settings).',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Orders is expanded because one of its sub-items (Abandoned checkouts) is the current page. */
export const Default: Story = {};

export const TopLevelSelected: Story = {
  args: {
    sections: navigationSections.map((s, i) =>
      i === 0
        ? {
            ...s,
            items: s.items.map((item) =>
              item.label === 'Products'
                ? { ...item, selected: true }
                : { ...item, subItems: item.subItems?.map((sub) => ({ ...sub, selected: false })) },
            ),
          }
        : s,
    ),
  },
};

/** Router links: `renderLink` receives the props to spread onto your `<Link>`. */
export const RenderLink: Story = {
  args: {
    renderLink: ({ href, ...props }) => <a href={href} data-router-link="" {...props} onClick={fn()} />,
  },
};

/** Loading: counts not known yet show a placeholder rather than 0. */
export const Loading: Story = {
  args: {
    sections: [
      {
        items: [
          { label: 'Home', href: '#home', icon: <Home />, selected: true },
          {
            label: 'Orders',
            href: '#orders',
            icon: <ShoppingBag />,
            badge: <span className="block h-2 w-3 animate-pulse rounded-full bg-skeleton" />,
            badgeLabel: 'count loading',
          },
          { label: 'Products', href: '#products', icon: <Box /> },
        ],
      },
    ],
  },
};

/** Error: a count failed to load — show “!” with an explanation for assistive technology. */
export const ErrorState: Story = {
  name: 'Error',
  args: {
    sections: [
      {
        items: [
          { label: 'Home', href: '#home', icon: <Home />, selected: true },
          { label: 'Orders', href: '#orders', icon: <ShoppingBag />, badge: '!', badgeLabel: 'count unavailable' },
        ],
      },
    ],
  },
};

/** Permission: areas the plan or role doesn’t include are shown disabled. */
export const Permission: Story = {
  args: {
    sections: [
      {
        items: [
          { label: 'Home', href: '#home', icon: <Home />, selected: true },
          { label: 'Orders', href: '#orders', icon: <ShoppingBag /> },
          { label: 'Analytics', href: '#analytics', icon: <BarChart3 />, disabled: true },
          { label: 'Finance', href: '#finance', icon: <Wallet />, disabled: true },
        ],
      },
    ],
  },
};

/** Offline: navigation keeps working; areas that need the network are disabled. */
export const Offline: Story = {
  args: {
    sections: [
      {
        items: [
          { label: 'Home', href: '#home', icon: <Home />, selected: true },
          { label: 'Orders', href: '#orders', icon: <ShoppingBag /> },
          { label: 'Analytics', href: '#analytics', icon: <BarChart3 />, disabled: true, badge: 'Offline' },
        ],
      },
    ],
  },
};

/** Empty: a section with no items yet shows only its add action. */
export const Empty: Story = {
  args: {
    sections: [
      { items: [{ label: 'Home', href: '#home', icon: <Home />, selected: true }] },
      {
        title: 'Sales channels',
        action: <IconButton icon={<Plus />} label="Add sales channel" size="sm" />,
        items: [],
      },
    ],
  },
};

/** Overflow: long labels truncate; large counts stay on one line. */
export const Overflow: Story = {
  args: {
    sections: [
      {
        title: 'Wholesale and business-to-business channels',
        items: [
          { label: 'Bairro Alto Home & Garden Supplies Ltda.', href: '#a', icon: <Store />, badge: '1,284', selected: true },
          { label: 'International distributors (EU, UK, Switzerland)', href: '#b', icon: <Store />, badge: 12 },
        ],
      },
    ],
  },
};
