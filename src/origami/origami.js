/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import { fn_cat } from "../symbols/functions";
import GraphProto from "./graph";
import { clip_line } from "../graph/clip";
import add_vertices from "../graph/add/add_vertices";
import {
  VERTICES,
  EDGES,
  FACES,
} from "../graph/fold_keys";
import {
  get_graph_keys_with_prefix,
} from "../graph/fold_spec";
import flat_fold from "../graph/flat_fold/index";
import {
  make_vertices_coords_folded
} from "../graph/make";
import clone from "../graph/clone";

/**
 * Origami - a model of an origami paper
 * prototype is Graph
 */
const Origami = {};
Origami.prototype = Object.create(GraphProto);
Origami.prototype.constructor = Origami;

Origami.prototype.flatFold = function () {
  const line = math.core.get_line(arguments);
  const graph = flat_fold(this, line.vector, line.origin);
  [VERTICES, EDGES, FACES]
    .map(key => get_graph_keys_with_prefix(this, key))
    .reduce(fn_cat, [])
    .forEach(key => delete this[key]);
  Object.assign(this, graph);
  return this;
};

Origami.prototype.copy = function () {
  return Object.assign(Object.create(Origami.prototype), clone(this));
};

Origami.prototype.folded = function () {
  const vertices_coords = make_vertices_coords_folded(this, ...arguments);
  return Object.assign(
    Object.create(Origami.prototype),
    Object.assign(clone(this), { vertices_coords }, { frame_classes: ["foldedForm"] }));
};

export default Origami.prototype;

