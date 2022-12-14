import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import bundleSize from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';
import license from 'rollup-plugin-license';
import flowEntry from 'rollup-plugin-flow-entry';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import pkg from '../package.json';

const getFileName = input => input.split('/')[1].split('.')[0];

const inputs = ['src/popper.js', 'src/popper-lite.js', 'src/popper-base.js'];
const bundles = [
  { inputs, format: 'umd', dir: 'dist', minify: true, flow: true },
  { inputs, format: 'umd', dir: 'dist', flow: true },
  { inputs, format: 'cjs', dir: 'dist' },
];

const configs = bundles
  .map(({ inputs, dir, format, minify, flow }) =>
    inputs.map(input => ({
      input,
      plugins: [
        format === 'umd' &&
          replace({
            __DEV__: minify ? 'false' : 'true',
          }),
        babel(),
        // The two minifiers together seem to procude a smaller bundle 🤷‍♂️
        minify && compiler(),
        minify && terser(),
        license({ banner: `@popperjs/core v${pkg.version}` }),
        flow && flowEntry(),
        bundleSize(),
        visualizer({
          sourcemap: true,
          filename: `stats/${getFileName(input)}${minify ? '-min' : ''}.html`,
        }),
      ].filter(Boolean),
      output: {
        name: 'Popper',
        file: `${dir}/${format}/${getFileName(input)}${
          minify ? '.min' : ''
        }.js`,
        format,
        sourcemap: true,
      },
    }))
  )
  .flat();

export default configs;
