/**
 * Rabbit Ear (c) Kraft
 */
import { invertMap } from "../graph/maps";
import { makeFacesWinding } from "../graph/facesWinding";
import { makeEdgesFaces } from "../graph/make";
/**
 * @description Flip a model over by reversing the order of the faces
 * in a faces_layer encoding.
 * @param {number[]} faces_layer a faces_layer array
 * @returns {number[]} a new faces_layer array
 * @linkcode Origami ./src/layer/general.js 12
 */
export const flipFacesLayer = faces_layer => invertMap(
	invertMap(faces_layer).reverse(),
);
/**
 * @description Given a faces_layer ordering of faces in a graph,
 * complute the edges_assignments, including "B", "F", "V", and "M".
 * @param {FOLD} graph a FOLD graph, with the vertices already folded.
 * @param {number[]} faces_layer a faces_layer array
 * @returns {string[]} an edges_assignment array.
 * @linkcode Origami ./src/layer/general.js 23
 */
export const facesLayerToEdgesAssignments = (graph, faces_layer) => {
	const edges_assignment = [];
	const faces_winding = makeFacesWinding(graph);
	// set boundary creases
	const edges_faces = graph.edges_faces
		? graph.edges_faces
		: makeEdgesFaces(graph);
	edges_faces.forEach((faces, e) => {
		if (faces.length === 1) { edges_assignment[e] = "B"; }
		if (faces.length === 2) {
			const windings = faces.map(f => faces_winding[f]);
			if (windings[0] === windings[1]) {
				edges_assignment[e] = "F";
				return;
			}
			const layers = faces.map(f => faces_layer[f]);
			const local_dir = layers[0] < layers[1];
			const global_dir = windings[0] ? local_dir : !local_dir;
			edges_assignment[e] = global_dir ? "V" : "M";
		}
	});
	return edges_assignment;
};
/**
 * @description Convert a set of face-pair layer orders (+1,-1,0)
 * into a face-face relationship matrix.
 * @param {object} facePairOrders object one set of face-pair layer orders (+1,-1,0)
 * @returns {number[][]} NxN matrix, number of faces, containing +1,-1,0
 * as values showing the relationship between i to j in face[i][j].
 * @linkcode Origami ./src/layer/general.js 54
 */
export const ordersToMatrix = (orders) => {
	const condition_keys = Object.keys(orders);
	const face_pairs = condition_keys
		.map(key => key.split(" ").map(n => parseInt(n, 10)));
	const faces = [];
	face_pairs
		.reduce((a, b) => a.concat(b), [])
		.forEach(f => { faces[f] = undefined; });
	const matrix = faces.map(() => []);
	face_pairs
		// .filter((_, i) => orders[condition_keys[i]] !== 0)
		.forEach(([a, b]) => {
			matrix[a][b] = orders[`${a} ${b}`];
			matrix[b][a] = -orders[`${a} ${b}`];
		});
	return matrix;
};
