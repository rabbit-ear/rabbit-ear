/**
 * Rabbit Ear (c) Kraft
 */
import { oneLayerConditions } from "./globalSolver/index";
import topologicalOrder from "./globalSolver/topologicalOrder";
import { invertMap } from "../graph/maps";
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
const makeFacesLayer = (graph, epsilon) => {
	const conditions = oneLayerConditions(graph, epsilon);
	return invertMap(topologicalOrder(conditions, graph));
};

export default makeFacesLayer;
