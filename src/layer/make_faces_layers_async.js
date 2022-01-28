/**
 * Rabbit Ear (c) Robby Kraft
 */
import { all_layer_conditions } from "./global_solver/index";
import topological_order from "./global_solver/topological_order";
import { invert_map } from "../graph/maps";
/**
 * @description for a flat-foldable origami, this will return
 * all of the possible layer arrangements of the faces.
 * first it finds all pairwise face layer conditions, then
 * finds a topological ordering of each condition.
 * @param {object} a FOLD object, make sure the vertices
 * have already been folded.
 */
const make_faces_layers_async = (graph, epsilon, timeout = 2000) => {
  var timer = new Promise((resolve, reject) => {
    setTimeout(() => reject(), timeout);
  });
  var solver = new Promise((resolve, reject) => resolve(
    all_layer_conditions(graph, epsilon)));
  return Promise.race([solver, timer])
    .then((value) => value.map(topological_order).map(invert_map))
    .catch((err) => {
      console.warn("make_faces_layers_async timeout. to increase timeout, use third parameter (graph, epsilon, timeout)");
      return [];
    });
};

export default make_faces_layers_async;

  // console.log(`${Date.now() - startDate}ms recurse_count`, recurse_count, "inner_loop_count", inner_loop_count);
