import type { Meta, StoryObj } from '@storybook/react-vite';
import { StickyNote } from 'lucide-react';
import { Card, CardHeader } from './card';
import { ExceptionList } from './exception-list';
import { SkeletonText } from './skeleton';
import { Stack } from './stack';

const meta = {
  title: 'components/ExceptionList',
  component: ExceptionList,
  args: {
    items: [
      { tone: 'critical', title: 'High risk of fraud.', description: 'The billing and shipping countries don’t match.' },
      { tone: 'warning', title: 'Address unverified.', description: 'The postcode wasn’t found.' },
      { icon: <StickyNote />, title: 'Note from customer:', description: 'Please leave with the neighbour at no. 12.' },
    ],
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'The exceptions. Rendered as a `<ul>`, so “list, 3 items” is announced first.',
      table: {
        type: {
          summary:
            "{ id?: string; icon?: ReactNode; tone?: 'default' | 'warning' | 'critical'; title?: ReactNode; description?: ReactNode }[]",
        },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A compact list of what’s unusual about an object: a high-risk order, an unverified address, a note from the customer.',
          '',
          'It’s a `<ul>`, so a screen reader announces the count before the contents. Tone shows in the icon and text colour, but the title must still say what’s wrong.',
          '',
          '**Use** in cards and sidebars beside the object it describes. **Don’t use** for page-level problems (Banner), transient feedback (toast), or as a general bullet list (List).',
        ].join('\n'),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExceptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InCard: Story = {
  render: (args) => (
    <Card className="flex flex-col gap-3">
      <CardHeader title="Order #1042" headingAs="h2" />
      <ExceptionList {...args} />
    </Card>
  ),
};

export const TitleOnly: Story = {
  args: {
    items: [{ tone: 'warning', title: 'Partially refunded' }, { title: 'Gift order' }],
  },
};

export const EmptyFirstRun: Story = {
  render: () => <p className="text-sm text-fg-muted">No flags yet. Risk checks run when the first payment is captured.</p>,
};

export const EmptyFiltered: Story = {
  render: () => <p className="text-sm text-fg-muted">No critical issues. 2 notes are hidden by the “Critical only” filter.</p>,
};

export const EmptyCleared: Story = {
  render: () => <p className="text-sm text-fg-muted">No issues with this order.</p>,
};

export const Loading: Story = {
  render: () => (
    <Stack gap={2}>
      <span role="status" className="sr-only">
        Checking order…
      </span>
      <SkeletonText lines={2} size="sm" />
    </Stack>
  ),
};

export const ErrorState: Story = {
  name: 'Error',
  args: { items: [{ tone: 'critical', title: 'Couldn’t run fraud analysis.', description: 'Reload to try again.' }] },
};

export const Permission: Story = {
  args: { items: [{ title: 'Risk details hidden.', description: 'You need the “View risk analysis” permission.' }] },
};

export const Offline: Story = {
  args: { items: [{ tone: 'warning', title: 'Offline.', description: 'Risk analysis is from your last connection at 14:05.' }] },
};

export const Overflow: Story = {
  args: {
    items: [
      {
        tone: 'critical',
        title: 'Card verification failed for payment method ending in 4242 issued by an overseas bank.',
        description:
          'The issuer returned AVS_MISMATCH_POSTAL_CODE_AND_STREET_ADDRESS_DO_NOT_MATCH_RECORDS_ON_FILE for this transaction.',
      },
    ],
  },
  render: (args) => (
    <div className="w-64">
      <ExceptionList {...args} />
    </div>
  ),
};
