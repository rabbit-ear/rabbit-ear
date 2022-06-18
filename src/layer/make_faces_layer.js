/**
 * Rabbit Ear (c) Kraft
 */
import { one_layer_conditions } from "./global_solver/index";
import topological_order from "./global_solver/topological_order";
import { invert_map } from "../graph/maps";
/**
 * @description for a flat-foldable origami, this will return
 * ONLY ONE of the possible layer arrangements of the faces.
 * first it finds all pairwise face layer conditions, then
 * finds a topological ordering of each condition.
 * @param {object} graph a FOLD object, make sure the vertices
 * have already been folded.
 * @param {number} [epsilon=1e-6] an optional epsilon value
 * @returns {number[]} a faces_layer object, describing, for each face (key) which layer the face inhabits (value)
 */
const make_faces_layer = (graph, epsilon) => {
	const conditions = one_layer_conditions(graph, epsilon);
	return invert_map(topological_order(conditions, graph));
};

export default make_faces_layer;
