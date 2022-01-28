/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import {
	make_edges_vector,
	make_vertices_edges
} from "./make";

export const join_collinear_edges = ({ vertices_coords, edges_vertices, vertices_edges, edges_vector }, epsilon = math.core.EPSILON) => {
	if (!edges_vector) {
		edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
	}
	if (!vertices_edges) {
		vertices_edges = make_vertices_edges({ edges_vertices });
	}
	const two_adjacencies_vertices = vertices_edges
		.map((ve, i) => ve.length === 2 ? i : undefined)
		.filter(a => a !== undefined);
	const adjacencies_are_parallel = two_adjacencies_vertices
		.map(vertex => vertices_edges[vertex])
		.map(edges => edges.map(edge => edges_vector[edge]))
		.map(vecs => math.core.parallel(...vecs));
	const vertices_remove = two_adjacencies_vertices
		.filter((vertex, i) => adjacencies_are_parallel[i]);
	// remove the edge index with the larger index
	const joinable_edges = vertices_remove
		.map(v => vertices_edges[v])
		.map(edges => edges[0] < edges[1] ? edges : [edges[1], edges[0]]);
	const edges_to_join = {};
	for (let i = 0; i < joinable_edges.length; i++) {
		if (edges_to_join[joinable_edges[i][1]] === undefined) {
			edges_to_join[joinable_edges[i][1]] = true;
		} else {
			console.log("WARNING. cannot safely remove edges. some overlaps");
		}
	}
	// const edges_remove = Object.keys(edges_to_join);
	const edges_keep = joinable_edges.map(edges => edges[0]);
	const edges_remove = joinable_edges.map(edges => edges[1]);
	const edges_remove_other_vertex = edges_remove
		.map(edge => edges_vertices[edge])
		.map((vertices, i) => {
			if (vertices[0] === vertices_remove[i]) { return vertices[1]; }
			else if (vertices[1] === vertices_remove[i]) { return vertices[0]; }
			else { console.log("WARNING, removed edge cannot find vertex"); return undefined; }
		});
	edges_keep
		.forEach((edge, i) => {
			if (edges_vertices[edge][0] === vertices_remove[i]) {
				edges_vertices[edge][0] = edges_remove_other_vertex[i]
			} else if (edges_vertices[edge][1] === vertices_remove[i]) {
				edges_vertices[edge][1] = edges_remove_other_vertex[i]
			} else {
				console.log("WARNING, joining edges cannot find vertex");
			}
		});
	// console.log("two_adjacencies_vertices", two_adjacencies_vertices);
	// console.log("adjacencies_are_parallel", adjacencies_are_parallel);
	// console.log("joinable_vertices", joinable_vertices);
	return {
		vertices: vertices_remove,
		edges: edges_remove
	};
};
