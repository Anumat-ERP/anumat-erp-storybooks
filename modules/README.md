# modules/

Business capabilities (orders, invoicing, inventory…). Each module is a
workspace package that exports a manifest built with `defineModule` from
`@repo/module-kit`, and keeps its screens' stories under `ui/**` so the
library Storybook picks them up.

Dependency direction is **apps → modules → packages**. Modules may import
packages; packages never import modules. A package that knows what an invoice
is has become a module.

Empty in the library repo by design.
