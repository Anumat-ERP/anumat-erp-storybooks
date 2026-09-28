/**
 * Design tokens — the single source of truth for the visual layer.
 *
 * Edit values here, then run `bun run --filter @repo/ui build:theme`.
 * Everything under src/styles/*.generated.css and src/lib/tokens.generated.ts
 * is derived from this file; never hand-edit those.
 *
 * Structure
 *   palette   raw colour ramps. Components never reference these directly.
 *   themes    semantic colours per theme; values name a palette step
 *             (`neutral.200`) or are literal CSS colours.
 *   scales    theme-independent scales (space, radius, type, motion…).
 */

const ramp = (hue, chroma, steps) =>
  Object.fromEntries(Object.entries(steps).map(([k, [l, c = 1]]) => [k, `oklch(${l} ${+(chroma * c).toFixed(3)} ${hue})`]));

// Lightness per step, with a per-step chroma multiplier so ramps stay vivid in
// the middle and neutral at the ends.
const STEPS = {
  50: [0.975, 0.15],
  100: [0.945, 0.3],
  200: [0.895, 0.5],
  300: [0.82, 0.7],
  400: [0.71, 0.9],
  500: [0.6, 1],
  600: [0.52, 1],
  700: [0.45, 0.9],
  800: [0.38, 0.75],
  900: [0.31, 0.6],
  950: [0.24, 0.45],
};

export const palette = {
  white: 'oklch(1 0 0)',
  black: 'oklch(0 0 0)',
  neutral: {
    0: 'oklch(1 0 0)',
    25: 'oklch(0.988 0.002 260)',
    50: 'oklch(0.975 0.004 260)',
    100: 'oklch(0.95 0.006 260)',
    150: 'oklch(0.925 0.008 260)',
    200: 'oklch(0.895 0.01 260)',
    300: 'oklch(0.83 0.013 260)',
    400: 'oklch(0.7 0.017 260)',
    450: 'oklch(0.62 0.019 260)',
    500: 'oklch(0.54 0.02 260)',
    600: 'oklch(0.45 0.02 260)',
    700: 'oklch(0.37 0.02 260)',
    800: 'oklch(0.28 0.017 260)',
    850: 'oklch(0.235 0.015 260)',
    900: 'oklch(0.2 0.013 260)',
    950: 'oklch(0.155 0.01 260)',
  },
  brand: ramp(277, 0.21, STEPS),
  green: ramp(155, 0.16, STEPS),
  amber: ramp(70, 0.17, STEPS),
  red: ramp(25, 0.21, STEPS),
  blue: ramp(240, 0.16, STEPS),
};

/** Tone families share one shape so components can map `tone` -> tokens. */
const tone = (name, { solid, hover, active, subtle, subtleFg, border, onSolid = 'white' }) => ({
  [name]: solid,
  [`${name}-hover`]: hover,
  [`${name}-active`]: active,
  [`${name}-fg`]: onSolid,
  [`${name}-subtle`]: subtle,
  [`${name}-subtle-fg`]: subtleFg,
  [`${name}-border`]: border,
});

