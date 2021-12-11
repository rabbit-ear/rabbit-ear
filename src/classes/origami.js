/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import * as S from "../general/strings";
import { fn_cat } from "../general/functions";
import { get_graph_keys_with_prefix } from "../fold/spec";
import GraphProto from "./graph";
import flat_fold from "../graph/flat_fold/index";
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
  [S._vertices, S._edges, S._faces]
    .map(key => get_graph_keys_with_prefix(this, key))
    .reduce(fn_cat, [])
    .forEach(key => delete this[key]);
  Object.assign(this, graph);
  return this;
};

export default Origami.prototype;
