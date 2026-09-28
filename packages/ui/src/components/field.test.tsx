import { renderWithProviders, screen } from '@repo/testing';
import { describe, expect, it } from 'vitest';
import { Checkbox } from './checkbox';
import { Field } from './field';
import { Input } from './input';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Select } from './select';
import { Textarea } from './textarea';

function describedByText(el: HTMLElement) {
  return (el.getAttribute('aria-describedby') ?? '')
    .split(' ')
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent);
}

describe('Field', () => {
  it('labels the control and links help text', () => {
    renderWithProviders(
      <Field label="Title" helpText="Shown on the storefront.">
        <Input />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Title' });
    expect(describedByText(input)).toEqual(['Shown on the storefront.']);
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('marks the control invalid and links the error before the help text', () => {
    renderWithProviders(
      <Field label="Price" helpText="Before tax." error="Enter a price above 0." required>
        <Input />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: /Price/ });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toBeRequired();
    expect(describedByText(input)).toEqual(['Error: Enter a price above 0.', 'Before tax.']);
  });

  it('keeps the control’s own aria-describedby', () => {
    renderWithProviders(
      <>
        <p id="extra">Extra</p>
        <Field label="Notes" error="Too short.">
          <Textarea aria-describedby="extra" />
        </Field>
      </>,
    );
    expect(describedByText(screen.getByRole('textbox', { name: 'Notes' }))).toEqual(['Error: Too short.', 'Extra']);
  });

  it('wires a native select', () => {
    renderWithProviders(
      <Field label="Country" error="Choose a country.">
        <Select placeholder="Select" options={[{ value: 'th', label: 'Thailand' }]} />
      </Field>,
    );
    const select = screen.getByRole('combobox', { name: 'Country' });
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(describedByText(select)).toEqual(['Error: Choose a country.']);
  });

  it('passes ids through a render-prop', () => {
    renderWithProviders(
      <Field label="Code" helpText="Letters only." error="Required.">
        {(control) => <input {...control} />}
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Code' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(describedByText(input)).toEqual(['Error: Required.', 'Letters only.']);
  });

  it('renders a fieldset for groups and describes the group, not each item', () => {
    renderWithProviders(
      <Field group label="Channels" helpText="Where it sells." error="Choose one." required>
        <Checkbox label="Online store" />
      </Field>,
    );
    const group = screen.getByRole('group', { name: /Channels/ });
    expect(describedByText(group)).toEqual(['Error: Choose one.', 'Where it sells.']);
    const checkbox = screen.getByRole('checkbox', { name: 'Online store' });
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).not.toHaveAttribute('aria-required');
  });

  it('names a RadioGroup by its legend', () => {
    renderWithProviders(
      <RadioGroup legend="Shipping" error="Choose a speed.">
        <RadioGroupItem value="a" label="Standard" helpText="3–5 days" />
      </RadioGroup>,
    );
    const radiogroup = screen.getByRole('radiogroup', { name: 'Shipping' });
    expect(radiogroup).toHaveAttribute('aria-invalid', 'true');
    expect(describedByText(screen.getByRole('radio', { name: 'Standard' }))).toEqual(['3–5 days']);
  });
});
