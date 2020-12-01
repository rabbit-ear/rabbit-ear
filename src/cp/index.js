/**
 * Rabbit Ear (c) Robby Kraft
 */
// import * as Create from "../core/create";
import prototype from "./prototype";
import Static from "./Static";
import {
  file_spec,
  file_creator,
} from "../graph/fold_keys";
import {
  fold_object_certainty,
} from "../graph/fold_spec"

const CreasePattern = function () {
  // should CreasePattern({vertices_coords:[], ...}) deep copy the argument object?
  return Object.assign(
    Object.create(prototype),
    ...Array.from(arguments).filter(a => fold_object_certainty(a)),
    { file_spec, file_creator }
  );
};

Static(CreasePattern);

CreasePattern.prototype = prototype;
CreasePattern.prototype.constructor = CreasePattern;

export default CreasePattern;
