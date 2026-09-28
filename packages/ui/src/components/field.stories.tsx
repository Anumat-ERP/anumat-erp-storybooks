import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type FormEvent } from 'react';
import { Button } from './button';
import { Card, CardFooter, CardHeader } from './card';
import { Checkbox } from './checkbox';
import { Field, FieldError } from './field';
import { Input } from './input';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Select } from './select';
import { Stack } from './stack';
import { Textarea } from './textarea';

const meta = {
  title: 'primitives/Field',
  component: Field,
  args: {
    label: 'Product title',
    helpText: 'Shown to customers on the storefront and in receipts.',
    children: <Input placeholder="e.g. Linen shirt" />,
  },
  argTypes: {
    label: { control: 'text', description: 'The control’s visible name. Always set, even with `labelHidden`.', table: { type: { summary: 'ReactNode' } } },
    labelHidden: { control: 'boolean', description: 'Hide the label visually; it still names the control.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    helpText: { control: 'text', description: 'Guidance under the control, linked by `aria-describedby`.', table: { type: { summary: 'ReactNode' } } },
    error: {
      control: 'text',
      description: 'Validation message. Marks the control `aria-invalid` and links the message first in `aria-describedby`. Say how to fix it.',
      table: { type: { summary: 'ReactNode' } },
    },
    required: { control: 'boolean', description: 'Asterisk on the label and `required` on the control.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    optional: { control: 'text', description: '`true` shows “(optional)”; a string replaces it.', table: { type: { summary: 'boolean | string' } } },
    disabled: { control: 'boolean', description: 'Disables the control and mutes the label and help text.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    id: { control: 'text', description: 'Id for the control (generated when omitted). Set it here, not on the control.', table: { type: { summary: 'string' } } },
    group: {
      control: 'boolean',
      description: 'Render a `fieldset` + `legend` for a set of checkboxes or a RadioGroup.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    children: {
      control: false,
      description: 'The control. Our inputs read the ids from context; for others pass `(props) => <Control {...props} />`.',
      table: { type: { summary: 'ReactNode | (control: FieldControlProps) => ReactNode' } },
    },
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
          'Wraps one control with its label, help text and error, and wires them with ids: the label’s `for`, the control’s `aria-describedby` (error first, then help) and `aria-invalid`.',
          '',
          '**Use** around every Input, Textarea and Select, and with `group` around a set of checkboxes or a RadioGroup. Controls read the ids from context; any other control can take them from the render-prop.',
          '',
          '**Don’t use** for a single Checkbox or Switch — they carry their own label. Don’t put two controls in one non-group Field: the label can only name one. Errors are not live regions; on submit, move focus to the first invalid field (or an error summary) instead.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = { args: { required: true } };

export const Optional: Story = { args: { optional: true, label: 'Vendor', helpText: undefined } };

/** Error: critical tone, an icon and a hidden “Error:” prefix — never colour alone. */
export const ErrorState: Story = {
  name: 'Error',
  args: { required: true, error: 'Enter a product title. Customers see it on the storefront.' },
};

export const Disabled: Story = { args: { disabled: true, children: <Input defaultValue="Linen shirt" /> } };

/** Read-only values stay selectable and are still submitted; say why they can’t be changed. */
export const ReadOnly: Story = {
  args: {
    label: 'Order number',
    helpText: 'Assigned when the order is placed.',
    children: <Input readOnly defaultValue="#1042" />,
  },
};

/** Permission: the value is visible but locked, with the reason in the help text. */
export const Permission: Story = {
  args: {
    label: 'Cost per item',
    helpText: 'Only staff with “View costs” permission can edit this.',
    children: <Input readOnly defaultValue="12.40" prefix="$" />,
  },
};

/** Overflow: long labels, help and errors wrap inside the column. */
export const Overflow: Story = {
  args: {
    required: true,
    label: 'Harmonized System code used on customs declarations for international shipments',
    helpText:
      'Customs authorities use this six-to-ten digit code to classify the product. Find it in your country’s tariff schedule or ask your broker.',
    error: 'Enter a code of 6 to 10 digits without dots or spaces, e.g. 620520 — the value entered has 13 characters.',
    children: <Input defaultValue="6205.20.0000A" />,
  },
};

/** Group: a fieldset and legend for a set of checkboxes. The description is on the fieldset. */
export const Group: Story = {
  args: {
    group: true,
    label: 'Notify me when',
    helpText: 'Emails go to the store contact address.',
    children: (
      <Stack gap={2}>
        <Checkbox label="An order is placed" defaultChecked />
        <Checkbox label="A payment fails" defaultChecked />
        <Checkbox label="Stock runs low" />
      </Stack>
    ),
  },
};

/** Render-prop: wire a control that doesn’t read Field context. */
export const RenderProp: Story = {
  args: {
    label: 'Discount code',
    helpText: 'Letters and numbers only.',
    children: (control) => (
      <input
        {...control}
        className="h-control-md rounded-md border border-border-input bg-surface px-3 text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
    ),
  },
};

/**
 * A full form. Submit it empty to see validation: every field gets a message
 * that says how to fix it, and focus moves to the first invalid field.
 */
export const ComposedForm: Story = {
  args: { label: '', children: null },
  parameters: { controls: { disable: true } },
  render: function ComposedFormStory() {
    const [errors, setErrors] = useState<Record<string, string>>({
      name: 'Enter a product name.',
      price: 'Enter a price of 0.01 or more.',
      category: 'Choose a category.',
      description: 'Description must be at least 20 characters. It has 6.',
      channels: 'Choose at least one sales channel.',
      shipping: 'Choose how this product ships.',
      terms: 'Confirm the product meets the listing policy.',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const next: Record<string, string> = {};
      if (!String(data.get('name') ?? '').trim()) next.name = 'Enter a product name.';
      if (!(Number(data.get('price')) > 0)) next.price = 'Enter a price of 0.01 or more.';
      if (!data.get('category')) next.category = 'Choose a category.';
      const description = String(data.get('description') ?? '');
      if (description.length < 20) next.description = `Description must be at least 20 characters. It has ${description.length}.`;
      if (data.getAll('channels').length === 0) next.channels = 'Choose at least one sales channel.';
      if (!data.get('shipping')) next.shipping = 'Choose how this product ships.';
      if (!data.get('terms')) next.terms = 'Confirm the product meets the listing policy.';
      setErrors(next);
      const first = event.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus();
    };

    const count = Object.keys(errors).length;

    return (
      <Card className="w-[36rem] max-w-full">
        <form noValidate onSubmit={onSubmit} aria-labelledby="new-product" className="flex flex-col gap-5">
          <CardHeader title={<span id="new-product">New product</span>} description="Fill in the basics. You can add images later." />
          {count > 0 ? (
            <FieldError className="rounded-md border border-critical-border bg-critical-subtle p-3">
              {count === 1 ? 'Fix 1 field to save the product.' : `Fix ${count} fields to save the product.`}
            </FieldError>
          ) : null}
          <Field label="Name" required error={errors.name}>
            <Input name="name" defaultValue="" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price" required error={errors.price} helpText="Before tax.">
              <Input name="price" inputMode="decimal" prefix="$" suffix="USD" defaultValue="0" />
            </Field>
            <Field label="Category" required error={errors.category}>
              <Select
                name="category"
                placeholder="Choose a category"
                options={[
                  { label: 'Apparel', options: [{ value: 'shirts', label: 'Shirts' }, { value: 'trousers', label: 'Trousers' }] },
                  { label: 'Home', options: [{ value: 'linen', label: 'Bed linen' }, { value: 'kitchen', label: 'Kitchen' }] },
                ]}
              />
            </Field>
          </div>
          <Field label="Description" error={errors.description} helpText="Customers read this on the product page.">
            <Textarea name="description" defaultValue="Linen." maxLength={500} showCharacterCount autoGrow rows={3} maxRows={8} />
          </Field>
          <Field group label="Sales channels" required error={errors.channels}>
            <Stack gap={2}>
              <Checkbox name="channels" value="online" label="Online store" />
              <Checkbox name="channels" value="pos" label="Point of sale" helpText="Available in all 3 retail locations." />
            </Stack>
          </Field>
          <RadioGroup name="shipping" legend="Shipping" required error={errors.shipping}>
            <RadioGroupItem value="physical" label="Physical product" helpText="Weight and dimensions are needed for rates." />
            <RadioGroupItem value="digital" label="Digital product or service" helpText="No shipping required." />
          </RadioGroup>
          <Field group label="Listing policy" labelHidden error={errors.terms}>
            <Checkbox name="terms" value="yes" label="This product meets the marketplace listing policy" />
          </Field>
          <CardFooter>
            <Button type="reset" onClick={() => setErrors({})}>
              Discard
            </Button>
            <Button type="submit" variant="primary">
              Save product
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  },
};
