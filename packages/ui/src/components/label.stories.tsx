import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './input';
import { Label } from './label';

const meta = {
  title: 'primitives/Label',
  component: Label,
  args: { children: 'Product title', htmlFor: 'label-demo' },
  argTypes: {
    children: { control: 'text', description: 'The control’s name. Short and specific: “Tax ID”, not “Enter your tax ID here”.', table: { type: { summary: 'ReactNode' } } },
    htmlFor: { control: 'text', description: 'Id of the control it names. Field sets this for you.', table: { type: { summary: 'string' } } },
    required: {
      control: 'boolean',
      description: 'Shows an asterisk, hidden from assistive technology — the control carries `required`, so it’s announced once.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    optional: {
      control: 'text',
      description: '`true` shows “(optional)”; a string replaces that text (for localisation). Ignored when `required`.',
      table: { type: { summary: 'boolean | string' } },
    },
    disabled: { control: 'boolean', description: 'Mutes the label to match a disabled control.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    visuallyHidden: {
      control: 'boolean',
      description: 'Hides the label visually but keeps it as the accessible name.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex w-80 flex-col gap-1.5">
        <Story />
        <Input id="label-demo" />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: [
          'The visible name of a form control (Radix Label).',
          '',
          '**Use** for every control. Usually you want Field, which renders the Label and wires ids for you.',
          '',
          '**Don’t use** a placeholder in place of a label (it disappears as you type), and don’t use Label for headings or plain text — use Text. Mark the minority: in a mostly-required form mark optional fields, and vice versa.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The asterisk is `aria-hidden`; the control’s own `required` is what gets announced. */
export const Required: Story = { args: { required: true } };

export const Optional: Story = { args: { optional: true, children: 'Company' } };

export const Disabled: Story = { args: { disabled: true } };

export const VisuallyHidden: Story = { args: { visuallyHidden: true, children: 'Search orders' } };

/** Overflow: long labels wrap; the asterisk stays with the last word’s line. */
export const Overflow: Story = {
  args: {
    required: true,
    children: 'Harmonized System code for customs declarations on international shipments',
  },
};
