import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  // react-vite, never nextjs: the Next preset patches an SWC API Next 16
  // removed, and a UI package is framework-agnostic React anyway.
  framework: { name: '@storybook/react-vite', options: {} },
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  typescript: { reactDocgen: 'react-docgen-typescript' },
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(ts|tsx)',
    // Modules own their screens; without this glob their stories are dead code.
    '../../../modules/*/ui/**/*.stories.@(ts|tsx)',
  ],
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    return config;
  },
};

export default config;
