/**
 * Rabbit Ear (c) Kraft
 */
import { filterKeysWithPrefix } from "../../fold/spec.js";

/**
 * @description add vertices to a graph by adding their vertices_coords.
 * @param {FOLD} graph a FOLD graph, modified in place.
 * @param {number[][]} vertices_coords array of points to be added to the graph
 * @param {number} [epsilon=1e-6] optional epsilon to merge similar vertices
 * @returns {number[]} index of vertex in new vertices_coords array.
 * the size of this array matches array size of source vertices.
 * duplicate (non-added) vertices returns their pre-existing counterpart's index.
 * @linkcode Origami ./src/graph/add/addVertices.js 16
 */
const addVertices = (graph, vertices_coords = []) => {
	if (!graph.vertices_coords) {
		graph.vertices_coords = [];
	}
	const index = graph.vertices_coords.length;
	// this new vertex is isolated. any vertices_vertices, vertices_edges,
	// or vertices_faces should have an empty array. this includes vertices_coords
	filterKeysWithPrefix(graph, "vertices").forEach(key => {
		vertices_coords.forEach((_, i) => { graph[key][index + i] = []; });
	});
	vertices_coords.forEach((coords, i) => {
		graph.vertices_coords[index + i] = coords;
	});
	return vertices_coords.map((_, i) => index + i);
};

export default addVertices;
