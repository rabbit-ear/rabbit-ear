import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import cleanup from "rollup-plugin-cleanup"
import { terser } from "rollup-plugin-terser";

const version = "0.9.0 alpha 2021-01-08";

module.exports = [{
  input: "src/index.js",
  output: {
    name: "ear",
    file: "rabbit-ear.js",
    format: "umd",
    banner: `/* Rabbit Ear ${version} (c) Robby Kraft, MIT License */`,
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

