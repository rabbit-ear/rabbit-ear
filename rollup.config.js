import cleanup from "rollup-plugin-cleanup";
import terser from "@rollup/plugin-terser";

const version = "0.9.33 alpha 2023-02-21";
const input = "src/index.js";
const name = "ear";
const banner = `/* Rabbit Ear ${version} (c) Kraft, MIT License */\n`;

export default [{
	input,
	output: {
		name,
		file: "rabbit-ear.js",
		format: "umd",
		banner,
		compact: true,
		generatedCode: {
			constBindings: true,
			objectShorthand: true,
		},
	},
	plugins: [
		cleanup(),
	],
}, {
	input,
	output: {
		name,
		file: "rabbit-ear.module.js",
		format: "es",
		banner,
		compact: true,
		generatedCode: {
			constBindings: true,
			objectShorthand: true,
		},
		// sourcemap: true,
	},
	plugins: [
		cleanup(),
		terser({ compress: false, format: { comments: false } }),
	],
}, {
	input,
	output: {
		name,
		file: "rabbit-ear.comments.js",
		format: "es",
		banner,
		generatedCode: {
			constBindings: true,
			objectShorthand: true,
		},
	},
}, {
	input,
	output: {
		name,
		file: "rabbit-ear.min.js",
		format: "umd",
		banner,
	},
	plugins: [
		terser({
			keep_fnames: true,
			format: {
				comments: false,
			},
		}),
	],
}, {
	input,
	output: {
		name,
		dir: "module/",
		format: "es",
		banner,
		preserveModules: true,
		generatedCode: {
			constBindings: true,
			objectShorthand: true,
		},
		// sourcemap: true,
	},
	plugins: [
		cleanup(),
	],
}];
