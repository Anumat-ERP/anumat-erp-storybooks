import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleCheck, Plus, SearchX } from 'lucide-react';
import { fn } from 'storybook/test';
import { Button } from './button';
import { Card, CardHeader } from './card';
import { EmptyState } from './empty-state';

const meta = {
  title: 'components/EmptyState',
  component: EmptyState,
  args: {
    heading: 'Create your first product',
    children: 'Add the things you sell. You can import a spreadsheet or add products one at a time.',
    size: 'page',
    headingAs: 'h2',
  },
  argTypes: {
    heading: {
      control: 'text',
      description: 'What’s empty and why, in the user’s words. Match it to the kind of empty (see docs).',
      table: { type: { summary: 'ReactNode' } },
    },
    headingAs: {
      control: 'inline-radio',
      options: ['h1', 'h2', 'h3', 'h4'],
      description: 'Heading element, for the document outline.',
      table: { type: { summary: "'h1' | 'h2' | 'h3' | 'h4'" }, defaultValue: { summary: 'h2' } },
    },
    children: {
      control: 'text',
      description: 'One or two sentences: why it’s empty and what the action gives them.',
      table: { type: { summary: 'ReactNode' } },
    },
    image: {
      control: false,
      description: 'Illustration. Defaults to a simple token-coloured box; `null` for none.',
      table: { type: { summary: 'ReactNode | null' } },
    },
    action: {
      control: false,
      description: 'The main way out — a primary Button. For filtered empties, “Clear filters”.',
      table: { type: { summary: 'ReactNode' } },
    },
    secondaryAction: {
      control: false,
      description: 'A lesser alternative — a secondary or plain Button.',
      table: { type: { summary: 'ReactNode' } },
    },
    footer: {
      control: 'text',
      description: 'Small print under the actions: a help link, a permissions note.',
      table: { type: { summary: 'ReactNode' } },
    },
    size: {
      control: 'inline-radio',
      options: ['page', 'card'],
      description: '`page` fills a page’s main area; `card` is compact for inside a Card or table.',
      table: { type: { summary: "'page' | 'card'" }, defaultValue: { summary: 'page' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Explains why there’s nothing here and offers the way forward. There are three different empties, and the copy must match:',
          '',
          '- **First run** (`EmptyFirstRun`) — nothing has ever been created. Explain the value; offer “Create your first …”.',
          '- **Filtered** (`EmptyFiltered`) — data exists but filters or search hide it. Say “No … match these filters”; offer “Clear filters”. **Never** “create your first” — it reads as data loss.',
          '- **Cleared** (`EmptyCleared`) — the user finished everything. “All caught up”; often no action.',
          '',
          '**Don’t use** for loading (Skeleton) or errors (Banner), or to fill space on a page that has content.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    action: (
      <Button variant="primary" icon={<Plus />} onClick={fn()}>
        Add product
      </Button>
    ),
    secondaryAction: <Button onClick={fn()}>Import</Button>,
  },
};

/** First run: nothing has ever existed. Sell the value; offer to create. */
export const EmptyFirstRun: Story = {
  args: {
    heading: 'Create your first product',
    children: 'Add the things you sell. You can import a spreadsheet or add products one at a time.',
    action: (
      <Button variant="primary" icon={<Plus />}>
        Add product
      </Button>
    ),
    secondaryAction: <Button>Import products</Button>,
    footer: (
      <a href="#help" className="text-fg-link underline underline-offset-2">
        Learn about adding products
      </a>
    ),
  },
};

/** Filtered: data exists, the filters hide it. Offer to clear them — never “create your first”. */
export const EmptyFiltered: Story = {
  args: {
    heading: 'No products match these filters',
    children: 'Try changing the filters or search term. 1,284 products are hidden by “Status: Archived” and “Vendor: Acme”.',
    image: <SearchX aria-hidden className="size-12" strokeWidth={1.5} />,
    action: <Button variant="primary">Clear filters</Button>,
  },
};

/** Cleared: the user finished the work. Quiet confirmation, usually no action. */
export const EmptyCleared: Story = {
  args: {
    heading: 'All caught up',
    children: 'Every order has been fulfilled. New orders will show up here.',
    image: <CircleCheck aria-hidden className="size-12 text-success" strokeWidth={1.5} />,
    secondaryAction: <Button variant="plain">View fulfilled orders</Button>,
  },
};

export const InCard: Story = {
  args: {
    size: 'card',
    headingAs: 'h3',
    heading: 'No notes yet',
    children: 'Notes are visible to staff only.',
    image: null,
    action: <Button size="sm">Add note</Button>,
  },
  render: (args) => (
    <Card className="max-w-md">
      <CardHeader title="Notes" />
      <EmptyState {...args} />
    </Card>
  ),
};

/** Permission: the list may be non-empty, but this user can’t see it. Say so; don’t pretend it’s empty. */
export const Permission: Story = {
  args: {
    heading: 'You don’t have access to reports',
    children: 'Ask a store owner to give you the “View reports” permission.',
    image: null,
    action: <Button>Request access</Button>,
  },
};

export const Offline: Story = {
  args: {
    heading: 'You’re offline',
    children: 'Products you’ve opened recently are still available. Everything else loads when you reconnect.',
    image: null,
    action: <Button>Try again</Button>,
  },
};

export const Overflow: Story = {
  args: {
    heading: 'No products match “Extra-large reinforced canvas tote bag with interior zip pocket”',
    children:
      'Nothing matched https://store.example.com/admin/products?query=extra-large-reinforced-canvas-tote-bag-with-interior-zip-pocket. Check the spelling or try fewer words.',
    action: <Button variant="primary">Clear search</Button>,
  },
  render: (args) => (
    <div className="w-72 rounded-md border border-dashed border-border-strong">
      <EmptyState {...args} size="card" />
    </div>
  ),
};
