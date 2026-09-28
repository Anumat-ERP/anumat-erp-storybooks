import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from './breadcrumbs';

const trail = [
  { label: 'Settings', href: '#settings' },
  { label: 'Shipping and delivery', href: '#shipping' },
  { label: 'Europe' },
];

const longTrail = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'Collections', href: '#collections' },
  { label: 'Summer', href: '#summer' },
  { label: 'Swimwear', href: '#swimwear' },
  { label: 'Women', href: '#women' },
  { label: 'Linen cover-up' },
];

const meta = {
  title: 'components/Breadcrumbs',
  component: Breadcrumbs,
  args: { items: trail, maxItems: 4 },
  argTypes: {
    items: {
      control: 'object',
      description: 'The trail, root first. The last entry is the current page: plain text with `aria-current="page"`, never a link.',
      table: { type: { summary: '{ label: string; href?: string }[]' } },
    },
    maxItems: {
      control: { type: 'number', min: 3 },
      description: 'Trails longer than this collapse their middle into a “…” button that expands it. The first entry and the last `maxItems − 2` stay.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '4' } },
    },
    renderLink: {
      control: false,
      description: 'Render crumbs with your router: `(p) => <Link to={p.href} className={p.className}>{p.children}</Link>`.',
      table: { type: { summary: '(props: { href: string; className: string; children: ReactNode }) => ReactNode' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Name of the `nav` landmark.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Breadcrumb' } },
    },
    children: {
      control: false,
      description: 'Hand-composed `BreadcrumbItem`s (with `BreadcrumbLink asChild` / `BreadcrumbPage`) instead of `items`.',
      table: { type: { summary: 'ReactNode' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Shows where the page sits in the hierarchy and links to its ancestors. A `<nav aria-label="Breadcrumb">` around an `<ol>`; the current page carries `aria-current="page"`.',
          '',
          '**Use** on pages two or more levels deep. Long trails collapse their middle; router links go through `renderLink` or `BreadcrumbLink asChild`.',
          '',
          '**Don’t use** as primary navigation, on top-level pages, or for steps in a flow (use a stepper). With a single parent, PageHeader’s back link is lighter.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Long trails collapse the middle; the “…” button reveals it and moves focus to the first revealed link. */
export const Collapsed: Story = { args: { items: longTrail } };

/** Router links: `renderLink` receives href, className and children. */
export const RenderLink: Story = {
  args: {
    renderLink: ({ href, className, children }) => (
      <a href={href} className={className} data-router-link="">
        {children}
      </a>
    ),
  },
};

/** Composed with parts; `BreadcrumbLink asChild` wraps a router link. */
export const Composed: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <a href="#customers">Customers</a>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbPage>Ana Souza</BreadcrumbPage>
      </BreadcrumbItem>
    </Breadcrumbs>
  ),
};

/** Loading: the current page’s name isn’t known yet; hold its place. */
export const Loading: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem>
        <BreadcrumbLink href="#orders">Orders</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbPage aria-busy="true">
          <span className="sr-only">Loading</span>
          <span aria-hidden className="inline-block h-3 w-20 animate-pulse rounded-sm bg-skeleton align-middle" />
        </BreadcrumbPage>
      </BreadcrumbItem>
    </Breadcrumbs>
  ),
};

/** Error: the record failed to load; the trail still leads back. */
export const ErrorState: Story = {
  name: 'Error',
  args: { items: [{ label: 'Orders', href: '#orders' }, { label: 'Order not found' }] },
};

/** Permission: an ancestor the merchant can’t open renders as text, not a link. */
export const Permission: Story = {
  args: { items: [{ label: 'Finance' }, { label: 'Payouts', href: '#payouts' }, { label: 'Payout #88' }] },
};

/** Offline: breadcrumbs are local, so they keep working. */
export const Offline: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Breadcrumbs {...args} />
      <p className="text-sm text-fg-muted">You’re offline — pages you visited recently still open.</p>
    </div>
  ),
};

/** Overflow: long labels truncate, the trail wraps in narrow containers. */
export const Overflow: Story = {
  args: {
    items: [
      { label: 'Wholesale customers and price lists', href: '#a' },
      { label: 'Bairro Alto Home & Garden Supplies Ltda.', href: '#b' },
      { label: 'Price list — Spring/Summer 2026 terracotta and ceramics' },
    ],
  },
  render: (args) => (
    <div className="w-80 rounded-md border border-dashed border-border-strong p-2">
      <Breadcrumbs {...args} />
    </div>
  ),
};
