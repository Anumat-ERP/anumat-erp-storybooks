import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * Shared Vitest config. `setupFiles` points at @repo/testing, which installs
 * jest-dom matchers and the MSW server. Consumers still need a local
 * `vitest.d.ts` importing '@testing-library/jest-dom/vitest' so `tsc` sees the
 * matcher augmentation — the setup file lives in another package.
 */
export function createVitestConfig(overrides = {}) {
  return defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: false,
      css: false,
      setupFiles: ['@repo/testing/setup'],
      ...overrides,
    },
  });
}
