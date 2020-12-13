import json from "@rollup/plugin-json";
import cleanup from "rollup-plugin-cleanup"

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
    cleanup()
  ]
}];
