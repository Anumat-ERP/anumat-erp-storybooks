import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Field } from './field';
import { Textarea } from './textarea';

const LONG =
  'Relaxed-fit shirt in washed European linen. Cut a little longer at the back, with a curved hem that works tucked or untucked. Mother-of-pearl buttons, a single chest pocket and a soft collar that doesn’t need ironing. Pre-washed, so it won’t shrink further. Machine wash cold with similar colours; line dry in the shade.';

const meta = {
  title: 'primitives/Textarea',
  component: Textarea,
  args: { 'aria-label': 'Description', placeholder: 'Describe the product', onChange: fn() },
  argTypes: {
    rows: {
      control: { type: 'number', min: 1 },
      description: 'Visible lines. With `autoGrow`, the minimum height.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '3' } },
    },
    autoGrow: {
      control: 'boolean',
      description: 'Grow with the content from `rows` to `maxRows`, then scroll. Removes the resize handle.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    maxRows: {
      control: { type: 'number', min: 1 },
      description: 'With `autoGrow`, the height in lines after which it scrolls. Unlimited when omitted.',
      table: { type: { summary: 'number' } },
    },
    invalid: {
      control: 'boolean',
      description: 'Critical border and `aria-invalid`. Inside a Field, set `error` on the Field instead.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: { control: 'boolean', description: 'Not editable, not focusable, not submitted.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    readOnly: { control: 'boolean', description: 'Not editable but focusable, selectable and submitted.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    maxLength: { control: 'number', description: 'Character limit (native).', table: { type: { summary: 'number' } } },
    showCharacterCount: {
      control: 'boolean',
      description: 'With `maxLength`, shows “120/500” under the textarea.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    placeholder: { control: 'text', description: 'An example, never the label.', table: { type: { summary: 'string' } } },
  },
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: [
          'A multi-line text field, optionally growing with its content.',
          '',
          '**Use** for text that may run to several sentences: notes, descriptions, addresses. Put it in a Field for its label and error. Use `autoGrow` with a `maxRows` so long text doesn’t push the page away.',
          '',
          '**Don’t use** for a single line (Input), for rich text or code, or for structured data like an address you’ll validate part by part (use several Inputs).',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InField: Story = {
  args: { 'aria-label': undefined },
  render: (args) => (
    <Field label="Order note" helpText="Only staff can see this.">
      <Textarea {...args} />
    </Field>
  ),
};

/** Auto-grow: starts at 2 lines, grows to 6, then scrolls. Type to see it. */
export const AutoGrow: Story = { args: { autoGrow: true, rows: 2, maxRows: 6, defaultValue: 'Relaxed-fit shirt in washed linen.' } };

export const CharacterCount: Story = {
  args: { maxLength: 320, showCharacterCount: true, defaultValue: LONG.slice(0, 180), autoGrow: true },
};

export const ErrorState: Story = {
  name: 'Error',
  args: { 'aria-label': undefined, defaultValue: 'Linen.' },
  render: (args) => (
    <Field label="Description" required error="Write at least 20 characters so customers know what they’re buying.">
      <Textarea {...args} />
    </Field>
  ),
};

export const Disabled: Story = {
  args: { 'aria-label': undefined, disabled: true, defaultValue: 'Imported from the supplier feed.' },
  render: (args) => (
    <Field label="Supplier description" helpText="Synced from the supplier. Edit it in the supplier feed." disabled>
      <Textarea {...args} />
    </Field>
  ),
};

export const ReadOnly: Story = {
  args: { 'aria-label': undefined, readOnly: true, defaultValue: 'Leave at the side door. The dog is friendly.' },
  render: (args) => (
    <Field label="Delivery instructions" helpText="Written by the customer at checkout.">
      <Textarea {...args} />
    </Field>
  ),
};

export const Permission: Story = {
  args: { 'aria-label': undefined, readOnly: true, defaultValue: 'Returns accepted within 30 days in original packaging.' },
  render: (args) => (
    <Field label="Return policy" helpText="Only store owners can change policies.">
      <Textarea {...args} />
    </Field>
  ),
};

/** Overflow: an unbroken string wraps instead of widening the box; long content scrolls past `maxRows`. */
export const Overflow: Story = {
  args: {
    autoGrow: true,
    rows: 3,
    maxRows: 5,
    defaultValue: `${LONG}\n\nhttps://example.com/very/long/url/without/any/spaces/that/would/otherwise/overflow/the/container/${'x'.repeat(60)}`,
  },
};
