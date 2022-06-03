/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import { kawasaki_solutions_vectors } from "./kawasaki_math";
import {
	make_edges_vector,
	make_vertices_edges_unsorted,
} from "../graph/make";

// todo: this is doing too much work in preparation
export const kawasaki_solutions = ({ vertices_coords, vertices_edges, edges_vertices, edges_vectors }, vertex) => {
	// to calculate Kawasaki's theorem, we need the 3 edges
	// as vectors, and we need them sorted radially.
	if (!edges_vectors) {
		edges_vectors = make_edges_vector({ vertices_coords, edges_vertices });
	}
	if (!vertices_edges) {
		vertices_edges = make_vertices_edges_unsorted({ edges_vertices });
	}
	const vectors = vertices_edges[vertex].map(i => edges_vectors[i]);
	const sortedVectors = math.core.counter_clockwise_order2(vectors)
		.map(i => vectors[i]);
	return kawasaki_solutions_vectors(sortedVectors);
};
