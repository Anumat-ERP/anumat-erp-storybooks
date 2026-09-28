import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '../components/text';
import { scales } from '../lib/tokens.generated';
import { Section, TokenName, TokenTable } from './swatch';

const meta = {
  title: 'foundations/Typography',
  parameters: {
    docs: {
      description: {
        component:
          'Type scale and weights. Body copy is `text-md` (14px). Use the `Text` component’s variants rather than combining sizes and weights ad hoc.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <Section title="Sizes" description="Each size carries its own line height.">
      <TokenTable columns={['Utility', 'Size / line', 'Sample']}>
        {Object.entries(scales.text).map(([name, [size, line]]) => (
          <tr key={name} className="border-b border-border-subtle">
            <td className="py-3 pe-4"><TokenName>text-{name}</TokenName></td>
            <td className="py-3 pe-4 font-mono text-xs text-fg-muted">{size} / {line}</td>
            <td className="py-3 pe-4" style={{ fontSize: `var(--a-text-${name})`, lineHeight: `var(--a-text-${name}-line-height)` }}>
              Invoice INV-1042 is overdue
            </td>
          </tr>
        ))}
      </TokenTable>
    </Section>
  ),
};

export const Weights: Story = {
  render: () => (
    <Section title="Weights">
      <div className="flex flex-col gap-2">
        {Object.entries(scales['font-weight']).map(([name, value]) => (
          <p key={name} style={{ fontWeight: Number(value) }}>
            <TokenName>font-{name}</TokenName> — Purchase order approved ({value})
          </p>
        ))}
      </div>
    </Section>
  ),
};

export const TextVariants: Story = {
  name: 'Text variants',
  render: () => (
    <Section title="Text component variants" description="`variant` sets the look; `as` sets the element, so the outline stays correct.">
      <div className="flex flex-col gap-3">
        {(['display', 'heading', 'title', 'subtitle', 'body', 'bodySm', 'caption', 'label', 'mono'] as const).map((v) => (
          <div key={v} className="flex items-baseline gap-4">
            <span className="w-20 shrink-0 text-xs text-fg-subtle">{v}</span>
            <Text variant={v} as="span">Stock transfer to Warehouse B</Text>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const Families: Story = {
  render: () => (
    <Section title="Families" description="System stacks: no web-font download, native rendering on every OS.">
      {Object.entries(scales.font).map(([name, stack]) => (
        <div key={name} className="flex flex-col gap-1 py-2">
          <TokenName>font-{name}</TokenName>
          <p className="text-xl" style={{ fontFamily: `var(--a-font-${name})` }}>SKU-00421 · 1,284 units · $18,420.50</p>
          <p className="font-mono text-xs text-fg-muted">{stack}</p>
        </div>
      ))}
    </Section>
  ),
};
