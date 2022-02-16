/**
 * Rabbit Ear (c) Robby Kraft
 */
import { all_layer_conditions } from "./global_solver/index";
import {
  topological_order,
  complete_topological_order,
} from "./global_solver/topological_order";
import { invert_map } from "../graph/maps";
/**
 * @description for a flat-foldable origami, this will return
 * all of the possible layer arrangements of the faces.
 * first it finds all pairwise face layer conditions, then
 * finds a topological ordering of each condition.
 * @param {object} a FOLD object, make sure the vertices
 * have already been folded.
 */
const make_faces_layers = (graph, epsilon) =>
  all_layer_conditions(graph, epsilon)
    .map(topological_order)
    .map(layers_face => layers_face === undefined
      ? []
      : complete_topological_order(graph, layers_face));

export default make_faces_layers;
