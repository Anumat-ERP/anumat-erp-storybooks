import type { NextConfig } from 'next';

const config: NextConfig = {
  // @repo/ui ships TypeScript source; Next compiles it like app code.
  transpilePackages: ['@repo/ui'],
};

export default config;
