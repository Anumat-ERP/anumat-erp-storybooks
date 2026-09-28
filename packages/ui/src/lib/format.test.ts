import { describe, expect, it } from 'vitest';
import { formatDuration, pluralize } from './format';

describe('formatDuration', () => {
  it('pairs the visual form with a spoken form', () => {
    expect(formatDuration(151)).toEqual({ visual: '2:31', spoken: '2 minutes 31 seconds' });
  });
  it('handles hours and singulars', () => {
    expect(formatDuration(3661)).toEqual({ visual: '1:01:01', spoken: '1 hour 1 minute 1 second' });
  });
  it('handles zero', () => {
    expect(formatDuration(0).spoken).toBe('0 seconds');
  });
});

describe('pluralize', () => {
  it('formats counts', () => {
    expect(pluralize(1, 'order')).toBe('1 order');
    expect(pluralize(1284, 'order')).toBe('1,284 orders');
  });
});
