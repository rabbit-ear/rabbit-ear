// MIT open source license, Robby Kraft

import * as Create from "../FOLD/create";
import prototype from "./prototype";
import {
  file_spec,
  file_creator
} from "../FOLD/keys";

const Graph = function (object = {}) {
  // should Graph({vertices_coors:[], ...}) deep copy the argument object?
  return Object.assign(
    Object.create(prototype()),
    Create.empty(),
    object,
    { file_spec, file_creator }
  );
};

export default Graph;
