// MIT open source license, Robby Kraft

import * as Create from "../FOLD/create";
import {
  file_spec,
  file_creator
} from "../FOLD/keys";
import prototype from "./prototype";
import Static from "./Static";
import { possibleFoldObject } from "../FOLD/validate";

const CP = function () {
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
  // apply static methods.
  // todo. can this be pre-built? pre-attached?
  // how much time does this attach operation take?
  // static(cp);

  return cp;
};

Static(CP);

export default CP;
