/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
/**
 * @param {object} FOLD graph
 * @param {number[]} an array of vertex indices to be sorted
 * @param {number} the origin vertex, around which the vertices will be sorted
 * @returns {number[]} indices of vertices, in sorted order
 */
export const sortVerticesCounterClockwise = ({ vertices_coords }, vertices, vertex) =>
	vertices
		.map(v => vertices_coords[v])
		.map(coord => math.core.subtract(coord, vertices_coords[vertex]))
		.map(vec => Math.atan2(vec[1], vec[0]))
		// optional line, this makes the cycle loop start/end along the +X axis
		.map(angle => angle > -math.core.EPSILON ? angle : angle + Math.PI * 2)
		.map((a, i) => ({a, i}))
		.sort((a, b) => a.a - b.a)
		.map(el => el.i)
		.map(i => vertices[i]);
/**
 * @description sort a subset of vertices from a graph along a vector.
 * eg: given the vector [1,0], points according to their X value.
 * @param {object} FOLD object
 * @param {number[]} the indices of vertices to be sorted
 * @param {number[]} a vector along which to sort vertices
 * @returns {number[]} indices of vertices, in sorted order
 */
export const sortVerticesAlongVector = ({ vertices_coords }, vertices, vector) =>
	vertices
		.map(i => ({ i, d: math.core.dot(vertices_coords[i], vector) }))
		.sort((a, b) => a.d - b.d)
		.map(a => a.i);
