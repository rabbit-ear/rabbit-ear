import json from "@rollup/plugin-json";
import cleanup from "rollup-plugin-cleanup";
import { terser } from "rollup-plugin-terser";

const version = "0.9.33 alpha 2022-07-29";
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
	},
	plugins: [json(), cleanup()],
}, {
	input,
	output: {
		name,
		file: "rabbit-ear.module.js",
		format: "es",
		banner,
	},
	plugins: [json(), cleanup()],
}, {
	input,
	output: {
		name,
		file: "rabbit-ear.comments.js",
		format: "es",
		banner,
	},
	plugins: [json()],
}, {
	input,
	output: {
		name,
		file: "rabbit-ear.min.js",
		format: "umd",
		banner,
	},
	plugins: [
		json(),
		cleanup(),
		terser({
			keep_fnames: true,
			format: {
				comments: "all",
			},
		}),
	],
}];
