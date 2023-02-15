/**
 * Rabbit Ear (c) Kraft
 */
import { arrayify, unarrayify } from "./methods.js";
import {
	subtract,
	rotate90,
} from "../math/algebra/vectors.js";
import {
	makeMatrix2Reflect,
	multiplyMatrix2Vector2,
} from "../math/algebra/matrix2.js";
import {
	include,
	includeL,
	includeS,
} from "../math/general/functions.js";
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
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @returns {boolean} true if the solution is valid
 * @linkcode Origami ./src/axioms/validate.js 17
 */
export const validateAxiom1 = (params, boundary) => params.points
	.map(p => overlapConvexPolygonPoint(boundary, p, include))
	.reduce((a, b) => a && b, true);
/**
 * @description To validate axiom 2 check if the input points are inside the
 * boundary polygon, if so, the solution is valid.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @returns {boolean} true if the solution is valid
 * @linkcode Origami ./src/axioms/validate.js 28
 */
export const validateAxiom2 = validateAxiom1;
/**
 * @description Validate axiom 3.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {line[]} solutions the solutions from the axiom method (before validation)
 * @returns {boolean[]} array of booleans (true if valid) matching the solutions array
 * @linkcode Origami ./src/axioms/validate.js 37
 */
export const validateAxiom3 = (params, boundary, results) => {
	const segments = params.lines
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
	const results_clip = results.map(line => (line === undefined
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
	const seg0Reflect = results.map(foldLine => (foldLine === undefined
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
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @returns {boolean} true if the solution is valid
 * @linkcode Origami ./src/axioms/validate.js 117
 */
export const validateAxiom4 = (params, boundary) => {
	const intersect = intersectLineLine(
		params.lines[0],
		{ vector: rotate90(params.lines[0].vector), origin: params.points[0] },
		includeL,
		includeL,
	);
	return [params.points[0], intersect]
		.filter(a => a !== undefined)
		.map(p => overlapConvexPolygonPoint(boundary, p, include))
		.reduce((a, b) => a && b, true);
};
/**
 * @description Validate axiom 5.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {line[]} solutions the solutions from the axiom method (before validation)
 * @returns {boolean[]} array of booleans (true if valid) matching the solutions array
 * @linkcode Origami ./src/axioms/validate.js 139
 */
export const validateAxiom5 = (params, boundary, results) => {
	if (results.length === 0) { return []; }
	const testParamPoints = params.points
		.map(point => overlapConvexPolygonPoint(boundary, point, include))
		.reduce((a, b) => a && b, true);
	const testReflections = results
		.map(foldLine => reflectPoint(foldLine, params.points[1]))
		.map(point => overlapConvexPolygonPoint(boundary, point, include));
	return testReflections.map(ref => ref && testParamPoints);
};
/**
 * @description Validate axiom 6.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {line[]} solutions the solutions from the axiom method (before validation)
 * @returns {boolean[]} array of booleans (true if valid) matching the solutions array
 * @linkcode Origami ./src/axioms/validate.js 157
 */
export const validateAxiom6 = function (params, boundary, results) {
	if (results.length === 0) { return []; }
	const testParamPoints = params.points
		.map(point => overlapConvexPolygonPoint(boundary, point, include))
		.reduce((a, b) => a && b, true);
	if (!testParamPoints) { return results.map(() => false); }
	const testReflect0 = results
		.map(foldLine => reflectPoint(foldLine, params.points[0]))
		.map(point => overlapConvexPolygonPoint(boundary, point, include));
	const testReflect1 = results
		.map(foldLine => reflectPoint(foldLine, params.points[1]))
		.map(point => overlapConvexPolygonPoint(boundary, point, include));
	return results.map((_, i) => testReflect0[i] && testReflect1[i]);
};
/**
 * @description Validate axiom 7.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @returns {boolean} true if the solution is valid
 * @linkcode Origami ./src/axioms/validate.js 178
 */
export const validateAxiom7 = (params, boundary, result) => {
	// check if the point parameter is inside the polygon
	const paramPointTest = overlapConvexPolygonPoint(
		boundary,
		params.points[0],
		include,
	);
	// check if the reflected point on the fold line is inside the polygon
	if (result === undefined) { return [false]; }
	const reflected = reflectPoint(result, params.points[0]);
	const reflectTest = overlapConvexPolygonPoint(boundary, reflected, include);
	// check if the line to fold onto itself is somewhere inside the polygon
	const paramLineTest = (intersectConvexPolygonLine(
		boundary,
		params.lines[1],
		includeS,
		includeL,
	) !== undefined);
	// same test we do for axiom 4
	const intersect = intersectLineLine(
		params.lines[1],
		result,
		includeL,
		includeL,
	);
	const intersectInsideTest = intersect
		? overlapConvexPolygonPoint(boundary, intersect, include)
		: false;
	return paramPointTest && reflectTest && paramLineTest && intersectInsideTest;
};
/**
 * @description Validate an axiom, this will run one of the submethods ("validateAxiom1", ...).
 * @param {number} number the axiom number, 1-7
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {line[]} solutions the solutions from the axiom method (before validation)
 * @returns {boolean|boolean[]} for every solution, true if valid. Axioms 1, 2, 4, 7
 * return one boolean, 3, 5, 6 return arrays of booleans.
 * @linkcode Origami ./src/axioms/validate.js 218
 */
export const validateAxiom = (number, params, boundary, results) => arrayify(number, [null,
	validateAxiom1,
	validateAxiom2,
	validateAxiom3,
	validateAxiom4,
	validateAxiom5,
	validateAxiom6,
	validateAxiom7,
][number](params, boundary, unarrayify(number, results)));
