/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import { getBoundary } from "./boundary";

/**
 * @description Clip a line inside the boundaries of a graph, resulting in one segment
 * or undefined. The line can be a line, ray, or segment.
 * @param {FOLD} graph a FOLD graph
 * @param {RayLine|number[][]} line a line or a segment
 * @returns {number[][]|undefined} a segment, a pair of two points,
 * or undefined if no intersection
 */
const clip = function (graph, line) {
	const polygon = getBoundary(graph).vertices.map(v => graph.vertices_coords[v]);
	const vector = line.vector ? line.vector : ear.math.subtract2(line[1], line[0]);
	const origin = line.origin ? line.origin : line[0];
	return clipLineConvexPolygon(polygon, vector, origin,
		math.core.include,
		math.core.includeL);
};

// const clip = function (
// 	{vertices_coords, vertices_edges, edges_vertices, edges_assignment, boundaries_vertices},
// 	line) {
// 	if (!boundaries_vertices) {
// 		boundaries_vertices = getBoundary({
// 			vertices_edges, edges_vertices, edges_assignment
// 		}).vertices;
// 	}
// 	return math.polygon(boundaries_vertices.map(v => vertices_coords[v]))
// 		.clip(line);
// };

export default clip;
