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
import { subtract2 } from "../math/vector.js";
import { clipLineConvexPolygon } from "../math/clip.js";
import { joinCollinearSegments } from "../math/join.js";
import {
	getFacesLineOverlap,
	getFacesRayOverlap,
	getFacesSegmentOverlap,
} from "./intersect/faces.js";
/**
 * @todo test the clip method on foldedForm, not just crease pattern
 */
/**
 * @description the internal method for clipLine, clipRay, and clipSegment
 */
const clipAndJoin = (graph, faces, line, func = includeL, epsilon = EPSILON) => {
	const clippings = faces
		.map(f => graph.faces_vertices[f].map(v => graph.vertices_coords[v]))
		.map(poly => clipLineConvexPolygon(poly, line, include, func, epsilon))
		.filter(a => a !== undefined);
	return joinCollinearSegments(clippings, line, epsilon);
};
/**
 * @description Clip a line in a graph. This will result in a list of
 * segments, and contain more than one in the case when a line enters and
 * exists multiple times in a graph which is non-convex.
 * @param {FOLD} graph a FOLD object
 * @param {number[][]} segment an array of two 2D points
 * @returns {number[][][]} an array of segments, each an array of 2D points
 */
export const clipLine = (graph, line, epsilon = EPSILON) => {
	const faces = getFacesLineOverlap(graph, line, epsilon);
	return clipAndJoin(graph, faces, line, includeL, epsilon);
};
/**
 * @description Clip a ray in a graph. This will result in a list of
 * segments, and contain more than one in the case when a line enters and
 * exists multiple times in a graph which is non-convex.
 * @param {FOLD} graph a FOLD object
 * @param {number[][]} segment an array of two 2D points
 * @returns {number[][][]} an array of segments, each an array of 2D points
 */
export const clipRay = (graph, ray, epsilon = EPSILON) => {
	const faces = getFacesRayOverlap(graph, ray, epsilon);
	return clipAndJoin(graph, faces, ray, includeR, epsilon);
};
/**
 * @description Clip a segment in a graph. This will result in a list of
 * segments, and contain more than one in the case when a line enters and
 * exists multiple times in a graph which is non-convex.
 * @param {FOLD} graph a FOLD object
 * @param {number[][]} segment an array of two 2D points
 * @returns {number[][][]} an array of segments, each an array of 2D points
 */
export const clipSegment = (graph, segment, epsilon = EPSILON) => {
	const vector = subtract2(segment[1], segment[0]);
	const origin = segment[0];
	const faces = getFacesSegmentOverlap(graph, segment, epsilon);
	return clipAndJoin(graph, faces, { vector, origin }, includeS, epsilon);
};
