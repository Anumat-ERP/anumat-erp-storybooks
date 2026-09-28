import type { ReactNode } from 'react';

/** Shared layout for foundation pages. Not exported from the package. */
export function TokenTable({ children, columns }: { children: ReactNode; columns: string[] }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-border text-start text-fg-muted">
          {columns.map((c) => (
            <th key={c} scope="col" className="py-2 pe-4 text-start font-medium">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export function TokenName({ children }: { children: ReactNode }) {
  return <code className="rounded-sm bg-surface-sunken px-1 py-0.5 font-mono text-xs text-fg">{children}</code>;
}

export function Section({ title, description, children }: { title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-10 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-fg">{title}</h2>
        {description ? <p className="max-w-prose text-md text-fg-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
