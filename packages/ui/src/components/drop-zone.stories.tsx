import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { DropZone, DropZoneFileList, type FileListItem, type RejectedFile } from './drop-zone';
import { Stack } from './stack';

const meta = {
  title: 'patterns/FileUpload',
  component: DropZone,
  args: { label: 'Import products', accept: '.csv', hint: 'CSV, up to 10 MB', maxSize: 10 * 1024 * 1024, onDrop: fn() },
  argTypes: {
    label: { control: 'text', description: 'Visible label and the file input’s accessible name.', table: { type: { summary: 'string' } } },
    labelHidden: { control: 'boolean', description: 'Hide the label visually.', table: { type: { summary: 'boolean' } } },
    accept: { control: 'text', description: 'Accepted MIME types or extensions, e.g. `image/*,.pdf`.', table: { type: { summary: 'string' } } },
    multiple: { control: 'boolean', description: 'Allow several files.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    maxSize: { control: 'number', description: 'Maximum bytes per file.', table: { type: { summary: 'number' } } },
    maxFiles: { control: 'number', description: 'Maximum files per drop (with `multiple`).', table: { type: { summary: 'number' } } },
    disabled: { control: 'boolean', description: 'Prevent uploads.', table: { type: { summary: 'boolean' } } },
    size: { control: 'inline-radio', options: ['sm', 'md'], description: '`sm` inside forms, `md` for page-level imports.', table: { type: { summary: "'sm' | 'md'" }, defaultValue: { summary: 'md' } } },
    hint: { control: 'text', description: 'Accepted types and limits, in words.', table: { type: { summary: 'ReactNode' } } },
    error: { control: 'text', description: 'Zone-level error.', table: { type: { summary: 'string' } } },
    onDrop: { control: false, description: '`(accepted: File[], rejected: RejectedFile[]) => void`', table: { type: { summary: 'function' } } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Drag-and-drop or click to choose files. A real file input covers the zone, so keyboard and screen-reader users get the native picker. **Use** for imports and attachments that matter. **Don’t use** for a single optional attachment in a dense form. Always say which file was rejected and why.',
      },
    },
  },
  decorators: [(Story) => <div className="max-w-lg"><Story /></div>],
} satisfies Meta<typeof DropZone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function WithFiles() {
  const [files, setFiles] = useState<FileListItem[]>([
    { id: '1', name: 'invoice-INV-1042.pdf', size: 184_320 },
    { id: '2', name: 'purchase-order-PO-2291.pdf', size: 2_411_724, progress: 64 },
  ]);
  const [rejected, setRejected] = useState<RejectedFile[]>([]);
  return (
    <Stack gap={3}>
      <DropZone
        label="Attach documents"
        accept=".pdf"
        multiple
        maxSize={5 * 1024 * 1024}
        hint="PDF, up to 5 MB each"
        onDrop={(accepted, rej) => {
          setRejected(rej);
          setFiles((f) => [...f, ...accepted.map((a, i) => ({ id: `${Date.now()}-${i}`, name: a.name, size: a.size }))]);
        }}
      />
      {rejected.length ? (
        <ul role="alert" className="text-sm text-critical-subtle-fg">
          {rejected.map((r) => <li key={r.file.name}>{r.message}</li>)}
        </ul>
      ) : null}
      <DropZoneFileList files={files} onRemove={(id) => setFiles((f) => f.filter((x) => x.id !== id))} />
    </Stack>
  );
}

export const Multiple: Story = { render: () => <WithFiles /> };

export const Loading: Story = {
  name: 'Loading (uploading)',
  render: () => (
    <Stack gap={3}>
      <DropZone label="Attach documents" multiple hint="Uploading 2 files…" disabled />
      <DropZoneFileList files={[{ id: '1', name: 'q3-stock-count.csv', size: 3_221_000, progress: 32 }, { id: '2', name: 'q3-stock-adjustments.csv', size: 812_000, progress: 88 }]} />
    </Stack>
  ),
};

export const ErrorState: Story = {
  name: 'Error',
  args: { error: 'The import failed: row 42 has no SKU. Fix the file and upload it again.' },
};

export const FileErrors: Story = {
  name: 'Error (per file)',
  render: () => (
    <DropZoneFileList
      files={[
        { id: '1', name: 'product-photo.heic', size: 4_100_000, error: 'HEIC isn’t supported. Use JPG, PNG or WebP.' },
        { id: '2', name: 'catalogue-2024-full-resolution.png', size: 48_000_000, error: 'This file is 46 MB; the limit is 20 MB.' },
      ]}
      onRemove={() => {}}
    />
  ),
};

export const Permission: Story = {
  args: { disabled: true, hint: 'You need the Inventory manager role to import products.' },
};

export const Offline: Story = {
  args: { disabled: true, hint: 'You’re offline. Uploads resume when you reconnect.' },
};

export const Overflow: Story = {
  render: () => (
    <div className="w-72">
      <DropZoneFileList
        files={[{ id: '1', name: 'northwind-traders-international-purchase-order-archive-2019-2024-final-v7.pdf', size: 12_400_000 }]}
        onRemove={() => {}}
      />
    </div>
  ),
};

export const Small: Story = { args: { size: 'sm', label: 'Receipt', accept: 'image/*,.pdf', hint: 'Image or PDF' } };