export const themes = {
  light: {
    // Backgrounds, from the app canvas up to raised surfaces.
    bg: 'neutral.50',
    surface: 'neutral.0',
    'surface-muted': 'neutral.25',
    'surface-sunken': 'neutral.100',
    'surface-hover': 'neutral.50',
    'surface-active': 'neutral.100',
    'surface-selected': 'brand.50',
    'surface-inverse': 'neutral.900',
    overlay: 'oklch(0.2 0.013 260 / 0.45)',
    skeleton: 'neutral.150',
    // Lines.
    border: 'neutral.200',
    'border-strong': 'neutral.300',
    'border-subtle': 'neutral.150',
    'border-input': 'neutral.450',
    ring: 'brand.500',
    // Text.
    fg: 'neutral.900',
    'fg-muted': 'neutral.600',
    'fg-subtle': 'neutral.500',
    'fg-disabled': 'neutral.400',
    'fg-inverse': 'neutral.0',
    'fg-link': 'brand.600',
    ...tone('primary', {
      solid: 'brand.600',
      hover: 'brand.700',
      active: 'brand.800',
      subtle: 'brand.50',
      subtleFg: 'brand.700',
      border: 'brand.200',
    }),
    ...tone('critical', {
      solid: 'red.600',
      hover: 'red.700',
      active: 'red.800',
      subtle: 'red.50',
      subtleFg: 'red.800',
      border: 'red.200',
    }),
    ...tone('success', {
      solid: 'green.600',
      hover: 'green.700',
      active: 'green.800',
      subtle: 'green.50',
      subtleFg: 'green.800',
      border: 'green.200',
    }),
    ...tone('warning', {
      solid: 'amber.300',
      hover: 'amber.400',
      active: 'amber.400',
      subtle: 'amber.50',
      subtleFg: 'amber.900',
      border: 'amber.200',
      onSolid: 'amber.950',
    }),
    ...tone('info', {
      solid: 'blue.600',
      hover: 'blue.700',
      active: 'blue.800',
      subtle: 'blue.50',
      subtleFg: 'blue.800',
      border: 'blue.200',
    }),
  },
  dark: {
    bg: 'neutral.950',
    surface: 'neutral.900',
    'surface-muted': 'neutral.850',
    'surface-sunken': 'neutral.950',
    'surface-hover': 'neutral.850',
    'surface-active': 'neutral.800',
    'surface-selected': 'oklch(0.3 0.08 277)',
    'surface-inverse': 'neutral.100',
    overlay: 'oklch(0 0 0 / 0.6)',
    skeleton: 'neutral.800',
    border: 'neutral.800',
    'border-strong': 'neutral.700',
    'border-subtle': 'neutral.850',
    'border-input': 'neutral.500',
    ring: 'brand.400',
    fg: 'neutral.50',
    'fg-muted': 'neutral.300',
    'fg-subtle': 'neutral.400',
    'fg-disabled': 'neutral.600',
    'fg-inverse': 'neutral.900',
    'fg-link': 'brand.300',
    ...tone('primary', {
      solid: 'brand.600',
      hover: 'brand.700',
      active: 'brand.800',
      subtle: 'oklch(0.28 0.07 277)',
      subtleFg: 'brand.200',
      border: 'brand.800',
    }),
    ...tone('critical', {
      solid: 'red.600',
      hover: 'red.700',
      active: 'red.800',
      subtle: 'oklch(0.27 0.07 25)',
      subtleFg: 'red.200',
      border: 'red.800',
    }),
    ...tone('success', {
      solid: 'green.600',
      hover: 'green.700',
      active: 'green.800',
      subtle: 'oklch(0.27 0.05 155)',
      subtleFg: 'green.200',
      border: 'green.800',
    }),
    ...tone('warning', {
      solid: 'amber.400',
      hover: 'amber.300',
      active: 'amber.200',
      subtle: 'oklch(0.28 0.05 70)',
      subtleFg: 'amber.200',
      border: 'amber.800',
      onSolid: 'amber.950',
    }),
    ...tone('info', {
      solid: 'blue.600',
      hover: 'blue.700',
      active: 'blue.800',
      subtle: 'oklch(0.27 0.05 240)',
      subtleFg: 'blue.200',
      border: 'blue.800',
    }),
  },
};

export const scales = {
  /** 4px grid. Tailwind's `--spacing` unit is space.1, so `p-4` = 1rem. */
  space: {
    0: '0rem',
    px: '0.0625rem',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
  },
  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  'border-width': { 0: '0', 1: '1px', 2: '2px' },
  font: {
    sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, "Cascadia Code", "SF Mono", Menlo, Consolas, monospace',
  },
  /** [font-size, line-height] */
  text: {
    xs: ['0.75rem', '1rem'],
    sm: ['0.8125rem', '1.25rem'],
    md: ['0.875rem', '1.25rem'],
    lg: ['1rem', '1.5rem'],
    xl: ['1.125rem', '1.75rem'],
    '2xl': ['1.375rem', '1.75rem'],
    '3xl': ['1.75rem', '2.25rem'],
  },
  'font-weight': { regular: '400', medium: '500', semibold: '600', bold: '700' },
  tracking: { tight: '-0.01em', normal: '0', wide: '0.02em' },
  shadow: {
    xs: '0 1px 1px 0 oklch(0.2 0.013 260 / 0.06)',
    sm: '0 1px 2px 0 oklch(0.2 0.013 260 / 0.08), 0 1px 1px 0 oklch(0.2 0.013 260 / 0.04)',
    md: '0 4px 8px -2px oklch(0.2 0.013 260 / 0.1), 0 2px 4px -2px oklch(0.2 0.013 260 / 0.06)',
    lg: '0 12px 24px -6px oklch(0.2 0.013 260 / 0.16), 0 4px 8px -4px oklch(0.2 0.013 260 / 0.08)',
  },
  duration: { instant: '0ms', fast: '100ms', base: '150ms', slow: '250ms', slower: '400ms' },
  ease: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    enter: 'cubic-bezier(0, 0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
  },
  /** Control heights: buttons, inputs, selects share these so rows align. */
  control: { sm: '1.75rem', md: '2.25rem', lg: '2.75rem' },
  'z-index': {
    base: '0',
    sticky: '100',
    dropdown: '1000',
    overlay: '1100',
    modal: '1200',
    popover: '1300',
    toast: '1400',
    tooltip: '1500',
  },
  breakpoint: { sm: '40rem', md: '48rem', lg: '64rem', xl: '80rem' },
};
