import { renderWithProviders, screen } from '@repo/testing';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './input';

describe('Input', () => {
  it('clears an uncontrolled value, fires onChange and onClear, and refocuses', async () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    const { user } = renderWithProviders(
      <Input aria-label="Title" clearable defaultValue="Linen" onChange={onChange} onClear={onClear} />,
    );
    const input = screen.getByRole('textbox', { name: 'Title' });
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(input).toHaveValue('');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(input).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('clears a controlled value through onChange', async () => {
    function Controlled() {
      const [value, setValue] = useState('Sale');
      return <Input aria-label="Tag" clearable value={value} onChange={(e) => setValue(e.target.value)} />;
    }
    const { user } = renderWithProviders(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByRole('textbox', { name: 'Tag' })).toHaveValue('');
  });

  it('shows the clear button only once there is a value, and not when read-only', async () => {
    const { user, rerender } = renderWithProviders(<Input aria-label="Title" clearable />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
    await user.type(screen.getByRole('textbox'), 'a');
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    rerender(<Input aria-label="Title" clearable readOnly defaultValue="a" />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('clears a search field on Escape', async () => {
    const { user } = renderWithProviders(<Input type="search" aria-label="Search" defaultValue="1042" />);
    const input = screen.getByRole('searchbox', { name: 'Search' });
    await user.click(input);
    await user.keyboard('{Escape}');
    expect(input).toHaveValue('');
  });

  it('describes the character count', async () => {
    const { user } = renderWithProviders(<Input aria-label="SEO" maxLength={10} showCharacterCount />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'abc');
    expect(input).toHaveAccessibleDescription('3 of 10 characters');
  });
});
