/**
 * Rabbit Ear (c) Kraft
 */
import { dot } from "../math/vector.js";
import { uniqueSortedNumbers } from "../general/array.js";
import { makeFacesNormal } from "./normals.js";
import { topologicalSort } from "./directedGraph.js";
import { makeVerticesVerticesUnsorted } from "./make.js";
import { invertMap, invertMapArray } from "./maps.js";
import { connectedComponents } from "./connectedComponents.js";
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
 * @description Find a topological ordering from a set of faceOrders.
 * The user can supply the face for which the normal will set the
 * direction of the linearization, if none is selected the face with
 * the lowest index number is chosen.
 * The faceOrders should contain faces which all lie in a plane, otherwise
 * this will attempt to linearize faces along a direction that is
 * meaningless (a vector inside of the plane of the faces).
 * So, for 3D models, this method should be run multiple times, each time
 * on a subset of faceOrders, containing only those faces which are coplanar
 * (and ideally, connected and overlapping).
 * This will not return a linearization including all faces in a graph,
 * it only includes faces found in faceOrders.
 * @param {FOLD} graph a FOLD graph with faceOrders, and either faces_normal
 * pre-calculated, or faces_vertices and vertices_coords to get the normals.
 * @returns {number[]} layers_face, for every layer (key) which face (value)
 * inhabits it. This only includes faces which are found in faceOrders.
 * @linkcode Origami ./src/layer/topological.js 10
 */
export const linearizeFaceOrders = ({ faceOrders, faces_normal }, rootFace) => {
	if (!faceOrders || !faceOrders.length) { return []; }
	// get a flat, unique, array of all faces present in faceOrders
	const faces = uniqueSortedNumbers(faceOrders
		.flatMap(order => [order[0], order[1]]));
	// we need to pick one face which determines the linearization direction.
	// if the user supplied rootFace is not in "faces", ignore it.
	const normal = rootFace !== undefined && faces.includes(rootFace)
		? faces_normal[rootFace]
		: faces_normal[faces[0]];
	// create a lookup. for every face, does its normal match the normal
	// we just chose to represent the linearization direction?
	const facesNormalMatch = [];
	faces.forEach(f => {
		facesNormalMatch[f] = dot(faces_normal[f], normal) > 0;
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
 * todo: assuming faces_vertices instead of faces_edges
 * @returns {number[]} layers_face
 */
const fillInMissingFaces = ({ faces_vertices }, faces_layer) => {
	if (!faces_vertices) { return faces_layer; }
	const missingFaces = faces_vertices
		.map((_, i) => i)
		.filter(i => faces_layer[i] == null);
	return missingFaces.concat(invertMap(faces_layer));
};
/**
 * @description Find a topological ordering of all faces in a graph.
 * This method is intended for 2D flat foldings. This requires
 * the graph with folded vertices_coords, a crease pattern will not work.
 * This method is inclusive and will include all faces from the graph
 * in the result, even those which have no ordering. The method will first
 * sort all faces which do have an ordering, then find any remaining faces,
 * and add these faces in no particular order onto the beginning of the list,
 * so that the faces with an order will be at the end (on top, painters algorithm).
 * @param {FOLD} graph a FOLD graph with either faceOrders or faces_layer.
 * @returns {number[]} layers_face, for every layer (key),
 * which face (value) inhabits it.
 * @linkcode Origami ./src/layer/topological.js 10
 */
export const linearize2DFaces = ({
	vertices_coords, faces_vertices, faceOrders, faces_layer, faces_normal,
}, rootFace) => {
	if (!faces_normal) {
		faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	}
	if (faceOrders) {
		return fillInMissingFaces(
			{ faces_vertices },
			invertMap(linearizeFaceOrders({ faceOrders, faces_normal }, rootFace)),
		);
	}
	if (faces_layer) {
		return fillInMissingFaces({ faces_vertices }, faces_layer);
	}
	// no face order exists, just return all face indices.
	// if the array has any holes filter these out
	return faces_vertices.map((_, i) => i).filter(() => true);
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
export const nudgeFacesWithFaceOrders = ({
	vertices_coords, faces_vertices, faceOrders, faces_normal,
}) => {
	if (!faces_normal) {
		faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	}
	// create a graph where the vertices are the faces, and edges
	// are connections between faces according to faceOrders
	// using this representation, find the disjoint sets of faces,
	// those which are isolated from each other according to layer orders
	const faces_sets = connectedComponents(makeVerticesVerticesUnsorted({
		edges_vertices: faceOrders.map(ord => [ord[0], ord[1]]),
	}));
	// const sets_faces = invertMap(faces_sets)
	// 	.map(el => (el.constructor === Array ? el : [el]));
	const sets_faces = invertMapArray(faces_sets);
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
 * @description for a flat-foldable origami, one in which all
 * of its folded state vertices are in 2D, this will return
 * one valid layer arrangement of the faces.
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
