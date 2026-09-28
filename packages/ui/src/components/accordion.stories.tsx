import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import { AlertTriangle, Lock, WifiOff } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, type AccordionProps } from './accordion';

/** Flattened args: Radix types `single` and `multiple` as a union, which controls can't express. */
interface Args {
  type: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  variant?: 'card' | 'flush';
  disabled?: boolean;
}

const props = (args: Args, overrides: Partial<Args> = {}) => ({ ...args, ...overrides }) as unknown as AccordionProps;
import { Card } from './card';

const faqs = [
  {
    value: 'returns',
    q: 'How long do customers have to return an item?',
    a: 'Returns are accepted within 30 days of delivery. Change the window in Settings › Returns.',
  },
  {
    value: 'exchanges',
    q: 'Can customers exchange instead of refunding?',
    a: 'Yes. Exchanges create a new order linked to the return and keep the original payment.',
  },
  {
    value: 'fees',
    q: 'Do you charge a restocking fee?',
    a: 'Only if you set one. Fees are deducted from the refund and shown on the customer’s receipt.',
  },
];

const meta = {
  title: 'components/Accordion',
  component: Accordion as unknown as ComponentType<Args>,
  args: { type: 'single', collapsible: true, defaultValue: 'returns', variant: 'card' },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['single', 'multiple'],
      description: '`single`: one section open at a time. `multiple`: any number open; `value`/`defaultValue` become arrays.',
      table: { type: { summary: "'single' | 'multiple'" } },
    },
    collapsible: {
      control: 'boolean',
      description: 'With `type="single"`, allow closing the open section so all are closed.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    defaultValue: {
      control: 'text',
      description: 'Initially open section(s): a string for `single`, a string array for `multiple`.',
      table: { type: { summary: 'string | string[]' } },
    },
    variant: {
      control: 'inline-radio',
      options: ['card', 'flush'],
      description: '`card` draws a bordered surface; `flush` only divides sections — for use inside a Card.',
      table: { type: { summary: "'card' | 'flush'" }, defaultValue: { summary: 'card' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable every section.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
  },
  render: (args) => (
    <div className="max-w-xl">
      <Accordion {...props(args)}>
        {faqs.map((f) => (
          <AccordionItem key={f.value} value={f.value}>
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent>{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component: [
          'Headed sections that expand and collapse, with a height transition. Built on Radix Accordion: each trigger is a button inside a heading (`headingAs`, default `h3`) with `aria-expanded`; arrow keys move between triggers.',
          '',
          '**Use** for FAQs, grouped settings and long detail pages where merchants scan headings and open one or two. `type="single"` keeps one open; `type="multiple"` lets several open.',
          '',
          '**Don’t use** to hide content every merchant needs, for a single region (use Collapsible), or for switching between views (use Tabs). Don’t nest accordions.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Multiple: Story = {
  args: { type: 'multiple', defaultValue: ['returns', 'fees'], collapsible: undefined },
};

export const FlushInCard: Story = {
  args: { variant: 'flush' },
  render: (args) => (
    <Card flush className="max-w-xl">
      <h2 className="border-b border-border px-4 py-3 text-lg font-semibold">Returns policy</h2>
      <Accordion {...props(args)}>
        {faqs.map((f) => (
          <AccordionItem key={f.value} value={f.value}>
            <AccordionTrigger headingAs="h3">{f.q}</AccordionTrigger>
            <AccordionContent>{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  ),
};

export const WithSuffix: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <Accordion {...props(args, { defaultValue: 'shipping' })}>
        <AccordionItem value="shipping">
          <AccordionTrigger suffix="3 zones">Shipping</AccordionTrigger>
          <AccordionContent>Domestic, Europe and Rest of world.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="taxes">
          <AccordionTrigger suffix="Not set up">Taxes</AccordionTrigger>
          <AccordionContent>Set up tax collection for the regions you sell in.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

/** Loading: section content being fetched shows placeholders inside the open section. */
export const Loading: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <Accordion {...props(args)}>
        <AccordionItem value="returns">
          <AccordionTrigger>Return reasons</AccordionTrigger>
          <AccordionContent>
            <div aria-busy="true" aria-label="Loading return reasons" className="flex flex-col gap-2">
              {[70, 55, 62].map((w) => (
                <div key={w} className="h-3 animate-pulse rounded-sm bg-skeleton" style={{ width: `${w}%` }} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="other">
          <AccordionTrigger>Return fees</AccordionTrigger>
          <AccordionContent>…</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const ErrorState: Story = {
  name: 'Error',
  render: (args) => (
    <div className="max-w-xl">
      <Accordion {...props(args)}>
        <AccordionItem value="returns">
          <AccordionTrigger>Return reasons</AccordionTrigger>
          <AccordionContent>
            <p role="alert" className="flex items-start gap-2 text-critical-subtle-fg">
              <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
              Return reasons couldn’t be loaded. Refresh to try again.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

/** Permission: a section the merchant can’t open is disabled, and its heading says why. */
export const Permission: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <Accordion {...props(args)}>
        <AccordionItem value="returns">
          <AccordionTrigger>Return window</AccordionTrigger>
          <AccordionContent>30 days from delivery.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="payouts" disabled>
          <AccordionTrigger suffix={<Lock aria-label="Store owners only" className="size-4" />}>Refund payouts</AccordionTrigger>
          <AccordionContent>Hidden</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Offline: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <Accordion {...props(args)}>
        <AccordionItem value="returns">
          <AccordionTrigger>Return window</AccordionTrigger>
          <AccordionContent>
            <p className="flex items-start gap-2 text-fg-muted">
              <WifiOff aria-hidden className="mt-0.5 size-4 shrink-0" />
              You’re offline. Showing settings saved at 10:42.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

/** Empty: a section with nothing in it says so rather than opening blank. */
export const Empty: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <Accordion {...props(args, { defaultValue: 'rules' })}>
        <AccordionItem value="rules">
          <AccordionTrigger suffix="0">Automatic return rules</AccordionTrigger>
          <AccordionContent>
            <p className="text-fg-muted">No rules yet. Add a rule to approve simple returns automatically.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

/** Overflow: long headings wrap; the chevron stays put at the end. */
export const Overflow: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <Accordion {...props(args, { defaultValue: 'long' })}>
        <AccordionItem value="long">
          <AccordionTrigger>
            What happens to loyalty points, gift card balances and store credit when a partially refunded wholesale order is exchanged?
          </AccordionTrigger>
          <AccordionContent>
            {Array.from({ length: 3 }, (_, i) => (
              <p key={i} className="mb-2 last:mb-0">
                Points are reversed in proportion to the refunded amount; gift card balances are restored to the original card, and
                store credit is re-issued with its original expiry date.
              </p>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
