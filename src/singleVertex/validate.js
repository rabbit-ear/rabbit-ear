/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../math/general/constant.js";
import { counterClockwiseSectors2 } from "../math/geometry/radial.js";
import {
	makeVerticesVertices,
	makeVerticesEdgesUnsorted,
	makeVerticesVerticesVector,
} from "../graph/make.js";
import { boundaryVertices } from "../graph/boundary.js";
import { alternatingSum } from "./kawasakiMath.js";

const flat_assignment = {
	B: true, b: true, F: true, f: true, U: true, u: true,
};
/**
 * @description get all vertices indices which are adjacent to edges
 * with no mountain/valleys, only containing either flat, unassigned,
 * or boundary.
 */
const vertices_flat = ({ vertices_edges, edges_assignment }) => vertices_edges
	.map(edges => edges
		.map(e => flat_assignment[edges_assignment[e]])
		.reduce((a, b) => a && b, true))
	.map((valid, i) => (valid ? i : undefined))
	.filter(a => a !== undefined);

const folded_assignments = {
	M: true, m: true, V: true, v: true,
};
const maekawa_signs = {
	M: -1, m: -1, V: 1, v: 1,
};
/**
 * @description using edges_assignment, check if Maekawa's theorem is satisfied
 * for all vertices, and if not, return the vertices which violate the theorem.
 * todo: this assumes that valley/mountain folds are flat folded.
 * @param {FOLD} graph a FOLD object
 * @returns {number[]} indices of vertices which violate the theorem. an empty array has no errors.
 * @linkcode Origami ./src/singleVertex/validate.js 41
 */
export const validateMaekawa = ({ edges_vertices, vertices_edges, edges_assignment }) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const is_valid = vertices_edges
		.map(edges => edges
			.map(e => maekawa_signs[edges_assignment[e]])
			.filter(a => a !== undefined)
			.reduce((a, b) => a + b, 0))
		.map(sum => sum === 2 || sum === -2);
	// overwrite any false values to true for all boundary vertices
	boundaryVertices({ edges_vertices, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	vertices_flat({ vertices_edges, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	return is_valid
		.map((valid, v) => (!valid ? v : undefined))
		.filter(a => a !== undefined);
};
/**
 * @description using the vertices of the edges, check if Kawasaki's theorem is satisfied
 * for all vertices, and if not, return the vertices which violate the theorem.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[]} indices of vertices which violate the theorem. an empty array has no errors.
 * @linkcode Origami ./src/singleVertex/validate.js 68
 */
export const validateKawasaki = ({
	vertices_coords,
	vertices_vertices,
	vertices_edges,
	edges_vertices,
	edges_assignment,
	edges_vector,
}, epsilon = EPSILON) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({ vertices_coords, vertices_edges, edges_vertices });
	}
	// console.log("HERE", makeVerticesVerticesVector({
	// 	vertices_coords, vertices_vertices, edges_vertices, edges_vector,
	// })
	// 	.map((vectors, v) => vectors
	// 		.filter((_, i) => folded_assignments[edges_assignment[vertices_edges[v][i]]])));
	const is_valid = makeVerticesVerticesVector({
		vertices_coords, vertices_vertices, edges_vertices, edges_vector,
	})
		.map((vectors, v) => vectors
			.filter((_, i) => folded_assignments[edges_assignment[vertices_edges[v][i]]]))
		.map(vectors => (vectors.length > 1
			? counterClockwiseSectors2(vectors)
			: [0, 0]))
		.map(sectors => alternatingSum(sectors))
		.map(pair => Math.abs(pair[0] - pair[1]) < epsilon);

	// overwrite any false values to true for all boundary vertices
	boundaryVertices({ edges_vertices, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	vertices_flat({ vertices_edges, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	return is_valid
		.map((valid, v) => (!valid ? v : undefined))
		.filter(a => a !== undefined);
};
