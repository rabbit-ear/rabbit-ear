// MIT open source license, Robby Kraft

import * as Create from "../FOLD/create";
import prototype from "./prototype";
import {
  file_spec,
  file_creator
} from "../FOLD/keys";

const CP = function (object = {}) {
  // should CP({vertices_coords:[], ...}) deep copy the argument object?
  const cp = Object.assign(
    Object.create(prototype),
    Create.empty(),
    object,
    { file_spec, file_creator }
  );

  let isClean = true;

  Object.defineProperty(cp, "isClean", {
    get: () => isClean,
    set: (c) => { isClean = c; },
    enumerable: false
  });
  return cp;
};

export default CP;
