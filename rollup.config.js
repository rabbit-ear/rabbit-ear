// import babel from "@rollup/plugin-babel";
// import { terser } from "rollup-plugin-terser";
import { nodeResolve } from '@rollup/plugin-node-resolve';
// import { string } from "rollup-plugin-string";
import cleanup from "rollup-plugin-cleanup";

const version = "0.1.91";

module.exports = [{
  input: "src/index.js",
  output: {
    name: "ear",
    file: "rabbit-ear.js",
    format: "umd",
    banner: `/* Rabbit Ear v${version} (c) Robby Kraft, MIT License */`,
  },
  plugins: [
    nodeResolve(),
    // string({
    //   include: ["**/*.json", "**/*.fold"], // allows .fold files to be imported as a module
    // }),
    // babel({
    //   babelHelpers: "bundled",
    //   presets: ["@babel/preset-env"]
    // }),
    // terser(),
    cleanup(),
  ],
// },
// {
//   input: "src/index.js",
//   output: {
//     name: "ear",
//     file: "rabbit-ear.min.js",
//     format: "umd",
//     banner: `/* Rabbit Ear v${version} (c) Robby Kraft, MIT License */`,
//   },
//   plugins: [
//     resolve(),
//     cleanup({
//       comments: "none",
//       maxEmptyLines: 0,
//     }),
//     babel({
//       babelrc: false,
//       presets: [["@babel/env", { modules: false }]],
//     }),
//     minify({ mangle: { names: false } }),
//     string({
//       include: ["**/*.json", "**/*.fold"], // allows .fold files to be imported as a module
//     }),
//   ]
}];
