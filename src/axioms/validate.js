/**
 * Rabbit Ear (c) Kraft
 */
import {
	subtract,
	rotate90,
} from "../math/algebra/vector.js";
import {
	makeMatrix2Reflect,
	multiplyMatrix2Vector2,
} from "../math/algebra/matrix2.js";
import {
	include,
	includeL,
	includeS,
} from "../math/general/function.js";
import {
	overlapLinePoint,
	overlapConvexPolygonPoint,
} from "../math/intersect/overlap.js";
import {
	intersectLineLine,
	intersectConvexPolygonLine,
} from "../math/intersect/intersect.js";
import {
	clipLineConvexPolygon,
} from "../math/intersect/clip.js";

const reflectPoint = (foldLine, point) => {
	const matrix = makeMatrix2Reflect(foldLine.vector, foldLine.origin);
	return multiplyMatrix2Vector2(matrix, point);
};
/**
 * @description To validate axiom 1 check if the input points are inside the
 * boundary polygon, if so, the solution is valid.
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {VecLine[]} solutions an array of solutions in vector-origin form
 * @param {number[]} point1 the point parameter for axiom 1
 * @param {number[]} point2 the point parameter for axiom 1
 * @returns {boolean} true if the solution is valid
 * @linkcode Origami ./src/axioms/validate.js 40
 */
export const validateAxiom1 = (boundary, solutions, point1, point2) => [point1, point2]
	.map(p => overlapConvexPolygonPoint(boundary, p, include))
	.reduce((a, b) => a && b, true);
/**
 * @description To validate axiom 2 check if the input points are inside the
 * boundary polygon, if so, the solution is valid.
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {VecLine[]} solutions an array of solutions in vector-origin form
 * @param {number[]} point1 the point parameter for axiom 2
 * @param {number[]} point2 the point parameter for axiom 2
 * @returns {boolean} true if the solution is valid
 * @linkcode Origami ./src/axioms/validate.js 51
 */
export const validateAxiom2 = validateAxiom1;
/**
 * @description Validate axiom 3.
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {VecLine[]} solutions an array of solutions in vector-origin form
 * @param {VecLine} line1 the line parameter for axiom 3
 * @param {VecLine} line2 the line parameter for axiom 3
 * @returns {boolean[]} array of booleans (true if valid) matching the solutions array
 * @linkcode Origami ./src/axioms/validate.js 60
 */
export const validateAxiom3 = (boundary, solutions, line1, line2) => {
	const segments = [line1, line2]
		.map(line => clipLineConvexPolygon(
			boundary,
			line,
			include,
			includeL,
		));
	// if line parameters lie outside polygon, no solution possible
	if (segments[0] === undefined || segments[1] === undefined) {
		return [false, false];
	}
	// test A:
	// make sure the results themselves lie in the polygon
	// exclusive! an exterior line collinear to polygon's point is excluded
	// const results_clip = results
	//   .map(line => line === undefined ? undefined : math
	//     .intersectConvexPolygonLine(
	//       boundary,
	//       line,
	//       includeS,
	//       excludeL));
	const results_clip = solutions.map(line => (line === undefined
		? undefined
		: clipLineConvexPolygon(
			boundary,
			line,
			include,
			includeL,
		)));
	const results_inside = [0, 1].map((i) => results_clip[i] !== undefined);
	// test B:
	// make sure that for each of the results, the result lies between two
	// of the parameters, in other words, reflect the segment 0 both ways
	// (both fold solutions) and make sure there is overlap with segment 1
	const seg0Reflect = solutions.map(foldLine => (foldLine === undefined
		? undefined
		: [
			reflectPoint(foldLine, segments[0][0]),
			reflectPoint(foldLine, segments[0][1]),
		]));
	const reflectMatch = seg0Reflect.map(seg => (seg === undefined
		? false
		: (overlapLinePoint(
			{ vector: subtract(segments[1][1], segments[1][0]), origin: segments[1][0] },
			seg[0],
			includeS,
		)
		|| overlapLinePoint(
			{ vector: subtract(segments[1][1], segments[1][0]), origin: segments[1][0] },
			seg[1],
			includeS,
		)
		|| overlapLinePoint(
			{ vector: subtract(seg[1], seg[0]), origin: seg[0] },
			segments[1][0],
			includeS,
		)
		|| overlapLinePoint(
			{ vector: subtract(seg[1], seg[0]), origin: seg[0] },
			segments[1][1],
			includeS,
		))));
	// valid if A and B
	return [0, 1].map(i => reflectMatch[i] === true && results_inside[i] === true);
};
/**
 * @description To validate axiom 4 check if the input point lies within
 * the boundary and the intersection between the solution line and the
 * input line lies within the boundary.
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {VecLine[]} solutions an array of solutions in vector-origin form
 * @param {VecLine} line the line parameter for axiom 4
 * @param {number[]} point the point parameter for axiom 4
 * @returns {boolean} true if the solution is valid
 * @linkcode Origami ./src/axioms/validate.js 135
 */
