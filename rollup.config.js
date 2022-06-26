import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import cleanup from "rollup-plugin-cleanup"
import { terser } from "rollup-plugin-terser";

const version = "0.9.3 alpha 2022-06-26";
const input = "src/index.js";
const name = "ear";
const banner = `/* Rabbit Ear ${version} (c) Kraft, MIT License */\n`;

module.exports = [{
  input,
  output: {
    name,
    file: "rabbit-ear.es.js",
    format: "es",
    banner
  },
  plugins: [ json(), cleanup() ]
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
    file: "rabbit-ear.js",
    format: "umd",
    banner,
  },
  plugins: [
    json(),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"]
    }),
    cleanup(),
  ]
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
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"]
    }),
    cleanup(),
    terser({
      keep_fnames: true,
      format: {
        comments: "all",
      },
    }),
  ]
}];

