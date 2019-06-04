
import math from "../include/math";
import * as svg from "../include/svg";
import Graph from "./Graph";

const core = Object.create(null);

const rabbitEar = {
  Graph,
  svg,
  core,
  math,
  // math: math.core,
};

Object.keys(math)
  .filter(key => key !== "core")
  .forEach((key) => { rabbitEar[key] = math[key]; });

export default rabbitEar;
