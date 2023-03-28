/**
 * Rabbit Ear (c) Kraft
 */
import { makeFacesNormal } from "../graph/normals.js";
// import { allLayerConditions } from "./globalSolver/index.js";
import topologicalOrder from "./topological.js";
import { invertMap } from "../graph/maps.js";
/**
 * @description for a flat-foldable origami, this will return
 * ONLY ONE of the possible layer arrangements of the faces.
 * first it finds all pairwise face layer conditions, then
 * finds a topological ordering of each condition.
 * @param {object} graph a FOLD object, make sure the vertices
 * have already been folded.
 * @param {number} [epsilon=1e-6] an optional epsilon value
 * @returns {number[]} a faces_layer object, describing,
 * for each face (key) which layer the face inhabits (value)
 */

export const makeFacesLayer = (graph) => {
	let { faceOrders, faces_normal } = graph;
	if (!faces_normal) {
		faces_normal = makeFacesNormal(graph);
	}
	return invertMap(topologicalOrder({ faceOrders, faces_normal }));
};

// export const faceOrdersToFacesLayer = (graph) => {
// 	return topologicalOrder({ faceOrders, faces_normal }, faces);
// };

// const makeFacesLayer = (graph, epsilon) => {
// 	const conditions = allLayerConditions(graph, epsilon)[0];
// 	return invertMap(topologicalOrder(conditions, graph));
// };

// export default makeFacesLayer;
