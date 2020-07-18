// MIT open source license, Robby Kraft

import * as Create from "../core/create";
import {
  file_spec,
  file_creator
} from "../core/keys";
import prototype from "./prototype";
import Static from "./Static";
import { possibleFoldObject } from "../core/validate";

const CP = function (options = {}) {
  const imported = !!(possibleFoldObject(arguments[0]))
    ? arguments[0]
    : {};
  // should CP({vertices_coords:[], ...}) deep copy the argument object?
  const cp = Object.assign(
    Object.create(prototype),
    Create.empty(),
    imported,
    { file_spec, file_creator }
  );
  Object.entries(options).forEach(([key, value]) => {
    cp[key] = value;
  });
  return cp;
};

Static(CP);

export default CP;
