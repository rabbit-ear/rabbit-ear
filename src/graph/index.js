// MIT open source license, Robby Kraft

import * as Create from "../core/create";
import prototype from "./prototype";
import {
  file_spec,
  file_creator
} from "../core/keys";

const Graph = function (object = {}) {
  // should Graph({vertices_coors:[], ...}) deep copy the argument object?
  return Object.assign(
    Object.create(prototype),
    Create.empty(),
    object,
    { file_spec, file_creator }
  );
};

Graph.prototype = prototype;
Graph.prototype.constructor = Graph;

export default Graph;
