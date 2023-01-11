/**
 * Rabbit Ear (c) Kraft
 */
import { makeFacesNormal } from "../graph/normals";
import { invertMap } from "../graph/maps";
import topologicalOrder from "./topological";
import { getDisjointedVertices } from "../graph/sets";
/**
 * @description Given a graph with a faces_layer, a topological sorting
 * of faces, for a flat-folded 2D graph, get an array where every face
 * is given a layer and a vector, which will always be [0, 0, 1].
 * @param {FOLD} graph a FOLD graph with the parameter faces_layer.
 * @returns {object[]} an array of objects, one for every face, each
 * with properties "vector" and "layer".
 * @linkcode Origami ./src/layer/nudge.js 15
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
 * @returns {object[]} an array of objects, one for every face, each
 * with properties "vector" and "layer".
 * @linkcode Origami ./src/layer/nudge.js 36
 */
export const nudgeFacesWithFaceOrders = ({ vertices_coords, faces_vertices, faceOrders }) => {
	const faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	const sets_faces = getDisjointedVertices({
		edges_vertices: faceOrders.map(ord => [ord[0], ord[1]]),
	});
	const sets_layers_face = sets_faces
		.map(faces => topologicalOrder({ faceOrders, faces_normal }, faces));
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
