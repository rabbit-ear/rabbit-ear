import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import cleanup from "rollup-plugin-cleanup"
import { terser } from "rollup-plugin-terser";

const version = "0.9.2 alpha 2022-01-28";
const input = "src/index.js";
const name = "ear";
const banner = `/* Rabbit Ear ${version} (c) Robby Kraft, MIT License */\n`;

module.exports = [{
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
    // terser({
    //   keep_fnames: true,
    //   format: {
    //     comments: "all",
    //   },
    // }),
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

