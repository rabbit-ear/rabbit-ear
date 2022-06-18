/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import {
	make_vertices_vertices,
	make_vertices_edges_unsorted,
	make_vertices_vertices_vector,
} from "../graph/make";
import { get_boundary_vertices } from "../graph/boundary";
import { alternating_sum } from "./kawasaki_math";

const flat_assignment = { B:true, b:true, F:true, f:true, U:true, u:true };
/**
 * @description get all vertices indices which are adjacent to edges
 * with no mountain/valleys, only containing either flat, unassigned,
 * or boundary.
 */
const vertices_flat = ({ vertices_edges, edges_assignment }) => vertices_edges
	.map(edges => edges
		.map(e => flat_assignment[edges_assignment[e]])
		.reduce((a, b) => a && b, true))
	.map((valid, i) => valid ? i : undefined)
	.filter(a => a !== undefined);

const folded_assignments = { M:true, m:true, V:true, v:true};
const maekawa_signs = { M:-1, m:-1, V:1, v:1};
/**
 * @description using edges_assignment, check if Maekawa's theorem is satisfied
 * for all vertices, and if not, return the vertices which violate the theorem.
 * todo: this assumes that valley/mountain folds are flat folded.
 * @param {object} graph a FOLD object
 * @returns {number[]} indices of vertices which violate the theorem. an empty array has no errors.
 */
export const validate_maekawa = ({ edges_vertices, vertices_edges, edges_assignment }) => {
	if (!vertices_edges) {
		vertices_edges = make_vertices_edges_unsorted({ edges_vertices });
	}
	const is_valid = vertices_edges
		.map(edges => edges
			.map(e => maekawa_signs[edges_assignment[e]])
			.filter(a => a !== undefined)
			.reduce((a, b) => a + b, 0))
		.map(sum => sum === 2 || sum === -2);
	// overwrite any false values to true for all boundary vertices
	get_boundary_vertices({ edges_vertices, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	vertices_flat({ vertices_edges, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	return is_valid
		.map((valid, v) => !valid ? v : undefined)
		.filter(a => a !== undefined);
};
/**
 * @description using the vertices of the edges, check if Kawasaki's theorem is satisfied
 * for all vertices, and if not, return the vertices which violate the theorem.
 * @param {object} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[]} indices of vertices which violate the theorem. an empty array has no errors.
 */
export const validate_kawasaki = ({ vertices_coords, vertices_vertices, vertices_edges, edges_vertices, edges_assignment, edges_vector }, epsilon = math.core.EPSILON) => {
	if (!vertices_vertices) {
		vertices_vertices = make_vertices_vertices({ vertices_coords, vertices_edges, edges_vertices });
	}
	const is_valid = make_vertices_vertices_vector({ vertices_coords, vertices_vertices, edges_vertices, edges_vector })
		.map((vectors, v) => vectors
			.filter((_, i) => folded_assignments[edges_assignment[vertices_edges[v][i]]]))
		.map(vectors => vectors.length > 1
			? math.core.counter_clockwise_sectors2(vectors)
			: [0, 0])
		.map(sectors => alternating_sum(sectors))
		.map((pair, v) => Math.abs(pair[0] - pair[1]) < epsilon);

	// overwrite any false values to true for all boundary vertices
	get_boundary_vertices({ edges_vertices, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	vertices_flat({ vertices_edges, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	return is_valid
		.map((valid, v) => !valid ? v : undefined)
		.filter(a => a !== undefined);
};
