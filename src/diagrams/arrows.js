/**
 * Rabbit Ear (c) Kraft
 */
import {
	convexHull,
} from "../math/convexHull.js";
import {
	magnitude2,
	dot2,
	subtract2,
	resize2,
} from "../math/vector.js";
import {
	perpendicularBalancedSegment,
} from "./general.js";
import {
	boundingBox,
} from "../math/polygon.js";
import {
	clipLineConvexPolygon,
} from "../math/clip.js";

/**
 * @description Given a segment representing an arrow endpoints,
 * and a polygon representing the enclosing space for the arrow,
 * create an arrow definition which includes the segment, as well as
 * some additional details like the size of the arrow head and
 * the direction of the bend in the path.
 * @param {[number, number][]} points an array of two points, each an array of numbers
 * @param {{ vmin?: number, padding?: number }} options
 * @returns {Arrow} an arrow definition including a head but no tail.
 */
export const arrowFromSegment = (points, options = {}) => {
	if (points === undefined) { return undefined; }
	const vector = subtract2(points[1], points[0]);
	const length = magnitude2(vector);

	// we need a good padding value, arrowheads should not be exactly
	// on top of their targets, but spaced a little behind it.
	const padding = options.padding ? options.padding : length * 0.05;

	// a good arrow whose path bends should always bend up then back down
	// like a ball thrown up and returning to Earth.
	// "bend" will be positive or negative based on the left/right direction
	const direction = dot2(vector, [1, 0]);

	// prefer to base the size of the head off of the size of the canvas,
	// so, please use the options.vmin if possible.
	// Otherwise, base the size of the head off of the length of the arrow,
	// which has the side effect of a shrinking head as the length shrinks.
	const vmin = options && options.vmin ? options.vmin : length;
	return {
		segment: [points[0], points[1]],
		head: {
			width: vmin * 0.0666,
			height: vmin * 0.1,
		},
		bend: direction > 0 ? 0.3 : -0.3,
		padding,
	};
};

/**
 * @description Given a segment representing an arrow endpoints,
 * and a polygon representing the enclosing space for the arrow,
 * create an arrow definition which includes the segment, as well as
 * some additional details like the size of the arrow head and
 * the direction of the bend in the path.
 * @param {[number, number][]} polygon an array of points, each an array of numbers
 * @param {[number, number][]} segment an array of two points, each an array of numbers
 * @param {{ vmin?: number, padding?: number }} options
 * @returns {Arrow} an arrow definition including a head but no tail.
 */
export const arrowFromSegmentInPolygon = (polygon, segment, options = {}) => {
	const vmin = options.vmin
		? options.vmin
		: Math.min(...(boundingBox(polygon)?.span || [1, 1]).slice(0, 2));
	return arrowFromSegment(segment, { ...options, vmin });
};

/**
 * @param {[number, number][]} polygon
 * @param {VecLine2} line
 * @param {{ vmin?: number, padding?: number }} options
 * @returns {Arrow} an arrow definition including a head but no tail.
 */
export const arrowFromLine = (polygon, line, options) => {
	const segment = clipLineConvexPolygon(polygon, line)
	return segment === undefined
		? undefined
		: arrowFromSegmentInPolygon(polygon, segment, options)
};

/**
 * @description given an origami model and a fold line, without knowing
 * any of the parameters that determined the fold line, find an arrow
 * that best fits the origami as a diagram step.
 * This is sufficient in many cases, but a more precise arrow might be
 * generated knowing which axiom construction created the fold line.
 * @param {FOLD} graph a FOLD object
 * @param {VecLine2} foldLine a line specifying the crease.
 * @param {{ vmin?: number, padding?: number }} options
 * @returns {Arrow} an arrow definition including a head but no tail.
 */
export const foldLineArrow = ({ vertices_coords }, foldLine, options) => {
	const vertices_coords2 = vertices_coords.map(resize2);
	const hull = convexHull(vertices_coords2)
		.map(v => vertices_coords2[v]);
	const segment = perpendicularBalancedSegment(hull, foldLine);
	if (segment === undefined) { return undefined; }
	return arrowFromSegmentInPolygon(hull, segment, options);
};
