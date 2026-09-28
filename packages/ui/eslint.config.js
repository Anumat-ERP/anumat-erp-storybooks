import config from '@repo/eslint-config/react';

export default [...config, { ignores: ['scripts/**', 'tokens/**'] }];
