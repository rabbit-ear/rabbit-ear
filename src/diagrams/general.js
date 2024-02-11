/**
 * Rabbit Ear (c) Kraft
 */
import {
	includeR,
	includeS,
} from "../math/compare.js";
import {
	magnitude2,
	normalize2,
	dot2,
	cross2,
	scale2,
	add2,
	subtract2,
	distance2,
	midpoint2,
	flip,
	rotate90,
} from "../math/vector.js";
import {
	makeMatrix2Reflect,
	multiplyMatrix2Vector2,
} from "../math/matrix2.js";
import {
	clipLineConvexPolygon,
} from "../math/clip.js";
import {
	intersectLineLine,
	intersectConvexPolygonLine,
} from "../math/intersect.js";
import {
	boundingBox,
} from "../math/polygon.js";

/**
 * @description Given a segment representing an arrow endpoints,
 * and a polygon representing the enclosing space for the arrow,
 * create an arrow definition which includes the segment, as well as
 * some additional details like the size of the arrow head and
 * the direction of the bend in the path.
 * @param {number[][]} segment an array of two points, each an array of numbers
 * @param {number[][]} polygon an array of points, each an array of numbers
 * @returns {object} an arrow definition including: segment, head, bend
 */
export const segmentToArrow = (segment, polygon, options = {}) => {
	if (segment === undefined) { return undefined; }

	// a good arrow should not be exactly on top of its target,
	// it should be slightly behind it
	// const segment = insetSegment(fullSegment, padding);

	const vector = subtract2(segment[1], segment[0]);

	// we need a good padding value, arrowheads should not be exactly
	// on top of their targets, but spaced a little behind it.
	const length = magnitude2(vector);

	// a good arrow whose path bends should always bend up then back down
	// like a ball thrown up and returning to Earth.
	// "bend" will be positive or negative based on the left/right direction
	const direction = dot2(vector, [1, 0]);

	// base the arrow head on the size of the entire polygon shape
	// instead of the length of the segment. This way, given the same
	// diagram but different arrows, all arrowheads will be the same.
	const span2D = (boundingBox(polygon)?.span || [1, 1]).slice(0, 2);
	const vmin = Math.min(...span2D);
	return {
		segment,
		head: {
			width: vmin * 0.1,
			height: vmin * 0.15,
		},
		bend: direction > 0 ? 0.3 : -0.3,
		padding: length * 0.05,
	};
};

/**
 * @description Given a polygon and a line, clip the line and return the
 * midpoint of the resulting segment.
 * @param {number[][]} polygon a convex polygon as an array of 2D points,
 * each point an array of numbers
 * @param {VecLine} line a line in the form of a vector and origin
 * @returns {number[][]} a segment as an array of two points
 */
const getLineMidpointInPolygon = (polygon, line) => {
	const segment = clipLineConvexPolygon(polygon, line);
	return segment === undefined
		? undefined
		: midpoint2(...segment);
};

/**
 *
 */
export const diagramReflectPoint = ({ vector, origin }, point) => (
	multiplyMatrix2Vector2(makeMatrix2Reflect(vector, origin), point)
);

// export const insetSegment = (segment, padding = 0.05) => {
// 	const mid = midpoint2(...segment);
// };

/**
 * @description Given a polygon and a line which passes through it,
 * create a segment perpendicular to the line which fits nicely
 * inside the polygon, but is also balanced in its length on either side
 * of the input line, so, whichever side of the perpendicular segment
 * is the shortest, the other side will be equal in length to it.
 * By default the midpoint of the line (the line's segment inside the polygon)
 * will be chosen to build the perpendicular line through,
 * if you like, you can specify this point.
 * @param {number[][]} polygon a convex polygon as an array of 2D points,
 * each point an array of numbers
 * @param {VecLine} line a line in the form of a vector and origin
 * @param {number[]?} point an optional point along the line
 * through which the perpendicular line will pass.
 * @returns {number[][]} a segment as an array of two points.
 */
export const perpendicularBalancedSegment = (polygon, line, point) => {
	// if provided, use the point as the origin, otherwise use the line midpoint
	const origin = point === undefined
		? getLineMidpointInPolygon(polygon, line)
		: point;

	// the vector of our line is simply the perpendicular
	const vector = rotate90(line.vector); // rotate270

	// compare the two lengths from the origin of our new line to both
	// ends of the segment clipped in the polygon, return the shortest.
	const shortest = clipLineConvexPolygon(polygon, { vector, origin })
		.map(pt => distance2(origin, pt))
		.sort((a, b) => a - b)
		.shift();

	// build a vector in the direction of our perpendicular line but
	// with a scale that is half of the length of the final segment.
	const scaled = scale2(normalize2(vector), shortest);

	// our segment stretches in both directions from the origin
	// by an equal amount
	return [
		add2(origin, flip(scaled)),
		add2(origin, scaled),
	];
};

