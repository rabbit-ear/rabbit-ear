/**
 * Rabbit Ear (c) Kraft
 */
import {
	make_edges_edges_parallel,
	make_edges_edges_crossing,
} from "../../graph/edges_edges";
import make_groups_edges from "../../graph/make_groups_edges";
import {
	boolean_matrix_to_indexed_array,
	boolean_matrix_to_unique_index_pairs,
} from "../../general/arrays";

const make_edges_matrix = (graph) => {
	// make edges matrix
	const matrix_edges = Array.from(Array(graph.edges_vertices.length))
		.map(() => Array.from(Array(graph.edges_vertices.length)));
	const edges_edges_parallel = make_edges_edges_parallel(graph);
	const edges_edges_crossing = make_edges_edges_crossing(graph);
	const groups_edges = make_groups_edges(graph, 0.001);
	edges_edges_parallel.forEach((row, i) => row.forEach((_, j) => {
		if (edges_edges_parallel[i][j] === true) {
			matrix_edges[i][j] = "parallel";
		}
	}));
	edges_edges_crossing.forEach((row, i) => row.forEach((_, j) => {
		if (edges_edges_crossing[i][j] === true) {
			matrix_edges[i][j] = "crossing";
		}
	}));
	groups_edges.forEach(group => {
		for (let i = 0; i < group.length; i++) {
			for (let j = 0; j < group.length; j++) {
				if (i === j) { continue; }
				matrix_edges[group[i]][group[j]] = "aligned";
			}
		}
	});
	const edges_crossing_edges = boolean_matrix_to_indexed_array(edges_edges_crossing);
	const crossing_pairs = boolean_matrix_to_unique_index_pairs(edges_edges_crossing);
};
