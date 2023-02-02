import json from "@rollup/plugin-json";
import cleanup from "rollup-plugin-cleanup";
import terser from "@rollup/plugin-terser";
import { string } from "rollup-plugin-string";

const version = "0.9.33 alpha 2023-02-02";
const input = "src/index.js";
const name = "ear";
const banner = `/* Rabbit Ear ${version} (c) Kraft, MIT License */\n`;

const pluginString = string({
	include: ["**/*.frag", "**/*.vert"],
	// exclude: ["**/index.html"],
});

export default [{
	input,
	output: {
		name,
		file: "rabbit-ear.js",
		format: "umd",
		banner,
	},
	plugins: [json(), cleanup(), pluginString],
}, {
	input,
	output: {
		name,
		file: "rabbit-ear.module.js",
		format: "es",
		banner,
	},
	plugins: [json(), cleanup(), pluginString],
}, {
	input,
	output: {
		name,
		file: "rabbit-ear.comments.js",
		format: "es",
		banner,
	},
	plugins: [json(), pluginString],
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
		pluginString,
		terser({
			keep_fnames: true,
			format: {
				comments: "all",
			},
		}),
	],
}];
