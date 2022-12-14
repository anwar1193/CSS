module.exports = {
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        modules: false,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
    'babel-plugin-add-import-extension',
    [
      '@babel/plugin-proposal-object-rest-spread',
      {
        loose: true,
        useBuiltIns: true,
      },
    ],
    'dev-expression',
  ],
  env: {
    test: {
      presets: ['@babel/env'],
      plugins: ['@babel/plugin-transform-runtime'],
    },
    dev: {
      plugins: [
        [
          'transform-inline-environment-variables',
          {
            include: ['NODE_ENV'],
          },
        ],
      ],
    },
  },
};
