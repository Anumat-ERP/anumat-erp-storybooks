import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Stack } from './stack';
import { VideoThumbnail } from './video-thumbnail';

const POSTER = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#312e81"/><stop offset="1" stop-color="#0f766e"/></linearGradient></defs><rect width="320" height="180" fill="url(#g)"/><rect x="40" y="40" width="110" height="100" rx="8" fill="#e0e7ff" opacity=".9"/><rect x="170" y="52" width="110" height="12" rx="6" fill="#e0e7ff" opacity=".7"/><rect x="170" y="76" width="80" height="12" rx="6" fill="#e0e7ff" opacity=".5"/></svg>',
)}`;

const meta = {
  title: 'components/VideoThumbnail',
  component: VideoThumbnail,
  args: {
    thumbnailUrl: POSTER,
    accessibilityLabel: 'Play: Setting up shipping',
    videoLength: 151,
    onClick: fn(),
  },
  argTypes: {
    thumbnailUrl: {
      control: 'text',
      description: 'Poster image URL. Decorative (`alt=""`); the button’s name describes the video.',
      table: { type: { summary: 'string' } },
    },
    accessibilityLabel: {
      control: 'text',
      description: 'Start of the button’s name. The spoken duration and watched time are appended.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Play video' } },
    },
    videoLength: {
      control: 'number',
      description: 'Seconds. Shown `2:31`, announced “2 minutes 31 seconds” (`formatDuration`).',
      table: { type: { summary: 'number' } },
    },
    videoProgress: {
      control: 'number',
      description: 'Seconds watched. Draws a line along the bottom; announced as “… watched”.',
      table: { type: { summary: 'number' } },
    },
    aspectRatio: {
      control: 'inline-radio',
      options: ['video', 'square'],
      description: 'Frame shape.',
      table: { type: { summary: "'video' | 'square'" }, defaultValue: { summary: 'video' } },
    },
    onClick: { control: false, description: 'Open the player.', table: { type: { summary: '(event) => void' } } },
    disabled: {
      control: 'boolean',
      description: 'Not playable right now (offline, processing).',
      table: { type: { summary: 'boolean' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A clickable poster frame that starts a video, with a play button, the duration, and how much has been watched.',
          '',
          'The whole frame is one button. The duration shows `2:31` (hidden from AT) and is announced “2 minutes 31 seconds” (visually hidden) — a screen reader would otherwise read `2:31` as a time of day.',
          '',
          '**Use** for tutorials and product videos that open a player on click. **Don’t use** for autoplaying media or for images that don’t play (Thumbnail).',
        ].join('\n'),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VideoThumbnail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Watched: Story = { args: { videoProgress: 95 } };

export const Long: Story = { args: { videoLength: 3725, accessibilityLabel: 'Play: Full store setup walkthrough' } };

export const Square: Story = { args: { aspectRatio: 'square' } };

/** Empty: no poster yet — a neutral frame still offers play. */
export const Empty: Story = { args: { thumbnailUrl: undefined } };

export const Loading: Story = {
  render: () => (
    <div aria-hidden className="aspect-video w-full animate-pulse rounded-lg bg-skeleton" />
  ),
};

export const ErrorState: Story = {
  name: 'Error',
  render: (args) => (
    <Stack gap={2}>
      <VideoThumbnail {...args} disabled aria-describedby="video-error" />
      <p id="video-error" className="text-sm text-critical-subtle-fg">
        This video couldn’t be loaded.
      </p>
    </Stack>
  ),
};

export const Offline: Story = {
  render: (args) => (
    <Stack gap={2}>
      <VideoThumbnail {...args} disabled aria-describedby="video-offline" />
      <p id="video-offline" className="text-sm text-fg-muted">
        You’re offline. Videos play when you reconnect.
      </p>
    </Stack>
  ),
};

export const Overflow: Story = {
  args: {
    videoLength: 36125,
    videoProgress: 30000,
    accessibilityLabel: 'Play: A very long recorded webinar about international tax settings',
  },
  decorators: [
    (Story) => (
      <div className="w-40">
        <Story />
      </div>
    ),
  ],
};
