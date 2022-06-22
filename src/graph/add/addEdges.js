/**
 * Rabbit Ear (c) Kraft
 */
/**
 * 
 * 
 * triavial method. possible that this method should just be removed
 * 
 * 
 */
import { removeDuplicateEdges } from "../edgesViolations";
// this method is meant to add edges between EXISTING vertices.
// this should split and rebuild faces.

// todo: we need to make a removeDuplicateEdges that returns merge info

// const edges = ear.graph.addEdges(graph, [[0, vertex], [1, vertex], [2, 3], [2, vertex]]);
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
