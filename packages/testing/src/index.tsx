import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement, ReactNode } from 'react';

function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/** Render with the app-wide providers and a ready user-event instance. */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return { user: userEvent.setup(), ...render(ui, { wrapper: Providers, ...options }) };
}

export * from '@testing-library/react';
export { userEvent };
