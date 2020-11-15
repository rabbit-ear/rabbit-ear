import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import cleanup from "rollup-plugin-cleanup";
import { string } from "rollup-plugin-string";

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
    nodeResolve(),
    // babel({
    //   babelHelpers: "bundled",
    //   presets: ["@babel/preset-env"]
    // }),
    cleanup(),
    // terser({
    //   compress: { properties: false }
    // }),
    string({
      include: ["**/*.json", "**/*.fold"], // allows .fold files to be imported as a module
    }),
  ],
}];
