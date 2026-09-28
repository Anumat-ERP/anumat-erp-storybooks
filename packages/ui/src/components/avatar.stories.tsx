import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './avatar';
import { Inline, Stack } from './stack';

/** A self-contained portrait, so stories need no network. */
const PORTRAIT = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#c7d2fe"/><circle cx="32" cy="25" r="12" fill="#4f46e5"/><path d="M10 64a22 20 0 0 1 44 0z" fill="#4f46e5"/></svg>',
)}`;

const meta = {
  title: 'primitives/Avatar',
  component: Avatar,
  args: { name: 'Ada Lovelace', size: 'md', shape: 'round' },
  argTypes: {
    name: {
      control: 'text',
      description: 'Person or business name: the initials, the colour and the accessible name come from it.',
      table: { type: { summary: 'string' } },
    },
    src: {
      control: 'text',
      description: 'Image URL. The initials show while it loads and if it fails.',
      table: { type: { summary: 'string' } },
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'xs 20 · sm 28 · md 36 · lg 48 · xl 64px.',
      table: { type: { summary: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" }, defaultValue: { summary: 'md' } },
    },
    shape: {
      control: 'inline-radio',
      options: ['round', 'square'],
      description: '`round` for people; `square` for businesses, stores and apps.',
      table: { type: { summary: "'round' | 'square'" }, defaultValue: { summary: 'round' } },
    },
    decorative: {
      control: 'boolean',
      description: 'Hide from assistive tech when the name is written right beside it.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    fallbackDelayMs: {
      control: 'number',
      description: 'Wait before showing initials while the image loads, to avoid a flash.',
      table: { type: { summary: 'number' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A picture or initials representing a person or business. Built on Radix Avatar, which shows the fallback until the image has actually loaded.',
          '',
          '**Use** beside names in lists, headers and comments. The fallback colour is derived from the name, so the same person is always the same colour.',
          '',
          '**Don’t use** as the only identification when the name matters — write the name too (and mark the avatar `decorative`). For product images use Thumbnail.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithImage: Story = { args: { src: PORTRAIT } };

export const Sizes: Story = {
  render: (args) => (
    <Inline gap={3}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </Inline>
  ),
};

/** Each name maps to the same tone every time. */
export const Colours: Story = {
  render: (args) => (
    <Inline gap={3}>
      {['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson', 'Linus Torvalds', 'Margaret Hamilton', 'Tim Berners-Lee'].map(
        (name) => (
          <Avatar key={name} {...args} name={name} />
        ),
      )}
    </Inline>
  ),
};

export const Business: Story = {
  args: { name: 'Northwind Traders', shape: 'square', size: 'lg' },
};

export const WithName: Story = {
  render: (args) => (
    <Inline gap={2}>
      <Avatar {...args} decorative size="sm" />
      <span className="text-md font-medium text-fg">{args.name}</span>
    </Inline>
  ),
};

/** Empty: no name and no image — a neutral silhouette, hidden from AT. */
export const Empty: Story = { args: { name: undefined } };

/** Loading: the initials hold the space while the image loads (after `fallbackDelayMs`). */
export const Loading: Story = {
  render: (args) => (
    <Inline gap={3}>
      <Avatar {...args} />
      <span aria-hidden className="inline-block size-9 animate-pulse rounded-full bg-skeleton" />
    </Inline>
  ),
};

/** Error: a broken image falls back to initials. */
export const ErrorState: Story = { name: 'Error', args: { src: 'data:image/png;base64,broken' } };

export const Overflow: Story = {
  render: (args) => (
    <Stack gap={2} align="start">
      <Avatar {...args} name="Maria Guadalupe de los Ángeles Fernández-Castillo" />
      <Avatar {...args} name="Émile Zola" />
      <Avatar {...args} name="李 小龙" />
      <Avatar {...args} name="madonna" />
    </Stack>
  ),
};
