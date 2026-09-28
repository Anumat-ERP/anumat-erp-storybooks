import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentPropsWithRef } from 'react';
import { Link } from './link';
import { Stack } from './stack';

/** Stand-in for a router’s link component. */
function RouterLink({ to, ...props }: ComponentPropsWithRef<'a'> & { to: string }) {
  return <a href={to} data-router-link="" {...props} />;
}

const meta = {
  title: 'primitives/Link',
  component: Link,
  args: { href: '#orders', children: 'View all orders' },
  argTypes: {
    href: { control: 'text', description: 'Destination.', table: { type: { summary: 'string' } } },
    children: { control: 'text', description: 'Says where it goes: “View order #1042”, not “click here”.', table: { type: { summary: 'ReactNode' } } },
    tone: {
      control: 'inline-radio',
      options: ['default', 'muted', 'critical'],
      description: '`default` for most links; `muted` for secondary links in metadata; `critical` inside critical messages.',
      table: { type: { summary: "'default' | 'muted' | 'critical'" }, defaultValue: { summary: 'default' } },
    },
    underline: {
      control: 'inline-radio',
      options: ['always', 'hover'],
      description: '`always` in running text (so links don’t rely on colour); `hover` only where context makes the link obvious, e.g. navigation lists.',
      table: { type: { summary: "'always' | 'hover'" }, defaultValue: { summary: 'always' } },
    },
    external: {
      control: 'boolean',
      description: 'New tab: `target="_blank"`, `rel="noopener noreferrer"`, an icon and hidden “(opens in a new tab)”.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    externalLabel: { control: 'text', description: 'Announced text for external links; localise it.', table: { type: { summary: 'string' }, defaultValue: { summary: '(opens in a new tab)' } } },
    asChild: { control: false, description: 'Style the child element (a router link) instead of rendering `<a>`.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Navigates somewhere — another page, a section, a file. Renders an `<a>`, or your router’s link via `asChild`.',
          '',
          '**Use** for navigation, in running text or on its own. Use `external` for links that leave the app so work in progress isn’t lost.',
          '',
          '**Don’t use** for actions that change data — use a Button. Don’t make a link look like a button; use `<Button asChild><a/></Button>`. Keep underlines in running text: colour alone doesn’t identify a link.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <Stack gap={2}>
      <Link {...args} tone="default">Default: view all orders</Link>
      <Link {...args} tone="muted">Muted: edit address</Link>
      <Link {...args} tone="critical">Critical: review failed payments</Link>
    </Stack>
  ),
};

export const InText: Story = {
  render: (args) => (
    <p className="max-w-prose text-md text-fg">
      Orders are archived after 60 days. You can change this in <Link {...args} href="#settings">order settings</Link>, or{' '}
      <Link {...args} href="#help" external>
        read how archiving works
      </Link>
      .
    </p>
  ),
};

export const External: Story = { args: { href: 'https://example.com/help', external: true, children: 'Help centre' } };

export const UnderlineOnHover: Story = {
  render: (args) => (
    <nav aria-label="Settings">
      <ul className="flex flex-col gap-2">
        {['General', 'Payments', 'Checkout', 'Shipping'].map((label) => (
          <li key={label}>
            <Link {...args} underline="hover" href={`#${label.toLowerCase()}`}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  ),
};

/** Router links: `asChild` gives your router’s link the Link styling. */
export const AsChild: Story = {
  render: () => (
    <Link asChild>
      <RouterLink to="#customers">Customers</RouterLink>
    </Link>
  ),
};

/** Error: link to the fix from inside an error message. */
export const ErrorState: Story = {
  name: 'Error',
  render: (args) => (
    <p role="alert" className="text-sm text-critical-subtle-fg">
      3 payments failed.{' '}
      <Link {...args} tone="critical" href="#payments">
        Review failed payments
      </Link>
    </p>
  ),
};

/** Disabled: links can’t be disabled natively. Prefer removing the `href` and explaining why; `aria-disabled` mutes it. */
export const Disabled: Story = {
  render: () => (
    <p className="text-sm text-fg-muted">
      <Link aria-disabled="true" role="link">
        Download invoice
      </Link>{' '}
      — available once the order is paid.
    </p>
  ),
};

/** Overflow: long links, including unbroken URLs, wrap within the column. */
export const Overflow: Story = {
  render: (args) => (
    <p className="w-64 break-words text-md text-fg">
      <Link {...args} href="#" external>
        https://help.example.com/articles/managing-inventory-across-multiple-locations-and-warehouses
      </Link>
    </p>
  ),
};
