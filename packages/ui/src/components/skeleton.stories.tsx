import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './card';
import {
  SkeletonBlock,
  SkeletonDisplayText,
  SkeletonPage,
  SkeletonText,
  SkeletonThumbnail,
} from './skeleton';
import { Inline, Stack } from './stack';

const meta = {
  title: 'primitives/Skeleton',
  component: SkeletonPage,
  args: { title: 'Products', primaryAction: true, cards: 2, withSidebar: false, loadingLabel: 'Loading…' },
  argTypes: {
    title: {
      control: 'text',
      description: 'The page title if known before the data; rendered as a real heading. Otherwise a bar.',
      table: { type: { summary: 'string' } },
    },
    primaryAction: {
      control: 'boolean',
      description: 'Placeholder for the page’s primary action button.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    cards: {
      control: { type: 'number', min: 0, max: 6 },
      description: 'Number of placeholder cards in the main column.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '2' } },
    },
    withSidebar: {
      control: 'boolean',
      description: 'Add a narrower secondary column.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    loadingLabel: {
      control: 'text',
      description: 'The single polite status announced for the whole page.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Loading…' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Placeholders in the shape of content that is loading: `SkeletonText` (lines, last one shorter), `SkeletonDisplayText` (a heading), `SkeletonThumbnail`, `SkeletonBlock`, and the `SkeletonPage` composition.',
          '',
          'Every piece is `aria-hidden`; `SkeletonPage` carries one visually hidden “Loading…” status, so a screen reader hears it once rather than once per bar.',
          '',
          '**Use** for a first page or section load, so the layout doesn’t jump when data arrives. **Don’t use** for waits under a second (show nothing), for an action on a loaded page (Button `loading`), or when progress is measurable (ProgressBar). If you use the pieces alone, add your own status message.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof SkeletonPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSidebar: Story = { args: { withSidebar: true, cards: 3 } };

export const UnknownTitle: Story = { args: { title: undefined } };

export const Pieces: Story = {
  render: () => (
    <Stack gap={6} className="max-w-lg">
      <Stack gap={2}>
        <p className="text-sm font-medium text-fg-muted">SkeletonDisplayText sm / md / lg</p>
        <SkeletonDisplayText size="sm" />
        <SkeletonDisplayText size="md" />
        <SkeletonDisplayText size="lg" />
      </Stack>
      <Stack gap={2}>
        <p className="text-sm font-medium text-fg-muted">SkeletonText (3 lines, md; 2 lines, sm)</p>
        <SkeletonText lines={3} />
        <SkeletonText lines={2} size="sm" />
      </Stack>
      <Stack gap={2}>
        <p className="text-sm font-medium text-fg-muted">SkeletonThumbnail xs / sm / md / lg</p>
        <Inline gap={3}>
          <SkeletonThumbnail size="xs" />
          <SkeletonThumbnail size="sm" />
          <SkeletonThumbnail size="md" />
          <SkeletonThumbnail size="lg" />
        </Inline>
      </Stack>
      <Stack gap={2}>
        <p className="text-sm font-medium text-fg-muted">SkeletonBlock</p>
        <SkeletonBlock heightClassName="h-24" />
      </Stack>
    </Stack>
  ),
};

/** A list row: thumbnail, title and meta. Standalone pieces need their own status message. */
export const ListRows: Story = {
  render: () => (
    <Card flush className="max-w-lg">
      <span role="status" className="sr-only">
        Loading products…
      </span>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 border-t border-border px-4 py-3 first:border-t-0">
          <SkeletonThumbnail size="sm" />
          <SkeletonText lines={2} size="sm" />
        </div>
      ))}
    </Card>
  ),
};

/** Loading is this component's only state; Default is the loading state. */
export const Loading: Story = { args: { withSidebar: true } };

/** Overflow: skeletons stay inside narrow containers. */
export const Overflow: Story = {
  render: (args) => (
    <div className="w-64 rounded-md border border-dashed border-border-strong p-2">
      <SkeletonPage {...args} title="Products with a very long collection name" />
    </div>
  ),
};
