import type { Meta, StoryObj } from '@storybook/react-vite';
import { scales } from '../lib/tokens.generated';
import { Section, TokenName, TokenTable } from './swatch';

const meta = {
  title: 'foundations/Spacing',
  parameters: {
    docs: {
      description: {
        component:
          'A 4px grid. Tailwind’s spacing unit is one step, so `p-4` is 16px and `gap-2` is 8px. Controls share three heights so buttons, inputs and selects line up in a row.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <Section title="Space">
      <TokenTable columns={['Step', 'Value', '']}>
        {Object.entries(scales.space).map(([step, value]) => (
          <tr key={step} className="border-b border-border-subtle">
            <td className="py-2 pe-4"><TokenName>{`p-${step} · gap-${step}`}</TokenName></td>
            <td className="py-2 pe-4 font-mono text-xs text-fg-muted">{value}</td>
            <td className="py-2 pe-4">
              <span className="block h-3 rounded-sm bg-primary" style={{ width: value }} />
            </td>
          </tr>
        ))}
      </TokenTable>
    </Section>
  ),
};

export const ControlHeights: Story = {
  name: 'Control heights',
  render: () => (
    <Section title="Control heights" description="`h-control-sm | md | lg`">
      <div className="flex items-end gap-4">
        {Object.entries(scales.control).map(([name, value]) => (
          <div key={name} className="flex flex-col items-center gap-1">
            <span className="block w-16 rounded-md border border-border-strong bg-surface" style={{ height: value }} />
            <span className="text-xs text-fg-muted">{name} · {value}</span>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const Breakpoints: Story = {
  render: () => (
    <Section title="Breakpoints" description="Mobile first: `md:` applies from 48rem up.">
      <TokenTable columns={['Prefix', 'Min width']}>
        {Object.entries(scales.breakpoint).map(([name, value]) => (
          <tr key={name} className="border-b border-border-subtle">
            <td className="py-2 pe-4"><TokenName>{name}:</TokenName></td>
            <td className="py-2 pe-4 font-mono text-xs text-fg-muted">{value}</td>
          </tr>
        ))}
      </TokenTable>
    </Section>
  ),
};
