import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Inline, Stack } from './stack';
import { Tag } from './tag';

const meta = {
  title: 'components/Tag',
  component: Tag,
  args: { children: 'Wholesale', onRemove: fn() },
  argTypes: {
    children: {
      control: 'text',
      description: 'The tag text. Also forms the remove button’s name (“Remove Wholesale”).',
      table: { type: { summary: 'ReactNode' } },
    },
    onRemove: {
      control: false,
      description: 'Makes the tag removable. After removal, move focus to the next tag or the input.',
      table: { type: { summary: '(event: MouseEvent<HTMLButtonElement>) => void' } },
    },
    accessibilityLabel: {
      control: 'text',
      description: 'Text for the remove button’s name when `children` isn’t a plain string.',
      table: { type: { summary: 'string' } },
    },
    href: {
      control: 'text',
      description: 'Makes the text a link, e.g. to everything with this tag.',
      table: { type: { summary: 'string' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents removal and following the link.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    maxWidthClassName: {
      control: 'text',
      description: 'Max width before truncating (a Tailwind class). The full text is in `title`.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'max-w-60' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A compact chip for a value the user added: a product tag, a customer segment, an applied filter.',
          '',
          '**Use** for user-applied labels that can be removed or followed. The remove button is named “Remove {text}”, so a list of them is distinguishable by ear.',
          '',
          '**Don’t use** for system statuses (Badge), or to pick between options (checkbox, segmented control).',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ReadOnly: Story = { args: { onRemove: undefined } };

export const Link: Story = { args: { href: '#customers?tag=wholesale', onRemove: undefined } };

export const Disabled: Story = { args: { disabled: true } };

/** Removing a tag moves focus to the next one (or the input), so keyboard users don’t land on `<body>`. */
export const Group: Story = {
  render: () => {
    function Example() {
      const [tags, setTags] = useState(['Wholesale', 'VIP', 'Returning', 'Newsletter']);
      return (
        <Stack gap={2}>
          <Inline>
            {tags.map((tag, i) => (
              <Tag
                key={tag}
                onRemove={(event) => {
                  const group = event.currentTarget.closest('[data-tag-group]');
                  setTags((t) => t.filter((x) => x !== tag));
                  requestAnimationFrame(() => {
                    const buttons = group?.querySelectorAll<HTMLButtonElement>('button');
                    (buttons?.[Math.min(i, (buttons?.length ?? 1) - 1)] ?? null)?.focus();
                  });
                }}
              >
                {tag}
              </Tag>
            ))}
          </Inline>
          {tags.length === 0 ? <p className="text-sm text-fg-muted">No tags.</p> : null}
        </Stack>
      );
    }
    return (
      <div data-tag-group>
        <Example />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => <p className="text-sm text-fg-muted">No tags yet. Add tags to group customers for discounts and email.</p>,
};

export const Loading: Story = {
  render: () => (
    <Inline aria-hidden>
      <span className="inline-block h-6 w-20 animate-pulse rounded-md bg-skeleton" />
      <span className="inline-block h-6 w-14 animate-pulse rounded-md bg-skeleton" />
    </Inline>
  ),
};

export const ErrorState: Story = {
  name: 'Error',
  render: (args) => (
    <Stack gap={2} align="start">
      <Tag {...args}>Wholesale</Tag>
      <p role="alert" className="text-sm text-critical-subtle-fg">
        Couldn’t remove “Wholesale”. Try again.
      </p>
    </Stack>
  ),
};

export const Permission: Story = {
  render: (args) => (
    <Stack gap={2} align="start">
      <Tag {...args} disabled aria-describedby="tag-perm">
        Wholesale
      </Tag>
      <p id="tag-perm" className="text-sm text-fg-muted">
        Only staff with “Edit customers” can change tags.
      </p>
    </Stack>
  ),
};

export const Offline: Story = {
  render: (args) => (
    <Stack gap={2} align="start">
      <Tag {...args} disabled>
        Wholesale
      </Tag>
      <p className="text-sm text-fg-muted">You’re offline. Tags can be changed when you reconnect.</p>
    </Stack>
  ),
};

/** Long tags truncate with an ellipsis; the full text is in `title` and still in the remove button’s name. */
export const Overflow: Story = {
  render: (args) => (
    <div className="flex w-72 flex-wrap gap-2 rounded-md border border-dashed border-border-strong p-2">
      <Tag {...args}>Customers who purchased during the 2025 winter clearance event</Tag>
      <Tag {...args} href="#tag">
        Linked tag with an unusually long descriptive name
      </Tag>
      <Tag {...args}>VIP</Tag>
    </div>
  ),
};
