import { renderWithProviders } from '@repo/testing';
import { describe, expect, it } from 'vitest';
import { DescriptionList } from './description-list';

describe('DescriptionList', () => {
  it.each(['stacked', 'inline'] as const)('renders a real dl with dt/dd pairs (%s)', (layout) => {
    const { container } = renderWithProviders(
      <DescriptionList
        layout={layout}
        items={[
          { term: 'Order', description: '#1042' },
          { term: 'Phone', description: '' },
        ]}
      />,
    );
    const dl = container.querySelector('dl');
    expect(dl).not.toBeNull();
    const terms = dl!.querySelectorAll('dt');
    const values = dl!.querySelectorAll('dd');
    expect(Array.from(terms, (t) => t.textContent)).toEqual(['Order', 'Phone']);
    expect(Array.from(values, (d) => d.textContent)).toEqual(['#1042', '—']);
    // Each pair shares a wrapper, so term and value stay together.
    expect(terms[0]!.nextElementSibling).toBe(values[0]);
  });
});
