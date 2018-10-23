// import serve from 'rollup-plugin-serve';
// import livereload from 'rollup-plugin-livereload';
// import bundleSize from 'rollup-plugin-bundle-size';
// import { terser } from 'rollup-plugin-terser';

module.exports = {
	input: 'srcf/index.js',
	output: {
		name: 'RabbitEar',
		file: 'rabbit-ear.js',
		format: 'umd',
		strict: false,
		banner: "/* Rabbit Ear v2 (c) Robby Kraft, MIT License */"
	},
};
