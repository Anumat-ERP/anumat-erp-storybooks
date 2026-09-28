import type { Meta, StoryObj } from '@storybook/react-vite';
import { colorTokens, palette, themes } from '../lib/tokens.generated';
import { Section, TokenName, TokenTable } from './swatch';

const meta = {
  title: 'foundations/Colors',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Semantic colour tokens. Components use only these — never the raw palette — so a theme can change every surface at once. Check here before adding a colour: if a role already exists, use it.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const GROUPS: { title: string; description: string; match: (name: string) => boolean }[] = [
  { title: 'Surfaces', description: 'Backgrounds, from the app canvas up.', match: (n) => n === 'bg' || n.startsWith('surface') || n === 'overlay' || n === 'skeleton' },
  { title: 'Borders', description: 'Lines between and around things; `ring` is the focus outline.', match: (n) => n.startsWith('border') || n === 'ring' },
  { title: 'Text', description: 'Foreground colours for copy and icons.', match: (n) => n.startsWith('fg') },
  ...(['primary', 'critical', 'success', 'warning', 'info'] as const).map((tone) => ({
    title: tone[0]!.toUpperCase() + tone.slice(1),
    description: `\`${tone}\` = solid fill, \`${tone}-fg\` = text on it, \`${tone}-subtle\`/\`-subtle-fg\`/\`-border\` = tinted surfaces.`,
    match: (n: string) => n === tone || n.startsWith(`${tone}-`),
  })),
];

export const Semantic: Story = {
  render: () => (
    <div>
      {GROUPS.map((g) => (
        <Section key={g.title} title={g.title} description={g.description}>
          <TokenTable columns={['', 'Token', 'Utility', 'Light', 'Dark']}>
            {colorTokens.filter(g.match).map((name) => (
              <tr key={name} className="border-b border-border-subtle">
                <td className="py-2 pe-4">
                  <span
                    className="block size-8 rounded-md border border-border"
                    style={{ background: `var(--a-color-${name})` }}
                  />
                </td>
                <td className="py-2 pe-4">
                  <TokenName>--a-color-{name}</TokenName>
                </td>
                <td className="py-2 pe-4 text-fg-muted">
                  bg-{name} · text-{name} · border-{name}
                </td>
                <td className="py-2 pe-4 font-mono text-xs text-fg-muted">{themes.light[name as keyof typeof themes.light]}</td>
                <td className="py-2 pe-4 font-mono text-xs text-fg-muted">{themes.dark[name as keyof typeof themes.dark]}</td>
              </tr>
            ))}
          </TokenTable>
        </Section>
      ))}
    </div>
  ),
};

export const Palette: Story = {
  parameters: {
    docs: { description: { story: 'Raw ramps the semantic tokens point at. Not available as utilities — by design.' } },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {Object.entries(palette)
        .filter(([, v]) => typeof v === 'object')
        .map(([ramp, steps]) => (
          <Section key={ramp} title={ramp}>
            <div className="flex flex-wrap gap-2">
              {Object.keys(steps as object).map((step) => (
                <div key={step} className="flex w-16 flex-col gap-1">
                  <span
                    className="block h-12 rounded-md border border-border"
                    style={{ background: `var(--a-palette-${ramp}-${step})` }}
                  />
                  <span className="text-xs text-fg-muted">{step}</span>
                </div>
              ))}
            </div>
          </Section>
        ))}
    </div>
  ),
};
