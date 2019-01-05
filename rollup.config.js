// import minify from 'rollup-plugin-babel-minify';
// import json from 'rollup-plugin-json';
import string from 'rollup-plugin-string';

module.exports = {
	input: 'src/index.js',
	output: {
		name: 'RabbitEar',
		file: 'rabbit-ear.js',
		format: 'umd',
		banner: "/* Rabbit Ear v2 (c) Robby Kraft, MIT License */"
	},
	plugins: [
		// json({}),
		// minify( {
		// 	bannerNewLine: true,
		// 	comments: false
		// } )
		string({
			include: '**/*.fold',  // allows .fold files to be imported as a module
		})
	]
};
