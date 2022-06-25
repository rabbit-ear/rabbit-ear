/**
 * Rabbit Ear (c) Kraft
 */
/**
 * 
 * 
 * triavial method. possible that this method should just be removed.
 * right now, it is not included in the main export.
 * 
 * 
 */
import { removeDuplicateEdges } from "../edgesViolations";

const addEdges = (graph, edges_vertices) => {
	if (!graph.edges_vertices) { graph.edges_vertices = []; }
	// the user messed up the input and only provided one edge
	// it's easy to fix for them
	if (typeof edges_vertices[0] === "number") { edges_vertices = [edges_vertices]; }
	const indices = edges_vertices.map((_, i) => graph.edges_vertices.length + i);
	graph.edges_vertices.push(...edges_vertices);
	const index_map = removeDuplicateEdges(graph).map;
	return indices.map(i => index_map[i]);
};

export default addEdges;