/**
 * like in axiom 3 when two segments don't intersect and the fold
 * line lies exactly between them
 * In this case, the segments are parallel, and the fold line sits
 * @param {VecLine} foldLine the fold line, the (single) result of axiom 3
 * @param {number[][][]} two lines, the inputs to axiom 3
 * @param {number[][][]} two segments the visible portion of the input lines
 */
export const betweenTwoSegments = (foldLine, lines, segments) => {
	// two midpoints, the midpoint of each of the two segments
	const midpoints = segments.map(seg => midpoint2(seg[0], seg[1]));

	// construct a line through the two midpoints
	// const midpointLine = pointsToLine(...midpoints);

	// find the place... this is not needed. just get the midpoint
	// const origin = intersectLineLine(foldLine, midpointLine).point;
	const origin = midpoint2(...midpoints);

	// perpendicular to the fold line, passing through
	// the midpoint between the two segment's midpoints.
	const perpendicular = { vector: foldLine.vector.rotate90(), origin };

	return lines.map(line => intersectLineLine(line, perpendicular).point);
};

/**
 * please refactor dear god please refactor
 */
export const betweenTwoIntersectingSegments = (lines, intersect, foldLine, boundary) => {
	// the input lines as vectors, and the same vectors flipped around
	const paramVectors = lines.map(l => l.vector);
	const flippedVectors = paramVectors.map(flip);

	// four rays, extending outwards from the intersection point,
	// tracing the path of each of the two input lines.
	const paramRays = paramVectors
		.concat(flippedVectors)
		.map(vector => ({ vector, origin: intersect }));

	// for each ray, apply the dot and cross product with the foldLine.
	// to be used in the upcoming section.
	const dots = paramRays.map(ray => dot2(ray.vector, foldLine.vector));
	const crosses = paramRays.map(ray => cross2(ray.vector, foldLine.vector));

	// we know the two "lines" intersect, and the "foldLine" passes through this
	// intersection and is an angle bisector between the two lines,
	// therefore, the four rays that follow "lines" from the intersection lie
	// each one in one of the four quadrants formed by the axis of the foldLine.
	// We can find exactly which ray is in which quadrant by consulting
	// their dot and cross products.
	const a1 = paramRays
		.filter((ray, i) => dots[i] > 0 && crosses[i] > 0)
		.shift();
	const a2 = paramRays
		.filter((ray, i) => dots[i] > 0 && crosses[i] < 0)
		.shift();
	const b1 = paramRays
		.filter((ray, i) => dots[i] < 0 && crosses[i] > 0)
		.shift();
	const b2 = paramRays
		.filter((ray, i) => dots[i] < 0 && crosses[i] < 0)
		.shift();

	// intersect each of the four rays with the polygon, returning a list
	// of four points, and we know the order of these points now.
	const rayEndpoints = [a1, a2, b1, b2].map(ray => intersectConvexPolygonLine(
		boundary,
		ray,
		includeS,
		includeR,
	).shift().shift());

	// we can now build two arrows between the four points, however,
	// we still need to... do something
	const rayLengths = rayEndpoints.map(pt => distance2(pt, intersect));

	const arrow1Start = (rayLengths[0] < rayLengths[1]
		? rayEndpoints[0]
		: rayEndpoints[1]);
	const arrow1End = (rayLengths[0] < rayLengths[1]
		? add2(a2.origin, scale2(normalize2(a2.vector), rayLengths[0]))
		: add2(a1.origin, scale2(normalize2(a1.vector), rayLengths[1])));
	const arrow2Start = (rayLengths[2] < rayLengths[3]
		? rayEndpoints[2]
		: rayEndpoints[3]);
	const arrow2End = (rayLengths[2] < rayLengths[3]
		? add2(b2.origin, scale2(normalize2(b2.vector), rayLengths[2]))
		: add2(b1.origin, scale2(normalize2(b1.vector), rayLengths[3])));

	return [
		[arrow1Start, arrow1End],
		[arrow2Start, arrow2End],
	];
};
