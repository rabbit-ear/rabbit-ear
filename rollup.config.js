// import minify from 'rollup-plugin-babel-minify';

module.exports = {
	input: 'src/index.js',
	output: {
		name: 'RabbitEar',
		file: 'rabbit-ear.js',
		format: 'umd',
		banner: "/* Rabbit Ear v2 (c) Robby Kraft, MIT License */"
	},
	// plugins: [
	// 	minify( {
	// 		bannerNewLine: true,
	// 		comments: false
	// 	} )
	// ]
};
