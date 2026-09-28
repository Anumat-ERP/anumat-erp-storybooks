import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, Bell, Search, WifiOff } from 'lucide-react';
import type { ReactNode } from 'react';
import { AppShell } from './app-shell';
import { IconButton } from './button';
import { Card } from './card';
import { Navigation } from './navigation';
import { navigationSections } from './navigation.stories';
import { PageHeader } from './page-header';

function TopBar() {
  return (
    <>
      <span className="flex items-center gap-2 font-semibold text-fg">
        <span aria-hidden className="inline-flex size-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-fg">
          A
        </span>
        Anumat
      </span>
      <label className="ms-auto hidden h-control-sm w-72 items-center gap-2 rounded-md border border-border-input bg-surface-muted px-2 text-sm text-fg-muted sm:flex">
        <Search aria-hidden className="size-4" />
        <input placeholder="Search" aria-label="Search" className="min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-fg-subtle" />
      </label>
      <IconButton icon={<Bell />} label="Notifications" className="ms-auto sm:ms-0" />
      <span aria-label="Account: Ana Souza" role="img" className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-sm font-medium text-fg">
        AS
      </span>
    </>
  );
}

function Page({ children }: { children?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <PageHeader title="Abandoned checkouts" subtitle="Checkouts from the last 30 days" />
      {children ?? (
        <Card>
          <p className="text-md text-fg">42 checkouts, $3,120.00 in potential revenue.</p>
        </Card>
      )}
    </div>
  );
}

const meta = {
  title: 'components/AppShell',
  component: AppShell,
  args: {
    topBar: <TopBar />,
    navigation: <Navigation sections={navigationSections} />,
    children: <Page />,
  },
  argTypes: {
    topBar: { control: false, description: 'Top bar content after the menu button: logo, search, account.', table: { type: { summary: 'ReactNode' } } },
    navigation: {
      control: false,
      description: 'Sidebar content, usually `<Navigation />`. In the sidebar from `md` up; in a left Drawer below, opened by the menu button.',
      table: { type: { summary: 'ReactNode' } },
    },
    children: { control: false, description: 'The page, rendered inside `<main>`.', table: { type: { summary: 'ReactNode' } } },
    mainId: {
      control: 'text',
      description: '`id` of `<main>`, the skip link’s target.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'main-content' } },
    },
    skipLinkLabel: {
      control: 'text',
      description: 'Text of the skip link — the first focusable element; visible on focus.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Skip to content' } },
    },
    navigationLabel: {
      control: 'text',
      description: 'Accessible name of the sidebar and of the mobile navigation drawer.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Navigation' } },
    },
    navigationOpen: { control: 'boolean', description: 'Controlled open state of the mobile drawer.', table: { type: { summary: 'boolean' } } },
    onNavigationOpenChange: {
      control: false,
      description: 'Called when the mobile drawer opens or closes (menu button, Escape, backdrop, following a link).',
      table: { type: { summary: '(open: boolean) => void' } },
    },
    mainClassName: { control: 'text', description: 'Classes for `<main>`.', table: { type: { summary: 'string' } } },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, height: '560px' },
      description: {
        component: [
          'The application frame: a sticky top bar, a sidebar with the primary navigation, and `<main>`. A “Skip to content” link comes first in the tab order. Below the `md` breakpoint the sidebar collapses into a left Drawer opened from a menu button; following a link closes it.',
          '',
          '**Use** once, at the root of the authenticated app layout.',
          '',
          '**Don’t use** for sign-in, onboarding or marketing pages (no sidebar), and don’t nest it. Page titles belong to PageHeader inside `children`, not to the top bar.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Mobile: below `md` the sidebar is a drawer. Shown open here. */
export const MobileNavigationOpen: Story = {
  args: { navigationOpen: true },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};

export const Loading: Story = {
  args: {
    children: (
      <Page>
        <div aria-busy="true" aria-label="Loading checkouts" className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
          {[90, 70, 80].map((w) => (
            <div key={w} className="h-4 animate-pulse rounded-sm bg-skeleton" style={{ width: `${w}%` }} />
          ))}
        </div>
      </Page>
    ),
  },
};

export const ErrorState: Story = {
  name: 'Error',
  args: {
    children: (
      <Page>
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-critical-border bg-critical-subtle p-4 text-md text-critical-subtle-fg">
          <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
          Checkouts couldn’t be loaded. Refresh the page to try again.
        </div>
      </Page>
    ),
  },
};

export const Permission: Story = {
  args: {
    navigation: (
      <Navigation
        sections={[
          {
            items: navigationSections[0]!.items.map((item) =>
              ['Analytics', 'Finance', 'Marketing'].includes(item.label) ? { ...item, disabled: true } : item,
            ),
          },
        ]}
      />
    ),
    children: (
      <Page>
        <Card>
          <p className="text-md text-fg-muted">Some areas are unavailable for your role. Ask a store owner for access.</p>
        </Card>
      </Page>
    ),
  },
};

export const Offline: Story = {
  args: {
    children: (
      <Page>
        <div role="status" className="flex items-start gap-2 rounded-lg border border-warning-border bg-warning-subtle p-4 text-md text-warning-subtle-fg">
          <WifiOff aria-hidden className="mt-0.5 size-4 shrink-0" />
          You’re offline. Showing data from 10:42.
        </div>
      </Page>
    ),
  },
};

/** Without navigation: e.g. a focused checkout flow. No menu button, no sidebar. */
export const Empty: Story = {
  args: { navigation: undefined, children: <Page /> },
};

/** Overflow: long page content scrolls the page; the top bar and sidebar stay put. */
export const Overflow: Story = {
  args: {
    children: (
      <Page>
        {Array.from({ length: 12 }, (_, i) => (
          <Card key={i}>
            <p className="text-md text-fg">Checkout {i + 1} — 3 items, $74.00, abandoned 2 hours ago.</p>
          </Card>
        ))}
      </Page>
    ),
  },
};
