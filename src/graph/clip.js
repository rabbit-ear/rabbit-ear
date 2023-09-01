/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../math/constant.js";
import {
	include,
	includeL,
	includeR,
	includeS,
} from "../math/compare.js";
import {
	normalize2,
	dot2,
	scale2,
	add2,
	subtract2,
} from "../math/vector.js";
import { clipLineConvexPolygon } from "../math/clip.js";
import { boundary } from "./boundary.js";
import {
	getFacesLineOverlap,
	getFacesRayOverlap,
	getFacesSegmentOverlap,
} from "./intersect/faces.js";
/**
 * @description Given a set of collinear segments which came from a line,
 * reduce the total number of segments by joining segments that share a
 * point, and leave gaps where no segments touch.
 * Note: this will modify the "segments" parameter in place (shuffle point order)
 * @param {number[][][]} segments an array of segments
 * @param {VecLine} line the line that these segments were made from.
 * @returns {number[][][]} an array of segments, each an array of two points.
 */
const joinCollinearSegments = (segments, { vector, origin }, epsilon) => {
	if (segments.length < 2) { return segments; }
	const segmentsBackwards = segments
		.map(pts => subtract2(pts[1], pts[0]))
		.map(vec => dot2(vec, vector) < epsilon);
	segments
		.map((_, i) => i)
		.filter(i => segmentsBackwards[i])
		.forEach(i => { segments[i] = [segments[i][1], segments[i][0]]; });
	const normalized = normalize2(vector);
	const segmentsScalars = segments
		.map(pts => pts.map(point => dot2(subtract2(point, origin), normalized)))
		.sort((a, b) => a[0] - b[0]);
	const joined = [
		[segmentsScalars[0][0], segmentsScalars[0][1]],
	];
	for (let i = 1; i < segmentsScalars.length; i += 1) {
		const curr = segmentsScalars[i];
		if ((curr[0] - epsilon) < (joined[joined.length - 1][1] + epsilon)) {
			// if neighboring segments overlap, increase the current segment length
			joined[joined.length - 1][1] = Math.max(curr[1], joined[joined.length - 1][1]);
		} else {
			// neighbors do not overlap. start a new segment
			joined.push([curr]);
		}
	}
	// convert scalars back into point form.
	return joined.map(seg => seg.map(s => add2(origin, scale2(normalized, s))));
};
/**
 *
 */
const clipAndJoin = (graph, faces, line, func = includeL, epsilon = EPSILON) => {
	const clippings = faces
		.map(f => graph.faces_vertices[f].map(v => graph.vertices_coords[v]))
		.map(poly => clipLineConvexPolygon(poly, line, include, func, epsilon))
		.filter(a => a !== undefined);
	return joinCollinearSegments(clippings, line, epsilon);
};
/**
 * @description
 * @param {FOLD} graph a FOLD graph
 * @param {number[][]} segment an array of two 2D points
 * @returns {number[][][]} an array of segments, each an array of 2D points
 */
export const clipLine = (graph, line, epsilon = EPSILON) => {
	const faces = getFacesLineOverlap(graph, line, epsilon);
	return clipAndJoin(graph, faces, line, includeL, epsilon);
};
/**
 * @description
 * @param {FOLD} graph a FOLD graph
 * @param {number[][]} segment an array of two 2D points
 * @returns {number[][][]} an array of segments, each an array of 2D points
 */
export const clipRay = (graph, ray, epsilon = EPSILON) => {
	const faces = getFacesRayOverlap(graph, ray, epsilon);
	return clipAndJoin(graph, faces, ray, includeR, epsilon);
};
/**
 * @description
 * @param {FOLD} graph a FOLD graph
 * @param {number[][]} segment an array of two 2D points
 * @returns {number[][][]} an array of segments, each an array of 2D points
 */
export const clipSegment = (graph, segment, epsilon = EPSILON) => {
	const vector = subtract2(segment[1], segment[0]);
	const origin = segment[0];
	const faces = getFacesSegmentOverlap(graph, segment, epsilon);
	return clipAndJoin(graph, faces, { vector, origin }, includeS, epsilon);
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
