/**
 * Rabbit Ear (c) Kraft
 */
import { filterKeysWithPrefix } from "../../fold/spec.js";

/**
 * @description Add a vertex to the graph by setting its coordinates.
 * This method will maintain that all other arrays in the graph are valid,
 * any "vertices_" arrays that exist in the graph will be filled with
 * empty arrays. This vertex will be initialized as isolated.
 * @param {FOLD} graph a FOLD object
 * @param {number[]} coords the position of the new vertex
 * @returns {number} the index of the newly created vertex
 */
const addVertex = (graph, coords) => {
	if (!graph.vertices_coords) {
		graph.vertices_coords = [];
	}
	const index = graph.vertices_coords.length;
	// this new vertex is isolated. any vertices_vertices, vertices_edges,
	// or vertices_faces should have an empty array. this includes vertices_coords
	filterKeysWithPrefix(graph, "vertices")
		.forEach(key => { graph[key][index] = []; });
	graph.vertices_coords[index] = coords;
	return index;
};

export default addVertex;
