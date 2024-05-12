/**
 * Rabbit Ear (c) Kraft
 */
import {
	includeS,
} from "../math/compare.js";
import {
	pointsToLine2,
} from "../math/convert.js";
import {
	convexHull,
} from "../math/convexHull.js";
import {
	resize2,
} from "../math/vector.js";
import {
	makeMatrix2Reflect,
	multiplyMatrix2Vector2,
} from "../math/matrix2.js";
import {
	intersectLineLine,
} from "../math/intersect.js";
import {
	clipLineConvexPolygon,
} from "../math/clip.js";
import {
	axiom1,
	axiom3,
	axiom4,
	axiom5,
	axiom6,
	axiom7,
} from "../axioms/axioms.js";
import {
	perpendicularBalancedSegment,
	betweenTwoSegments,
	betweenTwoIntersectingSegments,
} from "./general.js";
import {
	foldLineArrow,
	arrowFromSegmentInPolygon,
} from "./arrows.js";

/**
 * @description Reflect a point across a line
 * @param {VecLine2} line
 * @param {[number, number]} point a 2D point to be reflected
 */
export const diagramReflectPoint = ({ vector, origin }, point) => (
	multiplyMatrix2Vector2(makeMatrix2Reflect(vector, origin), point)
);

/**
 * @description Create an arrow which neatly describes the action of
 * performing origami axiom 1 on a given FOLD object with 2D vertices.
 * @param {FOLD} graph a FOLD object
 * @param {[number, number]} point1 the first axiom 1 input point
 * @param {[number, number]} point2 the second axiom 1 input point
 * @param {{ vmin?: number, padding?: number }} options
 * @returns {Arrow[]} an array of definitions for arrows.
 * This will result in always one arrow.
 */
export const axiom1Arrows = ({ vertices_coords }, point1, point2, options) => {
	const vertices_coords2 = vertices_coords.map(resize2);
	const hull = convexHull(vertices_coords2).map(v => vertices_coords2[v]);
	return axiom1(point1, point2)
		.map(line => perpendicularBalancedSegment(hull, line))
		.map(segment => arrowFromSegmentInPolygon(hull, segment, options));
};

/**
 * @description Create an arrow which neatly describes the action of
 * performing origami axiom 2 on a given FOLD object with 2D vertices.
 * @param {FOLD} graph a FOLD object
 * @param {[number, number]} point1 the first axiom 2 input point
 * @param {[number, number]} point2 the second axiom 2 input point
 * @param {{ vmin?: number, padding?: number }} options
 * @returns {Arrow[]} an array of definitions for arrows.
 * This will result in always one arrow.
 */
export const axiom2Arrows = ({ vertices_coords }, point1, point2, options) => {
	const vertices_coords2 = vertices_coords.map(resize2);
	const hull = convexHull(vertices_coords2).map(v => vertices_coords2[v]);
	return [arrowFromSegmentInPolygon(hull, [point1, point2], options)];
};

/**
 * @description Create arrows which neatly describes the action of
 * performing origami axiom 3 on a given FOLD object with 2D vertices.
 * @param {FOLD} graph a FOLD object
 * @param {VecLine2} line1 the first axiom 3 input line
 * @param {VecLine2} line2 the second axiom 3 input line
 * @param {{ vmin?: number, padding?: number }} options
 * @returns {Arrow[]} an array of definitions for arrows.
 * This will result in one or two arrows. (one arrow per solution)
 */
export const axiom3Arrows = ({ vertices_coords }, line1, line2, options) => {
	const vertices_coords2 = vertices_coords.map(resize2);
	const hull = convexHull(vertices_coords2).map(v => vertices_coords2[v]);
	const foldLines = axiom3(line1, line2);

	// clip the input lines inside the convex hull
	const segments = [line1, line2]
		.map(line => clipLineConvexPolygon(hull, line))
		.filter(a => a !== undefined);

	// if this results in fewer than two segments, we cannot construct an arrow
	// with respect to axiom 3, so, construct simple arrows instead.
	if (segments.length !== 2) {
		return foldLines
			.map(foldLine => foldLineArrow({ vertices_coords }, foldLine, options));
	}

	// perform a segment-segment intersection, we need to know if
	// the two axiom 3 input segments intersect each other
	const [lineA, lineB] = segments.map(([a, b]) => pointsToLine2(a, b));
	const intersect = intersectLineLine(lineA, lineB, includeS, includeS).point;

	// if the segments don't intersect, get the one axiom 3 solution
	// (there should be only one), and construct an arrow that connects
	// the two segments.
	// if the segments do intersect,
	const result = !intersect
		? [betweenTwoSegments(
			foldLines.filter(a => a !== undefined).shift(),
			[line1, line2],
			segments,
		)]
		: foldLines.map(foldLine => betweenTwoIntersectingSegments(
			[line1, line2],
			intersect,
			foldLine,
			hull,
		));

	return result.map(seg => arrowFromSegmentInPolygon(hull, seg, options));
};

