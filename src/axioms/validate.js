/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import { getBoundary } from "../graph/boundary";
import { arrayify, unarrayify } from "./methods";

const reflectPoint = (foldLine, point) => {
	const matrix = math.core.makeMatrix2Reflect(foldLine.vector, foldLine.origin);
	return math.core.multiplyMatrix2Vector2(matrix, point);
};
/**
 * @description To validate axiom 1 check if the input points are inside the
 * boundary polygon, if so, the solution is valid.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @returns {boolean} true if the solution is valid
 * @linkcode Origami ./src/axioms/validate.js 18
 */
export const validateAxiom1 = (params, boundary) => params.points
	.map(p => math.core.overlapConvexPolygonPoint(boundary, p, math.core.include))
	.reduce((a, b) => a && b, true);
/**
 * @description To validate axiom 2 check if the input points are inside the
 * boundary polygon, if so, the solution is valid.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @returns {boolean} true if the solution is valid
 * @linkcode Origami ./src/axioms/validate.js 29
 */
export const validateAxiom2 = validateAxiom1;
/**
 * @description Validate axiom 3.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {line[]} solutions the solutions from the axiom method (before validation)
 * @returns {boolean[]} array of booleans (true if valid) matching the solutions array
 * @linkcode Origami ./src/axioms/validate.js 38
 */
