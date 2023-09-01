/**
 * Rabbit Ear (c) Kraft
 */
import { invertMap } from "../graph/maps.js";
import { makeFacesWinding } from "../graph/faces/winding.js";
import { makeEdgesFaces } from "../graph/make.js";
import { boundingBox } from "../graph/boundary.js";
import { distance } from "../math/vector.js";

const shortestEdgeLength = ({ vertices_coords, edges_vertices }) => {
	const lengths = edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]))
		.map(segment => distance(...segment));
	const minLen = lengths
		.reduce((a, b) => Math.min(a, b), Infinity);
	return minLen === Infinity ? undefined : minLen;
};

export const makeEpsilon = ({ vertices_coords, edges_vertices }) => {
	const shortest = shortestEdgeLength({ vertices_coords, edges_vertices });
	if (shortest) { return Math.max(shortest * 1e-4, 1e-10); }
	const bounds = boundingBox({ vertices_coords });
	return bounds && bounds.span
		? Math.max(1e-6 * Math.max(...bounds.span), 1e-10)
		: 1e-6;
};

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
 * @param {number[]} faceOrders an array of FOLD spec faceOrders.
 * @returns {number[][]} NxN matrix, number of faces, containing +1,-1,0
 * as values showing the relationship between i to j in face[i][j].
 * @linkcode Origami ./src/layer/general.js 54
 */
export const faceOrdersToMatrix = (faceOrders) => {
	const faces = [];
	faceOrders.forEach(order => {
		faces[order[0]] = undefined;
		faces[order[1]] = undefined;
	});
	const matrix = faces.map(() => []);
	faceOrders
		// .filter((_, i) => orders[condition_keys[i]] !== 0)
		.forEach(([a, b, c]) => {
			matrix[a][b] = c;
			matrix[b][a] = -c;
		});
	return matrix;
};
