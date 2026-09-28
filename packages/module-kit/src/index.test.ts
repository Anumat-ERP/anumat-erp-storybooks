import { describe, expect, it } from 'vitest';
import { defineModule, validateManifest } from './index';

describe('module manifest', () => {
  it('accepts a valid manifest', () => {
    const m = defineModule({
      id: 'invoices',
      name: 'Invoices',
      version: '1.0.0',
      permissions: [{ key: 'invoices:read', description: 'View invoices' }],
    });
    expect(m.id).toBe('invoices');
  });

  it('rejects un-namespaced permissions', () => {
    expect(
      validateManifest({
        id: 'invoices',
        name: 'Invoices',
        version: '1.0.0',
        permissions: [{ key: 'orders:read', description: '' }],
      }),
    ).toHaveLength(1);
  });

  it('rejects self-dependency', () => {
    expect(() =>
      defineModule({ id: 'a', name: 'A', version: '0.1.0', dependsOn: ['a'] }),
    ).toThrow(/depend on itself/);
  });
});
