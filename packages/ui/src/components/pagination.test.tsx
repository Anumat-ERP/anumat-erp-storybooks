import { fireEvent, renderWithProviders, screen } from '@repo/testing';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './pagination';

describe('Pagination', () => {
  it('is a labelled nav and disables previous on the first page', async () => {
    const onNext = vi.fn();
    const { user } = renderWithProviders(
      <Pagination aria-label="Orders pagination" page={1} pageCount={14} hasNext onNext={onNext} />,
    );
    expect(screen.getByRole('navigation', { name: 'Orders pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByText('Page 1 of 14')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('formats a range label', () => {
    renderWithProviders(<Pagination range={{ from: 51, to: 100, total: 1284, resourceName: 'orders' }} />);
    expect(screen.getByText('Showing 51–100 of 1,284 orders')).toBeInTheDocument();
  });

  it('responds to j/k only when shortcuts are on and not while typing', () => {
    const onNext = vi.fn();
    const onPrevious = vi.fn();
    renderWithProviders(
      <>
        <input aria-label="Search" />
        <Pagination keyboardShortcuts hasNext hasPrevious onNext={onNext} onPrevious={onPrevious} />
      </>,
    );
    fireEvent.keyDown(document.body, { key: 'j' });
    fireEvent.keyDown(document.body, { key: 'k' });
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Search' }), { key: 'j' });
    expect(onNext).toHaveBeenCalledOnce();
    expect(onPrevious).toHaveBeenCalledOnce();
  });
});
