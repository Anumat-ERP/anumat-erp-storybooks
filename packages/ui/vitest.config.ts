import { createVitestConfig } from '@repo/test-config/vitest';

export default createVitestConfig({ include: ['src/**/*.test.{ts,tsx}'] });
