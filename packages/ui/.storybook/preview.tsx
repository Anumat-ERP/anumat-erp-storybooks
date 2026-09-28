import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect, type ReactNode } from 'react';
import '../src/styles/globals.css';

function ThemeRoot({ theme, children }: { theme: 'light' | 'dark'; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  return children;
}

const withTheme: Decorator = (Story, context) => (
  <ThemeRoot theme={context.globals.theme === 'dark' ? 'dark' : 'light'}>
    <Story />
  </ThemeRoot>
);

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    a11y: { test: 'error' },
    options: {
      storySort: {
        order: ['foundations', 'primitives', 'components', 'patterns', 'product'],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
