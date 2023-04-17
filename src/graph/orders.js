/**
 * Rabbit Ear (c) Kraft
 */
import { dot } from "../math/algebra/vector.js";
import { uniqueSortedNumbers } from "../general/arrays.js";
import { makeFacesNormal } from "./normals.js";
import { topologicalSort } from "./topological.js";
import { makeVerticesVerticesUnsorted } from "./make.js";
import { invertMap } from "./maps.js";
import connectedComponents from "./connectedComponents.js";
// import { allLayerConditions } from "./globalSolver/index.js";
/**
 * @description given faceOrders and a list of faces, filter the list
 * of faceOrders so that it only contains orders between faces where
 * both faces are contained in the argument subset faces array.
 * @param {number[][]} faceOrders faceOrders array, as in the FOLD spec
 * @param {number[]} faces a list of face indices
 * @returns {number[][]} a subset of faceOrders
 */
export const faceOrdersSubset = (faceOrders, faces) => {
	const facesHash = {};
	faces.forEach(f => { facesHash[f] = true; });
	return faceOrders
		.filter(order => facesHash[order[0]] && facesHash[order[1]]);
};
/**
 * @description find a topological ordering from a set of faceOrders
 * @param {FOLD} graph a FOLD graph with faceOrders, and either faces_normal
 * pre-calculated, or faces_vertices and vertices_coords to get the normals.
 * @returns {number[]} layers_face, for every layer (key) which face (value) inhabits it.
 * @linkcode Origami ./src/layer/topological.js 10
 */
export const linearizeFaceOrders = ({
	vertices_coords, faces_vertices, faceOrders, faces_normal,
}) => {
	if (!faceOrders || !faceOrders.length) { return []; }
	if (!faces_normal) {
		faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	}
	// remove the third element from these arrays. only contains face indices.
	const ordersFacesOnly = faceOrders.flatMap(order => [order[0], order[1]]);
	const faces = uniqueSortedNumbers(ordersFacesOnly);
	const facesNormalMatch = [];
	faces.forEach(face => {
		facesNormalMatch[face] = dot(faces_normal[face], faces_normal[faces[0]]) > 0;
	});
	// this pair states face [0] is above face [1]. according to the +1 -1 order,
	// and whether or not the reference face [1] normal is flipped. (xor either)
	const directedEdges = faceOrders
		.map(order => ((order[2] === -1) ^ (!facesNormalMatch[order[1]])
			? [order[0], order[1]]
			: [order[1], order[0]]));
	return topologicalSort(directedEdges);
};
/**
 * @description Given a graph with a faces_layer, a topological sorting
 * of faces, for a flat-folded 2D graph, get an array where every face
 * is given a layer and a vector, which will always be [0, 0, 1].
 * @param {FOLD} graph a FOLD graph with the parameter faces_layer.
 * @returns {object[]} face-aligned array, one object per face,
 * each object with properties "vector" and "layer".
 * @linkcode Origami ./src/layer/nudge.js 16
 */
export const nudgeFacesWithFacesLayer = ({ faces_layer }) => {
	const faces_nudge = [];
	const layers_face = invertMap(faces_layer);
	layers_face.forEach((face, layer) => {
		faces_nudge[face] = {
			vector: [0, 0, 1],
			layer,
		};
	});
	return faces_nudge;
};
/**
 * @description Given a graph which contains a faceOrders, get an array
 * of information for each face, what is its displacement vector, and
 * what is its displacement magnitude integer, indicating which layer
 * this face lies on.
 * @param {FOLD} graph a FOLD graph with faceOrders.
 * @returns {object[]} face-aligned array, one object per face,
 * each object with properties "vector" and "layer".
 * @linkcode Origami ./src/layer/nudge.js 37
 */
export const nudgeFacesWithFaceOrders = ({ vertices_coords, faces_vertices, faceOrders }) => {
	const faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	// create a graph where the vertices are the faces, and edges
	// are connections between faces according to faceOrders
	// using this representation, find the disjoint sets of faces,
	// those which are isolated from each other according to layer orders
	const faces_sets = connectedComponents(makeVerticesVerticesUnsorted({
		edges_vertices: faceOrders.map(ord => [ord[0], ord[1]]),
	}));
	const sets_faces = invertMap(faces_sets)
		.map(el => (el.constructor === Array ? el : [el]));
	const sets_layers_face = sets_faces
		.map(faces => faceOrdersSubset(faceOrders, faces))
		.map(orders => linearizeFaceOrders({ faceOrders: orders, faces_normal }));
	const sets_normals = sets_faces.map(faces => faces_normal[faces[0]]);
	const faces_nudge = [];
	sets_layers_face.forEach((set, i) => set.forEach((face, index) => {
		faces_nudge[face] = {
			vector: sets_normals[i],
			layer: index,
		};
	}));
	return faces_nudge;
};

// export const nudgeFacesWithFaceOrders = ({ vertices_coords, faces_vertices, faceOrders }) => {
// 	const faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
// 	// create a graph where the vertices are the faces, and edges
// 	// are connections between faces according to faceOrders
// 	// using this representation, find the disjoint sets of faces,
// 	// those which are isolated from each other according to layer orders
// 	const faces_sets = connectedComponents(makeVerticesVerticesUnsorted({
// 		edges_vertices: faceOrders.map(ord => [ord[0], ord[1]]),
// 	}));
// 	const sets_faces = invertMap(faces_sets)
// 		.map(el => (el.constructor === Array ? el : [el]));
// 	const sets_layers_face = sets_faces
// 		.map(faces => topologicalOrder({ faceOrders, faces_normal }, faces));
// 	const sets_normals = sets_faces.map(faces => faces_normal[faces[0]]);
// 	const faces_nudge = [];
// 	sets_layers_face.forEach((set, i) => set.forEach((face, index) => {
// 		faces_nudge[face] = {
// 			vector: sets_normals[i],
// 			layer: index,
// 		};
// 	}));
// 	return faces_nudge;
// };
/**
 * @description for a flat-foldable origami, this will return
 * ONLY ONE of the possible layer arrangements of the faces.
 * first it finds all pairwise face layer conditions, then
 * finds a topological ordering of each condition.
 * @param {object} graph a FOLD object, make sure the vertices
 * have already been folded.
 * @returns {number[]} a faces_layer object, describing,
 * for each face (key) which layer the face inhabits (value)
 */
export const makeFacesLayer = ({ vertices_coords, faces_vertices, faceOrders, faces_normal }) => {
	if (!faces_normal) {
		faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	}
	return invertMap(linearizeFaceOrders({ faceOrders, faces_normal }));
};

// export const faceOrdersToFacesLayer = (graph) => {
// 	return topologicalOrder({ faceOrders, faces_normal }, faces);
// };

// const makeFacesLayer = (graph, epsilon) => {
// 	const conditions = allLayerConditions(graph, epsilon)[0];
// 	return invertMap(topologicalOrder(conditions, graph));
// };

// export default makeFacesLayer;
