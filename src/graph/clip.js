/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../math/general/constant.js";
import {
	include,
	includeL,
} from "../math/general/function.js";
import {
	subtract2,
} from "../math/algebra/vector.js";
import { clipLineConvexPolygon } from "../math/intersect/clip.js";
import { boundary } from "./boundary.js";
import { getFacesLineOverlap } from "./faces/overlap.js";
/**
 * @description
 * @param {FOLD} graph a FOLD graph
 * @param {number[][]} segment an array of two 2D points
 * @returns {number[][][]} an array of segments, each an array of 2D points
 */
export const clipSegment = (graph, segment, epsilon = EPSILON) => {
	const vector = subtract2(segment[1], segment[0]);
	const origin = segment[0];
	const facesOverlap = getFacesLineOverlap(graph, { vector, origin }, epsilon);
};
/**
 * @description Clip a line inside the boundaries of a graph, resulting in
 * one segment or undefined. The line can be a line, ray, or segment.
 * @param {FOLD} graph a FOLD graph
 * @param {RayLine|number[][]} line a line or a segment
 * @returns {number[][]|undefined} a segment, a pair of two points,
 * or undefined if no intersection
 * @linkcode Origami ./src/graph/clip.js 20
 */
export const clip = function (graph, line) {
	const polygon = boundary(graph).vertices.map(v => graph.vertices_coords[v]);
	const vector = line.vector ? line.vector : subtract2(line[1], line[0]);
	const origin = line.origin ? line.origin : line[0];
	const fn_line = (line.domain ? line.domain : includeL);
	return clipLineConvexPolygon(
		polygon,
		{ vector, origin },
		include,
		fn_line,
	);
};

// const clip = function (graph, line) {
// 	const polygon = getBoundary(graph).vertices.map(v => vertices_coords[v]);
// 	return math.polygon(polygon).clip(line);
// };
