# anumat-erp-storybooks

The component library and Storybook for the Anumat ERP, in a Bun + Turborepo
monorepo. It uses the shadcn architecture: we own every component's source,
Radix supplies behaviour contracts, and Tailwind v4 utilities style
components against **our own design tokens**.

```
.
├── apps/
│   └── playground/          Next 16 app: the library consumed like a real app (RSC-safe)
├── modules/                 business capabilities; empty in the library repo
└── packages/
    ├── ui/                  the library + Storybook
    │   ├── tokens/tokens.mjs          design tokens: the single source of truth
    │   ├── scripts/
    │   │   ├── build-theme.mjs        tokens -> CSS vars, Tailwind theme, TS types, contrast check
    │   │   ├── manifest.mjs           every component, its level and depth
    │   │   ├── generate.mjs           scaffolds first-pass components; never overwrites
    │   │   └── status.mjs             STATUS.md from the manifest (+ --check)
    │   ├── src/components/            one .tsx + one .stories.tsx (+ .test.tsx) each
    │   ├── src/foundations/           colour, type, spacing, radius, shadow, icon, motion pages
    │   ├── src/product/               composed product screens (dashboard, settings, billing)
    │   ├── CONVENTIONS.md             the rules components follow — read first
    │   └── STATUS.md                  generated component status
    ├── module-kit/          the module manifest contract (defineModule)
    ├── testing/             render wrapper, MSW server, Vitest setup
    ├── e2e/                 Playwright: every story renders + passes axe in both themes
    └── config/              eslint · typescript · test (Vitest) presets
```

Dependency direction is **apps → modules → packages**. Nothing points back.

## Commands

```bash
bun install
bun run storybook                           # http://localhost:6006
bun run --filter @repo/ui check-types       # must be 0 errors
bun run --filter @repo/ui lint              # eslint + STATUS.md/manifest consistency
bun run --filter @repo/ui test              # Vitest
bun run --filter @repo/ui storybook:build
bun run --filter @repo/e2e e2e              # after storybook:build; axe on every story, both themes
bun run --filter @repo/ui build:theme       # after editing tokens/tokens.mjs
bun run --filter @repo/ui status            # after editing scripts/manifest.mjs
```

Root scripts use `bun run --filter`, which works on every OS. The `turbo:*`
scripts are for macOS, Linux and CI: Turborepo can't spawn Bun on Windows
(`Unable to find package manager binary`).

## Design tokens

`packages/ui/tokens/tokens.mjs` holds a raw palette, semantic colours per
theme (light and dark), and scales (space, radius, type, shadow, motion,
control heights, z-index, breakpoints). `build-theme.mjs` generates:

- `src/styles/tokens.generated.css`: `--a-*` custom properties per theme
  (`[data-theme='dark']` switches);
- `src/styles/theme.generated.css`: a Tailwind `@theme inline` block that
  **resets Tailwind's default palette and scales**, so the only colours,
  radii, shadows and sizes a component can use are ours;
- `src/lib/tokens.generated.ts`: token names and values for types and the
  Foundations pages.

The generator also **fails the build if any text/background pair drops below
WCAG AA** (4.5:1 for text, 3:1 for input borders and the focus ring) in any
theme. Never hand-edit generated files; change the tokens or the generator.

## Why the tokens and CSS are ours (not Shopify Polaris)

This project started from a brief to reproduce Shopify Polaris pixel for
pixel by compiling Polaris's own stylesheet. We didn't do that. Every
published version of `@shopify/polaris`, `@shopify/polaris-tokens` and
`@shopify/polaris-icons` carries a clause on top of MIT. The clause allows
use only in applications that integrate or interoperate with Shopify, and
standalone applications must be "dissimilar and visually distinct from
Shopify products". Anumat ERP is standalone, so the library keeps the
architecture from that brief (owned source, Radix behaviour, generators,
Storybook taxonomy, the interface-state discipline and the accessibility
semantics) and uses its own visual language: indigo brand, slate neutrals,
flat 1px borders, system fonts and a 14px body. No Polaris code, CSS, tokens
or icons are used. Icons come from `lucide-react` (ISC).

## Storybook taxonomy

```
foundations   colours · typography · spacing · radius & shadows · icons · motion
primitives    button · input · checkbox · radio · select · switch · tooltip · badge …
components    card · modal · drawer · tabs · data table · resource list · toast …
patterns      search · filters · file upload · auth · empty / error / loading / permission / offline
product       dashboard · settings · billing
```

Every story file has a `Default` story and a story for each interface state
that applies (`Empty` ×3, `Loading`, `Error`, `Permission`, `Overflow`,
`Offline`), declared `argTypes`, and a description of when to use the
component **and when not to**. See `packages/ui/CONVENTIONS.md`.
