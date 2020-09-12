// MIT open source license, Robby Kraft

// import * as Create from "../core/create";
import prototype from "./prototype";
import {
  file_spec,
  file_creator,
  fold_object_certainty,
} from "../core/keys";

const Graph = function () {
  // should Graph({vertices_coors:[], ...}) deep copy the argument object?
  return Object.assign(
    Object.create(prototype),
    ...Array.from(arguments).filter(a => fold_object_certainty(a)),
    { file_spec, file_creator }
  );
};

Graph.prototype = prototype;
Graph.prototype.constructor = Graph;

export default Graph;