export const validateAxiom3 = (params, boundary, results) => {
	const segments = params.lines
		.map(line => math.core.clipLineConvexPolygon(boundary,
			line.vector,
			line.origin,
			math.core.include,
			math.core.includeL));
	// if line parameters lie outside polygon, no solution possible
	if (segments[0] === undefined || segments[1] === undefined) {
		return [false, false];
	}
	// test A:
	// make sure the results themselves lie in the polygon
	// exclusive! an exterior line collinear to polygon's point is excluded
	// const results_clip = results
	//   .map(line => line === undefined ? undefined : math.core
	//     .intersectConvexPolygonLine(
	//       boundary,
	//       line.vector,
	//       line.origin,
	//       math.core.includeS,
	//       math.core.excludeL));
	const results_clip = results.map(line => line === undefined
		? undefined
		: math.core.clipLineConvexPolygon(boundary,
			line.vector,
			line.origin,
			math.core.include,
			math.core.includeL));
	const results_inside = [0, 1].map((i) => results_clip[i] !== undefined);
	// test B:
	// make sure that for each of the results, the result lies between two
	// of the parameters, in other words, reflect the segment 0 both ways
	// (both fold solutions) and make sure there is overlap with segment 1
	const seg0Reflect = results.map((foldLine, i) => foldLine === undefined
		? undefined
		: [
			reflectPoint(foldLine, segments[0][0]),
			reflectPoint(foldLine, segments[0][1])
		]);
	const reflectMatch = seg0Reflect.map((seg, i) => seg === undefined
		? false
		: (math.core.overlapLinePoint(math.core
				.subtract(segments[1][1], segments[1][0]),
				segments[1][0], seg[0], math.core.includeS) ||
			math.core.overlapLinePoint(math.core
				.subtract(segments[1][1], segments[1][0]),
				segments[1][0], seg[1], math.core.includeS) ||
			math.core.overlapLinePoint(math.core
				.subtract(seg[1], seg[0]), seg[0],
				segments[1][0], math.core.includeS) ||
			math.core.overlapLinePoint(math.core
				.subtract(seg[1], seg[0]), seg[0],
				segments[1][1], math.core.includeS)
		));
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
 * @linkcode Origami ./src/axioms/validate.js 105
 */
export const validateAxiom4 = (params, boundary) => {
	const intersect = math.core.intersectLineLine(
		params.lines[0].vector,
		params.lines[0].origin,
		math.core.rotate90(params.lines[0].vector),
		params.points[0],
		math.core.includeL,
		math.core.includeL);
	return [params.points[0], intersect]
		.filter(a => a !== undefined)
		.map(p => math.core.overlapConvexPolygonPoint(boundary, p, math.core.include))
		.reduce((a, b) => a && b, true);
};
/**
 * @description Validate axiom 5.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {line[]} solutions the solutions from the axiom method (before validation)
 * @returns {boolean[]} array of booleans (true if valid) matching the solutions array
 * @linkcode Origami ./src/axioms/validate.js 126
 */
export const validateAxiom5 = (params, boundary, results) => {
	if (results.length === 0) { return []; }
	const testParamPoints = params.points
		.map(point => math.core.overlapConvexPolygonPoint(boundary, point, math.core.include))
		.reduce((a, b) => a && b, true);
	const testReflections = results
		.map(foldLine => reflectPoint(foldLine, params.points[1]))
		.map(point => math.core.overlapConvexPolygonPoint(boundary, point, math.core.include));
	return testReflections.map(ref => ref && testParamPoints);
};
/**
 * @description Validate axiom 6.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {line[]} solutions the solutions from the axiom method (before validation)
 * @returns {boolean[]} array of booleans (true if valid) matching the solutions array
 * @linkcode Origami ./src/axioms/validate.js 144
 */
export const validateAxiom6 = function (params, boundary, results) {
	if (results.length === 0) { return []; }
	const testParamPoints = params.points
		.map(point => math.core.overlapConvexPolygonPoint(boundary, point, math.core.include))
		.reduce((a, b) => a && b, true);
	if (!testParamPoints) { return results.map(() => false); }
	const testReflect0 = results
		.map(foldLine => reflectPoint(foldLine, params.points[0]))
		.map(point => math.core.overlapConvexPolygonPoint(boundary, point, math.core.include));
	const testReflect1 = results
		.map(foldLine => reflectPoint(foldLine, params.points[1]))
		.map(point => math.core.overlapConvexPolygonPoint(boundary, point, math.core.include));
	return results.map((_, i) => testReflect0[i] && testReflect1[i]);
};
/**
 * @description Validate axiom 7.
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @returns {boolean} true if the solution is valid
 * @linkcode Origami ./src/axioms/validate.js 165
 */
export const validateAxiom7 = (params, boundary, result) => {
	// check if the point parameter is inside the polygon
	const paramPointTest = math.core
		.overlapConvexPolygonPoint(boundary, params.points[0], math.core.include);
	// check if the reflected point on the fold line is inside the polygon
	if (result === undefined) { return [false]; }
	const reflected = reflectPoint(result, params.points[0]);
	const reflectTest = math.core.overlapConvexPolygonPoint(boundary, reflected, math.core.include);
	// check if the line to fold onto itself is somewhere inside the polygon
	const paramLineTest = (math.core.intersectConvexPolygonLine(boundary,
		params.lines[1].vector,
		params.lines[1].origin,
		math.core.includeS,
		math.core.includeL) !== undefined);
	// same test we do for axiom 4
	const intersect = math.core.intersectLineLine(
		params.lines[1].vector,
		params.lines[1].origin,
		result.vector,
		result.origin,
		math.core.includeL,
		math.core.includeL);
	const intersectInsideTest = intersect
		? math.core.overlapConvexPolygonPoint(boundary, intersect, math.core.include)
		: false;
	return paramPointTest && reflectTest && paramLineTest && intersectInsideTest;
};
/**
 * @description Validate an axiom, this will run one of the submethods ("validateAxiom1", ...).
 * @param {number} number the axiom number, 1-7
 * @param {AxiomParams} params the axiom parameters, lines and points in one object
 * @param {number[][]} boundary an array of points, each point is an array of numbers
 * @param {line[]} solutions the solutions from the axiom method (before validation)
 * @returns {boolean} true if the solution is valid
 * @linkcode Origami ./src/axioms/validate.js 201
 */
export const validate = (number, params, boundary, results) => arrayify(number, [null,
	validateAxiom1,
	validateAxiom2,
	validateAxiom3,
	validateAxiom4,
	validateAxiom5,
	validateAxiom6,
	validateAxiom7,
][number](params, boundary, unarrayify(number, results)));
