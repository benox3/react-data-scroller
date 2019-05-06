import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json';

const isProd = process.env.BUILD === 'production';
const getDestination = dest => {
  if (isProd) return dest.replace('.js', '.min.js');
  return dest;
};

export default {
  input: './src/index.ts',
  output: [
    {
      format: 'cjs',
      file: getDestination(pkg.main),
      name: 'DataScroller',
      exports: 'named',
    },
    {
      format: 'es',
      file: getDestination(pkg.module),
      name: 'DataScroller',
    },
  ],
  plugins: [
    typescript({useTsconfigDeclarationDir: true}),
    postcss({
      plugins: [],
    }),
  ],
  external: ['react']
};
