/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	counterClockwiseSectors2,
} from "../math/radial.js";
import {
	assignmentCanBeFolded,
	assignmentFlatFoldAngle,
} from "../fold/spec.js";
import {
	makeVerticesVertices,
	makeVerticesEdgesUnsorted,
	makeVerticesVerticesVector,
} from "../graph/make.js";
import {
	boundaryVertices,
} from "../graph/boundary.js";
import {
	alternatingSum,
} from "./kawasaki.js";

/**
 * @description A "flat" vertex is one which all edges that surround it
 * have an assignment of either flat, cut, join, or boundary; or rather,
 * none if the surrounding assignments are mountain, valley, or unassigned.
 * @param {FOLD} graph a FOLD object
 * @returns {number[]} the indices of vertices which are "flat"
 */
const getAllFlatVertices = ({ vertices_edges, edges_assignment }) => (
	vertices_edges
		.map(edges => edges
			.map(e => !assignmentCanBeFolded[edges_assignment[e]])
			.reduce((a, b) => a && b, true))
		.map((valid, i) => (valid ? i : undefined))
		.filter(a => a !== undefined)
);

/**
 * @description using edges_assignment, check if Maekawa's theorem is satisfied
 * for all vertices, and if not, return the vertices which violate the theorem.
 * todo: this assumes that valley/mountain folds are flat folded.
 * @param {FOLD} graph a FOLD object
 * @returns {number[]} indices of vertices which violate the theorem.
 * an empty array has no errors.
 * @linkcode Origami ./src/singleVertex/validate.js 41
 */
export const validateMaekawa = ({
	edges_vertices, vertices_edges, edges_assignment,
}) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const is_valid = vertices_edges
		.map(edges => edges
			.map(e => assignmentFlatFoldAngle[edges_assignment[e]])
			.filter(a => a !== 0)
			.map(Math.sign)
			.reduce((a, b) => a + b, 0))
		.map(sum => sum === 2 || sum === -2);

	// set all boundary and flat vertices to be valid
	boundaryVertices({ edges_vertices, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	getAllFlatVertices({ vertices_edges, edges_assignment })
		.forEach(v => { is_valid[v] = true; });

	return is_valid
		.map((valid, v) => (!valid ? v : undefined))
		.filter(a => a !== undefined);
};

/**
 * @description For every vertex in a grpah, check if Kawasaki's theorem
 * is satisfied. Return a list of the vertices which violate the theorem.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[]} indices of vertices which violate the theorem.
 * an empty array has no errors.
 * @linkcode Origami ./src/singleVertex/validate.js 68
 */
export const validateKawasaki = ({
	vertices_coords,
	vertices_vertices,
	vertices_edges,
	edges_vertices,
	edges_assignment,
}, epsilon = EPSILON) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({
			vertices_coords, vertices_edges, edges_vertices,
		});
	}
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const is_valid = makeVerticesVerticesVector({
		vertices_coords, vertices_vertices, edges_vertices,
	})
		.map((vectors, v) => vectors.filter((_, i) => (
			assignmentCanBeFolded[edges_assignment[vertices_edges[v][i]]]
		)))
		.map(vectors => (vectors.length > 1
			? counterClockwiseSectors2(vectors)
			: [0, 0]))
		.map(sectors => alternatingSum(sectors))
		.map(pair => Math.abs(pair[0] - pair[1]) < epsilon);

	// set all boundary and flat vertices to be valid
	boundaryVertices({ edges_vertices, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	getAllFlatVertices({ vertices_edges, edges_assignment })
		.forEach(v => { is_valid[v] = true; });

	return is_valid
		.map((valid, v) => (!valid ? v : undefined))
		.filter(a => a !== undefined);
};
