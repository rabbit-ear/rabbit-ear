import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import cleanup from "rollup-plugin-cleanup"
import { terser } from "rollup-plugin-terser";

const version = "0.1.91";

module.exports = [{
  input: "src/index.js",
  output: {
    name: "ear",
    file: "rabbit-ear.js",
    format: "umd",
    // format: "es",
    banner: `/* Rabbit Ear v${version} (c) Robby Kraft, MIT License */`,
  },
  plugins: [
    json(),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"]
    }),
    cleanup(),
    // terser(),
  ]
}];

