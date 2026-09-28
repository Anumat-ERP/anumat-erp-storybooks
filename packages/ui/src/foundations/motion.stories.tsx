import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../components/button';
import { scales } from '../lib/tokens.generated';
import { Section, TokenName, TokenTable } from './swatch';

const meta = {
  title: 'foundations/Motion',
  parameters: {
    docs: {
      description: {
        component:
          'Durations and easings. Motion explains a change (something opened, arrived, left); it never decorates. Everything collapses to near-zero under `prefers-reduced-motion`.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ duration, ease }: { duration: string; ease: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <Button size="sm" onClick={() => setOn((v) => !v)}>Play</Button>
      <div className="relative h-8 w-64 rounded-md bg-surface-sunken">
        <span
          className="absolute top-1 left-1 size-6 rounded-sm bg-primary"
          style={{
            transform: on ? 'translateX(14.5rem)' : 'none',
            transition: `transform var(--a-duration-${duration}) var(--a-ease-${ease})`,
          }}
        />
      </div>
    </div>
  );
}

export const Durations: Story = {
  render: () => (
    <Section title="Durations" description="`fast` for hover and press, `base` for small reveals, `slow` for panels entering.">
      <TokenTable columns={['Token', 'Value', 'Demo']}>
        {Object.entries(scales.duration).map(([name, value]) => (
          <tr key={name} className="border-b border-border-subtle">
            <td className="py-2 pe-4"><TokenName>--a-duration-{name}</TokenName></td>
            <td className="py-2 pe-4 font-mono text-xs text-fg-muted">{value}</td>
            <td className="py-2 pe-4"><Demo duration={name} ease="standard" /></td>
          </tr>
        ))}
      </TokenTable>
    </Section>
  ),
};

export const Easings: Story = {
  render: () => (
    <Section title="Easings" description="`enter` decelerates into place, `exit` accelerates away, `standard` for moves within the page.">
      <TokenTable columns={['Utility', 'Curve', 'Demo']}>
        {Object.entries(scales.ease).map(([name, value]) => (
          <tr key={name} className="border-b border-border-subtle">
            <td className="py-2 pe-4"><TokenName>ease-{name}</TokenName></td>
            <td className="py-2 pe-4 font-mono text-xs text-fg-muted">{value}</td>
            <td className="py-2 pe-4"><Demo duration="slow" ease={name} /></td>
          </tr>
        ))}
      </TokenTable>
    </Section>
  ),
};
