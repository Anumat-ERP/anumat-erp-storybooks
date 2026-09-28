import config from '@repo/eslint-config/react';

export default [...config, { ignores: ['.next/**', 'next-env.d.ts'] }];
