import { renderWithProviders, screen } from '@repo/testing';
import { describe, expect, it } from 'vitest';
import { List } from './list';

describe('List', () => {
  it('renders an ol for numbered lists', () => {
    renderWithProviders(
      <List type="number" start={3}>
        <List.Item>One</List.Item>
        <List.Item>Two</List.Item>
      </List>,
    );
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(list).toHaveAttribute('start', '3');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders a ul for bullet lists', () => {
    renderWithProviders(
      <List>
        <List.Item>One</List.Item>
      </List>,
    );
    expect(screen.getByRole('list').tagName).toBe('UL');
  });
});
