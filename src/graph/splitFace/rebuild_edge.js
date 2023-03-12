/**
 * Rabbit Ear (c) Kraft
 */
import {
	distance,
	subtract,
} from "../../math/algebra/vector.js";
/**
 * @description given two vertices and incident faces, create all new
 * "edges_" entries to describe a new edge that sits between the params.
 * @param {object} FOLD graph
 * @param {number[]} two incident vertices that make up this edge
 * @param {number[]} two edge-adjacent faces to this new edge
 * @param {number[]} TEMPORARILY holds 2x the index of the face that
 *  this edge currently lies inside, because the faces arrays will be
 *  rebuilt from scratch, we need the old data.
 * @returns {object} all FOLD spec "edges_" entries for this new edge.
 */
// const make_edge = ({ vertices_coords }, vertices, faces) => {
const make_edge = ({ vertices_coords }, vertices, face) => {
	// coords reversed for "vector", so index [0] comes last in subtract
	const new_edge_coords = vertices
		.map(v => vertices_coords[v])
		.reverse();
	return {
		edges_vertices: [...vertices],
		edges_foldAngle: 0,
		edges_assignment: "U",
		edges_length: distance(...new_edge_coords),
		edges_vector: subtract(...new_edge_coords),
		edges_faces: [face, face],
	};
};
/**
 *
 */
const rebuild_edge = (graph, face, vertices) => {
	// now that 2 vertices are in place, add a new edge between them.
	const edge = graph.edges_vertices.length;
	// construct data for our new edge (vertices, assignent, foldAngle...)
	// and the entry for edges_faces will be [x, x] where x is the index of
	// the old face, twice, and will be replaced later in this function.
	const new_edge = make_edge(graph, vertices, face);
	// ignoring any keys that aren't a part of our graph, add the new edge
	Object.keys(new_edge)
		.filter(key => graph[key] !== undefined)
		.forEach((key) => { graph[key][edge] = new_edge[key]; });
	return edge;
};

export default rebuild_edge;
