/**
 * Rabbit Ear (c) Kraft
 */
import {
	normalize2,
	subtract2,
	resizeUp,
	rotate90,
	midpoint2,
	distance2,
} from "../math/algebra/vectors.js";
import { bisectLines2 } from "../math/geometry/lines.js";
import {
	rayLineToUniqueLine,
	uniqueLineToRayLine,
} from "../math/general/types.js";
import { includeL } from "../math/general/functions.js";
import {
	intersectLineLine,
	intersectCircleLine,
} from "../math/intersect/intersect.js";
import { normalAxiom6 } from "./axiomsNormDist.js";
/*           _                       _              _
						(_)                     (_)            (_)
	 ___  _ __ _  __ _  __ _ _ __ ___  _    __ ___  ___  ___  _ __ ___  ___
	/ _ \| '__| |/ _` |/ _` | '_ ` _ \| |  / _` \ \/ / |/ _ \| '_ ` _ \/ __|
 | (_) | |  | | (_| | (_| | | | | | | | | (_| |>  <| | (_) | | | | | \__ \
	\___/|_|  |_|\__, |\__,_|_| |_| |_|_|  \__,_/_/\_\_|\___/|_| |_| |_|___/
								__/ |
							 |___/
/**
 * these origami axioms assume 2D geometry in the 2D plane,
 * where points are parameterized as vectors (Javascript arrays of numbers)
 * and lines are in vector-origin form (Javascript objects with "origin" and "vector")
 *   (themselves are Javascript Arrays, same as "points")
 * where the direction of the vector is along the line, and
 * is not necessarily normalized.
 */

/**
 * @description origami axiom 1: form a line that passes between the given points
 * @param {number[]} point1 one 2D point
 * @param {number[]} point2 one 2D point
 * @returns {RayLine} the line in {vector, origin} form
 * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 28
 */
export const axiom1 = (point1, point2) => ({
	vector: normalize2(subtract2(...resizeUp(point2, point1))),
	origin: point1,
});
/**
 * @description origami axiom 2: form a perpendicular bisector between the given points
 * @param {number[]} point1 one 2D point
 * @param {number[]} point2 one 2D point
 * @returns {RayLine} the line in {vector, origin} form
 * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 39
 */
export const axiom2 = (point1, point2) => ({
	vector: normalize2(rotate90(subtract2(
		...resizeUp(point2, point1),
	))),
	origin: midpoint2(point1, point2),
});
// todo: make sure these all get a resizeUp or whatever is necessary
/**
 * @description origami axiom 3: form two lines that make the two angular bisectors between
 * two input lines, and in the case of parallel inputs only one solution will be given
 * @param {RayLine} line1 one 2D line in {vector, origin} form
 * @param {RayLine} line2 one 2D line in {vector, origin} form
 * @returns {RayLine[]} an array of lines in {vector, origin} form
 * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 54
 */
export const axiom3 = (line1, line2) => bisectLines2(line1, line2);
/**
 * @description origami axiom 4: form a line perpendicular to a given line that
 * passes through a point.
 * @param {RayLine} line one 2D line in {vector, origin} form
 * @param {number[]} point one 2D point
 * @returns {RayLine} the line in {vector, origin} form
 * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 64
 */
export const axiom4 = (line, point) => ({
	vector: rotate90(normalize2(line.vector)),
	origin: point,
});
/**
 * @description origami axiom 5: form up to two lines that pass through a point that also
 * brings another point onto a given line
 * @param {RayLine} line one 2D line in {vector, origin} form
 * @param {number[]} point one 2D point, the point that the line(s) pass through
 * @param {number[]} point one 2D point, the point that is being brought onto the line
 * @returns {RayLine[]} an array of lines in {vector, origin} form
 * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 77
 */
export const axiom5 = (line, point1, point2) => (
	intersectCircleLine(
		{ radius: distance2(point1, point2), origin: point1 },
		line,
		includeL,
	) || []).map(sect => ({
	vector: normalize2(rotate90(subtract2(
		...resizeUp(sect, point2),
	))),
	origin: midpoint2(point2, sect),
}));
/**
 * @description origami axiom 6: form up to three lines that are made by bringing
 * a point to a line and a second point to a second line.
 * @param {RayLine} line1 one 2D line in {vector, origin} form
 * @param {RayLine} line2 one 2D line in {vector, origin} form
 * @param {number[]} point1 the point to bring to the first line
 * @param {number[]} point2 the point to bring to the second line
 * @returns {RayLine[]} an array of lines in {vector, origin} form
 * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 100
 */
export const axiom6 = (line1, line2, point1, point2) => normalAxiom6(
	rayLineToUniqueLine(line1),
	rayLineToUniqueLine(line2),
	point1,
	point2,
).map(uniqueLineToRayLine);
// .map(Constructors.line);
/**
 * @description origami axiom 7: form a line by bringing a point onto a given line
 * while being perpendicular to another given line.
 * @param {RayLine} line1 one 2D line in {vector, origin} form,
 * the line the point will be brought onto.
 * @param {RayLine} line2 one 2D line in {vector, origin} form,
 * the line which the perpendicular will be based off.
 * @param {number[]} point the point to bring onto the line
 * @returns {RayLine | undefined} the line in {vector, origin} form
 * or undefined if the given lines are parallel
 * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 119
 */
export const axiom7 = (line1, line2, point) => {
	const intersect = intersectLineLine(
		line1,
		{ vector: line2.vector, origin: point },
		includeL,
		includeL,
	);
	return intersect === undefined
		? undefined
		: ({
		// todo: switch this out, but test it as you do
			vector: normalize2(rotate90(subtract2(
				...resizeUp(intersect, point),
			))),
			// vector: normalize2(rotate90(line2.vector)),
			origin: midpoint2(point, intersect),
		});
};
