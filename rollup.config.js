// import minify from "rollup-plugin-babel-minify";
// import json from "rollup-plugin-json";
import { string } from "rollup-plugin-string";
import cleanup from "rollup-plugin-cleanup";

module.exports = {
  input: "src/index.js",
  output: {
    name: "RabbitEar",
    file: "rabbit-ear.js",
    format: "umd",
    banner: "/* Rabbit Ear v0.2 (c) Robby Kraft, MIT License */",
    footer: "window.re = RabbitEar;",
  },
  plugins: [
    cleanup({
      comments: "none",
      maxEmptyLines: 0,
    }),
    // json({}),
    // minify( {
    //  bannerNewLine: true,
    //  comments: false
    // } ),
    string({
      include: ["**/*.json", "**/*.fold"], // allows .fold files to be imported as a module
    }),
  ],
};
