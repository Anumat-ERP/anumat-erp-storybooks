import type { UserConfig } from 'vitest/config';

export function createVitestConfig(overrides?: NonNullable<UserConfig['test']>): UserConfig;