/**
 * @description Create an arrow which neatly describes the action of
 * performing origami axiom 4 on a given FOLD object with 2D vertices.
 * @param {FOLD} graph a FOLD object
 * @param {VecLine2} line the line needed for axiom 4
 * @param {[number, number]} point the point needed for axiom 4
 * @param {{ vmin?: number, padding?: number }} options
 * @returns {Arrow[]} an array of definitions for arrows.
 * This will result in always one arrow.
 */
export const axiom4Arrows = ({ vertices_coords }, line, point, options) => {
	const vertices_coords2 = vertices_coords.map(resize2);
	const hull = convexHull(vertices_coords2).map(v => vertices_coords2[v]);
	const foldLine = axiom4(line, point).shift();
	const origin = intersectLineLine(foldLine, line).point;
	const segment = perpendicularBalancedSegment(hull, foldLine, origin);
	return [arrowFromSegmentInPolygon(hull, segment, options)];
};

/**
 * @description Create an array of arrows which neatly describes the action of
 * performing origami axiom 5 on a given FOLD object with 2D vertices.
 * @param {FOLD} graph a FOLD object
 * @param {VecLine2} line the line needed for axiom 5
 * @param {[number, number]} point1 the first point needed for axiom 5
 * @param {[number, number]} point2 the second point needed for axiom 5
 * @param {{ vmin?: number, padding?: number }} options
 * @returns {Arrow[]} an array of definitions for arrows.
 * This will result in one or two arrows (one per solution).
 */
export const axiom5Arrows = ({ vertices_coords }, line, point1, point2, options) => {
	const vertices_coords2 = vertices_coords.map(resize2);
	const hull = convexHull(vertices_coords2).map(v => vertices_coords2[v]);
	return axiom5(line, point1, point2)
		.map(foldLine => [point2, diagramReflectPoint(foldLine, point2)])
		.map(segment => arrowFromSegmentInPolygon(hull, segment, options));
};

/**
 * @description Create an array of arrows which neatly describes the action of
 * performing origami axiom 6 on a given FOLD object with 2D vertices.
 * @param {FOLD} graph a FOLD object
 * @param {VecLine2} line1 the first line needed for axiom 6
 * @param {VecLine2} line2 the second line needed for axiom 6
 * @param {[number, number]} point1 the first point needed for axiom 6
 * @param {[number, number]} point2 the second point needed for axiom 6
 * @param {{ vmin?: number, padding?: number }} options
 * @returns {Arrow[]} an array of definitions for arrows.
 * This will result in zero, two, four, or six arrows (two per solution).
 */
export const axiom6Arrows = ({ vertices_coords }, line1, line2, point1, point2, options) => {
	const vertices_coords2 = vertices_coords.map(resize2);
	const hull = convexHull(vertices_coords2).map(v => vertices_coords2[v]);
	return axiom6(line1, line2, point1, point2)
		.flatMap(foldLine => [point1, point2]
			.map(point => [point, diagramReflectPoint(foldLine, point)]))
		.map(segment => arrowFromSegmentInPolygon(hull, segment, options));
};

/**
 * @description Create an array of arrows which neatly describes the action of
 * performing origami axiom 7 on a given FOLD object with 2D vertices.
 * @param {FOLD} graph a FOLD object
 * @param {VecLine2} line1 the first line needed for axiom 7
 * @param {VecLine2} line2 the second line needed for axiom 7
 * @param {[number, number]} point the point needed for axiom 7
 * @param {{ vmin?: number, padding?: number }} options
 * @returns {Arrow[]} an array of definitions for arrows.
 * This will result in always two arrows (two per solution).
 */
export const axiom7Arrows = ({ vertices_coords }, line1, line2, point, options) => {
	const vertices_coords2 = vertices_coords.map(resize2);
	const hull = convexHull(vertices_coords2).map(v => vertices_coords2[v]);
	return axiom7(line1, line2, point)
		.flatMap(foldLine => [
			[point, diagramReflectPoint(foldLine, point)],
			perpendicularBalancedSegment(
				hull,
				foldLine,
				intersectLineLine(foldLine, line2).point,
			),
		])
		.filter(a => a !== undefined) // is this?
		.map(segment => arrowFromSegmentInPolygon(hull, segment, options));
};
