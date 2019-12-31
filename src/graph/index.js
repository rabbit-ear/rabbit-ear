// MIT open source license, Robby Kraft

import * as Create from "../FOLD/create";
import prototype from "./prototype";
import { keys } from "../FOLD/keys";

const Graph = function (object = {}) {
  const graph = Object.assign(
    Object.create(prototype()),
    Create.empty()
  );
  Object.keys(object)
    .filter(key => key !== "file_spec")
    .filter(key => key !== "file_creator")
    .filter(key => keys.includes(key))
    .forEach((key) => { graph[key] = object[key]; });
  return graph;
};

export default Graph;
