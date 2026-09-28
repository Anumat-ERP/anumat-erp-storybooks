import type { Meta, StoryObj } from '@storybook/react-vite';
import { scales } from '../lib/tokens.generated';
import { Section, TokenName } from './swatch';

const meta = {
  title: 'foundations/Radius & shadows',
  parameters: {
    docs: {
      description: {
        component:
          'Controls use `rounded-md`, cards `rounded-lg`. Elevation is mostly borders; shadows mark things floating above the page — `xs` on cards, `md` on popovers and menus, `lg` on dialogs.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Radius: Story = {
  render: () => (
    <Section title="Radius">
      <div className="flex flex-wrap gap-6">
        {Object.entries(scales.radius).map(([name, value]) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <span
              className="block size-20 border border-border-strong bg-surface"
              style={{ borderRadius: `var(--a-radius-${name})` }}
            />
            <TokenName>rounded-{name}</TokenName>
            <span className="font-mono text-xs text-fg-muted">{value}</span>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const Shadows: Story = {
  render: () => (
    <Section title="Shadows">
      <div className="flex flex-wrap gap-8 bg-bg p-6">
        {Object.keys(scales.shadow).map((name) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <span
              className="block h-20 w-32 rounded-lg border border-border bg-surface"
              style={{ boxShadow: `var(--a-shadow-${name})` }}
            />
            <TokenName>shadow-{name}</TokenName>
          </div>
        ))}
      </div>
    </Section>
  ),
};
