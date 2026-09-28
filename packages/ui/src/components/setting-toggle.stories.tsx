import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { FieldError } from './field';
import { Link } from './link';
import { SettingToggle } from './setting-toggle';

const meta = {
  title: 'primitives/SettingToggle',
  component: SettingToggle,
  args: {
    title: 'Automatic tax',
    description: 'Calculate sales tax at checkout from the customer’s address and your registrations.',
    enabled: false,
    onToggle: fn(),
  },
  argTypes: {
    title: { control: 'text', description: 'The setting’s name. Also used in the status line and the button’s accessible name.', table: { type: { summary: 'ReactNode' } } },
    headingAs: { control: 'inline-radio', options: ['h2', 'h3', 'h4'], description: 'Heading element for the page outline.', table: { type: { summary: "'h2' | 'h3' | 'h4'" }, defaultValue: { summary: 'h2' } } },
    description: { control: 'text', description: 'What the setting does.', table: { type: { summary: 'ReactNode' } } },
    enabled: { control: 'boolean', description: 'Whether it’s on, as confirmed by the server.', table: { type: { summary: 'boolean' } } },
    onToggle: { control: false, description: 'Button pressed: start the request and set `loading`.', table: { type: { summary: '() => void' } } },
    loading: {
      control: 'boolean',
      description: 'Request in flight: spinner on the button (size kept), clicks ignored.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: { control: 'boolean', description: 'Can’t be changed — explain why in `children`.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    status: { control: 'text', description: 'Replaces the default “{title} is on/off” line.', table: { type: { summary: 'ReactNode' } } },
    actionLabel: { control: 'text', description: 'Replaces “Turn on” / “Turn off”.', table: { type: { summary: 'ReactNode' } } },
    children: { control: false, description: 'Extra content under the status, e.g. an error or why it’s disabled.', table: { type: { summary: 'ReactNode' } } },
  },
  decorators: [(Story) => <div className="w-[36rem] max-w-full"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component: [
          'A setting changed by a request: title, description, a status line (“Automatic tax is **on**”) and a Button that turns it on or off.',
          '',
          '**Use** for store- or account-level settings saved on the server, where the change may take a moment or fail.',
          '',
          '**Why a button, not a switch:** a Switch means “applies instantly” — flipping it claims the change has already happened. Here the change only happens when the request succeeds, so the control is a Button that says what it will do, and the status line (a polite live region) confirms the result.',
          '',
          '**Don’t use** for instant local preferences (Switch) or options saved with a form (Checkbox).',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof SettingToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const On: Story = { args: { enabled: true } };

/** Interactive: the button shows a spinner while the (fake) request runs; the status updates when it settles. */
export const Interactive: Story = {
  render: function InteractiveStory(args) {
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    return (
      <SettingToggle
        {...args}
        enabled={enabled}
        loading={loading}
        onToggle={() => {
          setLoading(true);
          window.setTimeout(() => {
            setEnabled((e) => !e);
            setLoading(false);
          }, 1200);
        }}
      />
    );
  },
};

export const Loading: Story = { args: { loading: true } };

/** Error: the request failed — the state stays as it was and the reason sits under the status. */
export const ErrorState: Story = {
  name: 'Error',
  args: {
    children: (
      <FieldError role="alert" className="mt-1">
        Couldn’t turn on automatic tax. Add a tax registration first, then try again.
      </FieldError>
    ),
  },
};

export const Disabled: Story = {
  args: {
    enabled: true,
    disabled: true,
    children: <p className="text-sm text-fg-muted">Automatic tax is required while you sell in the EU.</p>,
  },
};

export const Permission: Story = {
  args: {
    disabled: true,
    children: (
      <p className="text-sm text-fg-muted">
        Only the store owner can change tax settings. <Link href="#request">Request access</Link>
      </p>
    ),
  },
};

export const Offline: Story = {
  args: {
    enabled: true,
    disabled: true,
    children: <p className="text-sm text-fg-muted">You’re offline. Reconnect to change this setting.</p>,
  },
};

/** Custom status and action, when the title doesn’t read as a sentence. */
export const CustomCopy: Story = {
  args: {
    title: 'Two-step login',
    description: 'Ask for a code from your authenticator app when you log in on a new device.',
    enabled: true,
    status: (
      <>
        Two-step login is <strong className="font-semibold">required</strong> for all staff
      </>
    ),
    actionLabel: 'Make optional',
  },
};

export const Overflow: Story = {
  args: {
    title: 'Automatic tax calculation for cross-border orders shipped from third-party logistics warehouses',
    description:
      'When on, tax is calculated from each warehouse’s registration and the customer’s address, including duties for orders over the de minimis threshold in each destination country.',
  },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};
