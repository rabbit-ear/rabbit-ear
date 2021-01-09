import math from "../math";
import axiom from "./index";
import { get_boundary } from "../graph/boundary";

const reflect_point = (foldLine, point) => {
	const matrix = math.core.make_matrix2_reflect(foldLine.vector, foldLine.origin);
  return math.core.multiply_matrix2_vector2(matrix, point);
};
/**
 * All test methods follow the same format
 *
 * @param {object} the same parameter object passed to axioms method,
 *  it includes a "points" or "lines" key with array of values
 * @param {number[][]} an array of points, and points are arrays of numbers
 * @returns {boolean[]} array of true/false, array indices match the return
 *  values from the axioms method.
 */
const test_axiom1_2 = (params, poly) => [params.points
	.map(p => math.core.point_in_convex_poly_inclusive(p, poly))
	.reduce((a, b) => a && b, true)];

const test_axiom3 = (params, poly) => {
	// if line parameters lie outside polygon, no solution possible
	const segments = params.lines.map(line => math.core
		.clip_line_in_convex_poly_inclusive(poly, line.vector, line.origin));
	if (segments[0] === undefined || segments[1] === undefined) {
		return [false, false];
	}
	// reflect one of the lines and check if there is any overlap between the two
	const results = math.core.axiom3(
		params.lines[0].vector, params.lines[0].origin,
		params.lines[1].vector, params.lines[1].origin);
	const seg0Reflect = results
		.map((foldLine, i) => foldLine === undefined ? undefined : [
			reflect_point(foldLine, segments[0][0]),
			reflect_point(foldLine, segments[0][1])
		]);
	return seg0Reflect.map(seg => seg === undefined ? undefined : (
		math.core.point_on_segment_inclusive(seg[0], segments[1][0], segments[1][1]) ||
		math.core.point_on_segment_inclusive(seg[1], segments[1][0], segments[1][1]) ||
		math.core.point_on_segment_inclusive(segments[1][0], seg[0], seg[1]) ||
		math.core.point_on_segment_inclusive(segments[1][1], seg[0], seg[1])
	));
};

const test_axiom4 = (params, poly) => {
	const intersect = math.core.intersect_lines(
		params.lines[0].vector, params.lines[0].origin,
		math.core.rotate90(params.lines[0].vector), params.points[0],
		math.core.include_l, math.core.include_l);
	return [
		[params.points[0], intersect]
			.map(p => math.core.point_in_convex_poly_inclusive(p, poly))
			.reduce((a, b) => a && b, true)
	];
};

const test_axiom5 = (params, poly) => {
	const result = math.core.axiom5(
		params.lines[0].vector, params.lines[0].origin,
		params.points[0], params.points[1]);
	if (result.length === 0) { return []; }
	const testParamPoints = params.points
		.map(point => math.core.point_in_convex_poly_inclusive(point, poly))
		.reduce((a, b) => a && b, true);
	const testReflections = result
		.map(foldLine => reflect_point(foldLine, params.points[1]))
		.map(point => math.core.point_in_convex_poly_inclusive(point, poly));
	return testReflections.map(ref => ref && testParamPoints);
};

const test_axiom6 = function (params, poly) {
	const results = math.core.axiom6(
		params.lines[0].vector, params.lines[0].origin,
		params.lines[1].vector, params.lines[1].origin,
		params.points[0], params.points[1]);
	if (results.length === 0) { return []; }
	const testParamPoints = params.points
		.map(point => math.core.point_in_convex_poly_inclusive(point, poly))
		.reduce((a, b) => a && b, true);
	if (!testParamPoints) { return results.map(() => false); }
	const testReflect0 = results
		.map(foldLine => reflect_point(foldLine, params.points[0]))
		.map(point => math.core.point_in_convex_poly_inclusive(point, poly));
	const testReflect1 = results
		.map(foldLine => reflect_point(foldLine, params.points[1]))
		.map(point => math.core.point_in_convex_poly_inclusive(point, poly));
	return results.map((_, i) => testReflect0[i] && testReflect1[i]);
};

const test_axiom7 = (params, poly) => {
	// check if the point parameter is inside the polygon
	const paramPointTest = math.core
		.point_in_convex_poly_inclusive(params.points[0], poly);
	// check if the reflected point on the fold line is inside the polygon
	const foldLine = math.core.axiom7(
		params.lines[0].vector, params.lines[0].origin,
		params.lines[1].vector, params.points[0]);
	const reflected = reflect_point(foldLine, params.points[0]);
	const reflectTest = math.core.point_in_convex_poly_inclusive(reflected, poly);
	// check if the line to fold onto itself is somewhere inside the polygon
	const paramLineTest = (math.core.convex_poly_line_inclusive(poly,
		params.lines[1].vector,
		params.lines[1].origin) !== undefined);
	return [paramPointTest && reflectTest && paramLineTest];
};

const test_axiom_funcs = [null,
  test_axiom1_2,
  test_axiom1_2,
  test_axiom3,
  test_axiom4,
  test_axiom5,
  test_axiom6,
  test_axiom7,
];
delete test_axiom_funcs[0];

// todo: get boundary needs support for multiple boundaries
const test_axiom = (number, params, obj) => {
	const boundary = (typeof obj === "object" && obj.vertices_coords)
		? get_boundary(obj).vertices.map(v => obj.vertices_coords[v])
		: obj;
	return test_axiom_funcs[number](params, boundary);
};

Object.keys(test_axiom_funcs).forEach(number => {
	test_axiom[number] = (...args) => test_axiom(number, ...args);
});

export default test_axiom;