export const validateAxiom4 = (boundary, solutions, line, point) => {
	const intersect = intersectLineLine(
		line,
		{ vector: rotate90(line.vector), origin: point },
		includeL,
		includeL,
	);
	return [point, intersect]
		.filter(a => a !== undefined)
		.map(p => overlapConvexPolygonPoint(boundary, p, include))
		.reduce((a, b) => a && b, true);
};
/**
 * @description Validate axiom 5.
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {VecLine[]} solutions an array of solutions in vector-origin form
 * @param {VecLine} line the line parameter for axiom 5
 * @param {number[]} point1 the point parameter for axiom 5
 * @param {number[]} point2 the point parameter for axiom 5
 * @returns {boolean[]} array of booleans (true if valid) matching the solutions array
 * @linkcode Origami ./src/axioms/validate.js 155
 */
export const validateAxiom5 = (boundary, solutions, line, point1, point2) => {
	if (solutions.length === 0) { return []; }
	const testParamPoints = [point1, point2]
		.map(point => overlapConvexPolygonPoint(boundary, point, include))
		.reduce((a, b) => a && b, true);
	const testReflections = solutions
		.map(foldLine => reflectPoint(foldLine, point2))
		.map(point => overlapConvexPolygonPoint(boundary, point, include));
	return testReflections.map(ref => ref && testParamPoints);
};
/**
 * @description Validate axiom 6.
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {VecLine[]} solutions an array of solutions in vector-origin form
 * @param {VecLine} line1 the line parameter for axiom 6
 * @param {VecLine} line2 the line parameter for axiom 6
 * @param {number[]} point1 the point parameter for axiom 6
 * @param {number[]} point2 the point parameter for axiom 6
 * @returns {boolean[]} array of booleans (true if valid) matching the solutions array
 * @linkcode Origami ./src/axioms/validate.js 173
 */
export const validateAxiom6 = function (boundary, solutions, line1, line2, point1, point2) {
	if (solutions.length === 0) { return []; }
	const testParamPoints = [point1, point2]
		.map(point => overlapConvexPolygonPoint(boundary, point, include))
		.reduce((a, b) => a && b, true);
	if (!testParamPoints) { return solutions.map(() => false); }
	const testReflect0 = solutions
		.map(foldLine => reflectPoint(foldLine, point1))
		.map(point => overlapConvexPolygonPoint(boundary, point, include));
	const testReflect1 = solutions
		.map(foldLine => reflectPoint(foldLine, point2))
		.map(point => overlapConvexPolygonPoint(boundary, point, include));
	return solutions.map((_, i) => testReflect0[i] && testReflect1[i]);
};
/**
 * @description Validate axiom 7.
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {VecLine[]} solutions an array of solutions in vector-origin form
 * @param {VecLine} line1 the line parameter for axiom 7
 * @param {VecLine} line2 the line parameter for axiom 7
 * @param {number[]} point the point parameter for axiom 7
 * @returns {boolean} true if the solution is valid
 * @linkcode Origami ./src/axioms/validate.js 194
 */
export const validateAxiom7 = (boundary, solutions, line1, line2, point) => {
	// check if the point parameter is inside the polygon
	const paramPointTest = overlapConvexPolygonPoint(
		boundary,
		point,
		include,
	);
	// check if the reflected point on the fold line is inside the polygon
	if (!solutions.length) { return [false]; }
	const reflected = reflectPoint(solutions[0], point);
	const reflectTest = overlapConvexPolygonPoint(boundary, reflected, include);
	// check if the line to fold onto itself is somewhere inside the polygon
	const paramLineTest = (intersectConvexPolygonLine(
		boundary,
		line2,
		includeS,
		includeL,
	) !== undefined);
	// same test we do for axiom 4
	const intersect = intersectLineLine(
		line2,
		solutions[0],
		includeL,
		includeL,
	);
	const intersectInsideTest = intersect
		? overlapConvexPolygonPoint(boundary, intersect, include)
		: false;
	return paramPointTest && reflectTest && paramLineTest && intersectInsideTest;
};
/**
 * @description Validate an axiom, this will run one of
 * the submethods ("validateAxiom1", "validateAxiom2", ...).
 * @param {number} number the axiom number, 1-7
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {VecLine[]} solutions an array of solutions in vector-origin form
 * @param {number[] | VecLine} ...args the input parameters to the axiom method
 * @returns {boolean|boolean[]} for every solution, true if valid. Axioms 1, 2, 4, 7
 * return one boolean, 3, 5, 6 return arrays of booleans.
 * @linkcode Origami ./src/axioms/validate.js 234
 */
export const validateAxiom = (number, boundary, solutions, ...args) => [null,
	validateAxiom1,
	validateAxiom2,
	validateAxiom3,
	validateAxiom4,
	validateAxiom5,
	validateAxiom6,
	validateAxiom7,
][number](boundary, solutions, ...args);
