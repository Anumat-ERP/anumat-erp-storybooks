/**
 * Every component in @repo/ui: the single source of truth for status.
 *
 * depth 'full'        hand-written, behaviour complete, all applicable states
 *                     have stories, verified in Storybook.
 * depth 'first-pass'  scaffolded by scripts/generate.mjs from `archetype`;
 *                     correct tokens and semantics, minimal behaviour.
 *
 * STATUS.md is generated from this file (`bun run status`); `lint` fails if
 * they disagree.
 */
export const LEVELS = ['primitives', 'components', 'patterns', 'product'];

export const components = [
  { name: 'Button', file: 'button', level: 'primitives', radix: 'Slot', depth: 'full', notes: 'Includes IconButton. Loading keeps its box and its accessible name.' },
  { name: 'Text', file: 'text', level: 'primitives', radix: null, depth: 'full', notes: '`variant` for look, `as` for element.' },
  { name: 'Stack', file: 'stack', level: 'primitives', radix: null, depth: 'full', notes: 'Includes Inline.' },
  { name: 'Spinner', file: 'spinner', level: 'primitives', radix: null, depth: 'full', notes: '' },
  { name: 'Label', file: 'label', level: 'primitives', radix: 'Label', depth: 'full', notes: '' },
  { name: 'Field', file: 'field', level: 'primitives', radix: null, depth: 'full', notes: 'Wires label, help and error ids to any control.' },
  { name: 'Input', file: 'input', level: 'primitives', radix: null, depth: 'full', notes: 'Prefix/suffix, clearable, character count.' },
  { name: 'Textarea', file: 'textarea', level: 'primitives', radix: null, depth: 'full', notes: 'Auto-grow measured in JS.' },
  { name: 'Checkbox', file: 'checkbox', level: 'primitives', radix: 'Checkbox', depth: 'full', notes: 'Indeterminate.' },
  { name: 'RadioGroup', file: 'radio-group', level: 'primitives', radix: 'RadioGroup', depth: 'full', notes: '' },
  { name: 'Select', file: 'select', level: 'primitives', radix: null, depth: 'full', notes: 'Native select, deliberately.' },
  { name: 'Switch', file: 'switch', level: 'primitives', radix: 'Switch', depth: 'full', notes: 'Means "applies instantly".' },
  { name: 'SettingToggle', file: 'setting-toggle', level: 'primitives', radix: null, depth: 'full', notes: 'A button, not a switch: the change submits.' },
  { name: 'Tooltip', file: 'tooltip', level: 'primitives', radix: 'Tooltip', depth: 'full', notes: '' },
  { name: 'Link', file: 'link', level: 'primitives', radix: 'Slot', depth: 'full', notes: '' },
  { name: 'Kbd', file: 'kbd', level: 'primitives', radix: null, depth: 'full', notes: '' },
  { name: 'Divider', file: 'divider', level: 'primitives', radix: 'Separator', depth: 'full', notes: '' },
  { name: 'Badge', file: 'badge', level: 'primitives', radix: null, depth: 'full', notes: '' },
  { name: 'Avatar', file: 'avatar', level: 'primitives', radix: 'Avatar', depth: 'full', notes: '' },
  { name: 'Skeleton', file: 'skeleton', level: 'primitives', radix: null, depth: 'full', notes: 'Text, display, thumbnail, block and page.' },
  { name: 'Thumbnail', file: 'thumbnail', level: 'primitives', radix: null, depth: 'full', notes: '' },
  { name: 'Card', file: 'card', level: 'components', radix: null, depth: 'full', notes: '' },
  { name: 'Tag', file: 'tag', level: 'components', radix: null, depth: 'full', notes: '' },
  { name: 'Banner', file: 'banner', level: 'components', radix: null, depth: 'full', notes: 'Critical is assertive; others polite.' },
  { name: 'Toast', file: 'toast', level: 'components', radix: 'Toast', depth: 'full', notes: 'Timer pauses on hover and focus.' },
  { name: 'ProgressBar', file: 'progress-bar', level: 'components', radix: null, depth: 'full', notes: 'Real `<progress>`.' },
  { name: 'VideoThumbnail', file: 'video-thumbnail', level: 'components', radix: null, depth: 'full', notes: 'Shows 2:31, announces "2 minutes 31 seconds".' },
  { name: 'EmptyState', file: 'empty-state', level: 'components', radix: null, depth: 'full', notes: 'First-run, filtered and cleared variants.' },
  { name: 'DescriptionList', file: 'description-list', level: 'components', radix: null, depth: 'full', notes: 'Real `<dl>`.' },
  { name: 'List', file: 'list', level: 'components', radix: null, depth: 'full', notes: 'Numbered renders `<ol>`.' },
  { name: 'ExceptionList', file: 'exception-list', level: 'components', radix: null, depth: 'full', notes: '`<ul>`, so the count is announced first.' },
  { name: 'Modal', file: 'modal', level: 'components', radix: 'Dialog', depth: 'full', notes: 'Includes ConfirmDialog (AlertDialog).' },
  { name: 'Drawer', file: 'drawer', level: 'components', radix: 'Dialog', depth: 'full', notes: '' },
  { name: 'Popover', file: 'popover', level: 'components', radix: 'Popover', depth: 'full', notes: '' },
  { name: 'ActionMenu', file: 'action-menu', level: 'components', radix: 'DropdownMenu', depth: 'full', notes: 'Includes PageActions and styled DropdownMenu parts.' },
  { name: 'Tabs', file: 'tabs', level: 'components', radix: 'Tabs', depth: 'full', notes: '' },
  { name: 'Pagination', file: 'pagination', level: 'components', radix: null, depth: 'full', notes: 'No href/link mode yet.' },
  { name: 'Breadcrumbs', file: 'breadcrumbs', level: 'components', radix: null, depth: 'full', notes: '' },
  { name: 'Accordion', file: 'accordion', level: 'components', radix: 'Accordion', depth: 'full', notes: '' },
  { name: 'Collapsible', file: 'collapsible', level: 'components', radix: 'Collapsible', depth: 'full', notes: '' },
  { name: 'PageHeader', file: 'page-header', level: 'components', radix: null, depth: 'full', notes: '' },
  { name: 'Navigation', file: 'navigation', level: 'components', radix: null, depth: 'full', notes: '' },
  { name: 'AppShell', file: 'app-shell', level: 'components', radix: 'Dialog', depth: 'full', notes: 'Sidebar becomes a drawer below md.' },
  { name: 'SelectionCheckbox', file: 'selection-checkbox', level: 'components', radix: 'Checkbox', depth: 'full', notes: 'Stops propagation so selecting never navigates.' },
  { name: 'BulkActions', file: 'bulk-actions', level: 'components', radix: 'DropdownMenu', depth: 'full', notes: 'Includes SelectAllActions. States count and scope.' },
  { name: 'ResourceList', file: 'resource-list', level: 'components', radix: null, depth: 'full', notes: 'Includes ResourceItem.' },
  { name: 'DataTable', file: 'data-table', level: 'components', radix: null, depth: 'full', notes: 'Sticky header requires `maxHeight`.' },
  { name: 'IndexTable', file: 'index-table', level: 'components', radix: null, depth: 'full', notes: 'DataTable + selection + bulk actions + filters.' },
  { name: 'SearchField', file: 'search-field', level: 'patterns', radix: null, depth: 'full', notes: 'Debounced.' },
  { name: 'Filters', file: 'filters', level: 'patterns', radix: 'Popover', depth: 'full', notes: '' },
  { name: 'FileUpload', file: 'drop-zone', level: 'patterns', radix: null, depth: 'full', notes: 'DropZone + DropZoneFileList; native input underneath.' },
  { name: 'Combobox', file: 'combobox', level: 'primitives', radix: null, depth: 'first-pass', archetype: 'control', gap: 'no listbox, filtering, or keyboard option navigation', purpose: 'Searchable single/multi select for long option lists (customers, SKUs).' },
  { name: 'DatePicker', file: 'date-picker', level: 'primitives', radix: null, depth: 'first-pass', archetype: 'control', gap: 'no calendar popover, range selection, or locale formatting — the input is plain text', purpose: 'Pick a date or range (invoice due dates, report periods).' },
  { name: 'RangeSlider', file: 'range-slider', level: 'primitives', radix: null, depth: 'first-pass', archetype: 'control', gap: 'no slider track, thumbs, dual range or keyboard stepping', purpose: 'Choose a numeric value or range (price, quantity).' },
];
