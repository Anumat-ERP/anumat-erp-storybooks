/**
 * The contract every business module (`modules/*`) exports.
 *
 * Dependency direction is apps → modules → packages. A module may import from
 * packages; a package never imports from a module. A package that knows what
 * an invoice is has become a module.
 */
export interface ModuleManifest {
  /** Stable machine id, kebab-case. Used as route prefix and permission namespace. */
  id: string;
  /** Human-readable name shown in navigation. */
  name: string;
  /** SemVer of the module's public contract. */
  version: string;
  /** Other module ids this one requires at runtime. */
  dependsOn?: readonly string[];
  /** Permissions the module declares; the host decides who holds them. */
  permissions?: readonly ModulePermission[];
  /** Navigation entries contributed to the host shell. */
  navigation?: readonly ModuleNavItem[];
}

export interface ModulePermission {
  /** `<module-id>:<action>`, e.g. `invoices:write`. */
  key: `${string}:${string}`;
  description: string;
}

export interface ModuleNavItem {
  label: string;
  href: string;
  /** Permission required to see the entry. */
  permission?: ModulePermission['key'];
}

const ID = /^[a-z][a-z0-9-]*$/;

/** Identity helper that validates the manifest at definition time. */
export function defineModule<const M extends ModuleManifest>(manifest: M): M {
  const problems = validateManifest(manifest);
  if (problems.length > 0) {
    throw new Error(`Invalid module manifest "${manifest.id}":\n- ${problems.join('\n- ')}`);
  }
  return manifest;
}

export function validateManifest(manifest: ModuleManifest): string[] {
  const problems: string[] = [];
  if (!ID.test(manifest.id)) problems.push(`id must match ${ID}`);
  if (!/^\d+\.\d+\.\d+/.test(manifest.version)) problems.push('version must be SemVer');
  for (const p of manifest.permissions ?? []) {
    if (!p.key.startsWith(`${manifest.id}:`)) {
      problems.push(`permission "${p.key}" must be namespaced "${manifest.id}:"`);
    }
  }
  if (manifest.dependsOn?.includes(manifest.id)) problems.push('a module cannot depend on itself');
  return problems;
}
