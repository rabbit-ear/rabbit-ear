// import serve from 'rollup-plugin-serve';
// import livereload from 'rollup-plugin-livereload';
// import bundleSize from 'rollup-plugin-bundle-size';
// import { terser } from 'rollup-plugin-terser';

module.exports = {
  input: 'src/index.js',
  output: {
    name: 'RabbitEar',
    file: 'RabbitEar.js',
    format: 'umd'
  }
};
