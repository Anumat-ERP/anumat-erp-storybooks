import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileText } from 'lucide-react';
import { SkeletonThumbnail } from './skeleton';
import { Inline, Stack } from './stack';
import { Thumbnail } from './thumbnail';

/** A self-contained product image (a tote bag), wider than tall to show `object-contain`. */
const TOTE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80"><rect width="120" height="80" fill="#eef2ff"/><path d="M45 28c0-10 30-10 30 0" fill="none" stroke="#3730a3" stroke-width="4"/><rect x="34" y="28" width="52" height="44" rx="4" fill="#4f46e5"/></svg>',
)}`;
const TALL = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 100"><rect width="40" height="100" rx="6" fill="#0f766e"/><rect x="12" y="4" width="16" height="12" fill="#134e4a"/></svg>',
)}`;

const meta = {
  title: 'primitives/Thumbnail',
  component: Thumbnail,
  args: { source: TOTE, alt: 'Indigo canvas tote bag', size: 'md' },
  argTypes: {
    source: {
      control: 'text',
      description: 'Image URL. Missing or broken → placeholder icon.',
      table: { type: { summary: 'string' } },
    },
    alt: {
      control: 'text',
      description: 'Required. Describe the image, or `""` when the name is written beside it.',
      table: { type: { summary: 'string' } },
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'xs 24 · sm 40 · md 60 · lg 80px.',
      table: { type: { summary: "'xs' | 'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    fallbackIcon: {
      control: false,
      description: 'Replace the placeholder icon (e.g. a file icon for documents).',
      table: { type: { summary: 'ReactNode' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A small bordered square previewing a product or file image. `object-contain` keeps the whole image visible — nothing is cropped.',
          '',
          '**Use** in lists, tables and pickers beside the item’s name. `alt` is required: describe the image, or pass `""` when the name is right next to it.',
          '',
          '**Don’t use** for people or businesses (Avatar), or for large hero images.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Thumbnail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Inline gap={3} align="end">
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <Thumbnail key={size} {...args} size={size} />
      ))}
    </Inline>
  ),
};

/** Wide and tall images are letterboxed, not cropped. */
export const AspectRatios: Story = {
  render: (args) => (
    <Inline gap={3}>
      <Thumbnail {...args} size="lg" />
      <Thumbnail {...args} size="lg" source={TALL} alt="Green glass bottle" />
    </Inline>
  ),
};

export const WithName: Story = {
  render: (args) => (
    <Inline gap={3}>
      <Thumbnail {...args} alt="" size="sm" />
      <span className="text-md font-medium text-fg">Indigo canvas tote bag</span>
    </Inline>
  ),
};

/** Empty: no image uploaded — a neutral placeholder. */
export const Empty: Story = { args: { source: undefined, alt: 'No image for Indigo canvas tote bag' } };

export const CustomFallback: Story = {
  args: { source: undefined, alt: 'Invoice PDF', fallbackIcon: <FileText /> },
};

export const Loading: Story = {
  render: () => (
    <Inline gap={3}>
      <SkeletonThumbnail size="md" />
      <SkeletonThumbnail size="sm" />
    </Inline>
  ),
};

/** Error: a broken URL falls back to the placeholder. */
export const ErrorState: Story = { name: 'Error', args: { source: 'data:image/png;base64,broken' } };

export const Overflow: Story = {
  render: (args) => (
    <Stack gap={2} className="w-48">
      <Inline gap={3} wrap={false}>
        <Thumbnail {...args} alt="" size="sm" />
        <span className="min-w-0 truncate text-md text-fg" title="Indigo canvas tote bag with reinforced handles, limited edition">
          Indigo canvas tote bag with reinforced handles, limited edition
        </span>
      </Inline>
    </Stack>
  ),
};
