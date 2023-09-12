import typescript from '@rollup/plugin-typescript';

const commonOutputOptions = {
  sourcemap: false,
  exports: 'named',
};

const commonPlugins = [
  typescript({
    tsconfig: './tsconfig.esm.json',
    sourceMap: false,
  }),
];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createConfig = (input, fileDir, name) => ({
  input,
  output: [
    {
      file: `${fileDir}/index.mjs`,
      format: 'es',
      ...commonOutputOptions,
    },
    {
      file: `${fileDir}/index.umd.js`,
      format: 'umd',
      name,
      ...commonOutputOptions,
    },
  ],
  plugins: commonPlugins,
});

export default [
  createConfig('src/index.ts', 'dist', 'Schemulous'),
  createConfig('src/core/index.ts', 'dist/core', 'SchemulousCore'),
  createConfig(
    'src/extensions/index.ts',
    'dist/extensions',
    'SchemulousExtensions'
  ),
];
