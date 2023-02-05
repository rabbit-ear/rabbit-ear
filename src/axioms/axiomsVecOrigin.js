/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math.js";
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
	vector: math.core.normalize2(math.core.subtract2(...math.core.resizeUp(point2, point1))),
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
	vector: math.core.normalize2(math.core.rotate90(math.core.subtract2(
		...math.core.resizeUp(point2, point1),
	))),
	origin: math.core.midpoint2(point1, point2),
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
export const axiom3 = (line1, line2) => math.core
	.bisectLines2(line1.vector, line1.origin, line2.vector, line2.origin);
/**
 * @description origami axiom 4: form a line perpendicular to a given line that
 * passes through a point.
 * @param {RayLine} line one 2D line in {vector, origin} form
 * @param {number[]} point one 2D point
 * @returns {RayLine} the line in {vector, origin} form
 * @linkcode Origami ./src/axioms/axiomsVecOrigin.js 64
 */
export const axiom4 = (line, point) => ({
	vector: math.core.rotate90(math.core.normalize2(line.vector)),
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
	math.core.intersectCircleLine(
		math.core.distance2(point1, point2),
		point1,
		line.vector,
		line.origin,
		math.core.include_l,
	) || []).map(sect => ({
	vector: math.core.normalize2(math.core.rotate90(math.core.subtract2(
		...math.core.resizeUp(sect, point2),
	))),
	origin: math.core.midpoint2(point2, sect),
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
	math.core.rayLineToUniqueLine(line1),
	math.core.rayLineToUniqueLine(line2),
	point1,
	point2,
).map(math.core.uniqueLineToRayLine);
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
	const intersect = math.core.intersectLineLine(
		line1.vector,
		line1.origin,
		line2.vector,
		point,
		math.core.include_l,
		math.core.include_l,
	);
	return intersect === undefined
		? undefined
		: ({
		// todo: switch this out, but test it as you do
			vector: math.core.normalize2(math.core.rotate90(math.core.subtract2(
				...math.core.resizeUp(intersect, point),
			))),
			// vector: math.core.normalize2(math.core.rotate90(line2.vector)),
			origin: math.core.midpoint2(point, intersect),
		});
};
