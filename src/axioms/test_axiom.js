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

// todo
const test_axiom3 = (params, poly) => [true, true];

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

// todo
const test_axiom6 = function (params, poly) {
	return [true, true, true];

  const Xing = math.core.intersection;
  const solutions_inside = axiom_frame.solutions.map(s => Xing.convex_poly_line(poly, s[0], s[1])).filter(a => a !== undefined);

  if (solutions_inside.length === 0) {
    axiom_frame.valid = false;
    axiom_frame.valid_solutions = [false, false, false];
    return;
  }
  const { lines } = axiom_frame.parameters;
  const a = Xing.convex_poly_line(poly, lines[0][0], lines[0][1]);
  const b = Xing.convex_poly_line(poly, lines[1][0], lines[1][1]);

  // const params = axiom_frame.parameters;
  axiom_frame.test = {};
  axiom_frame.test.points_reflected = axiom_frame.solutions
    .map(s => math.core.make_matrix2_reflect(s[1], s[0]))
    .map(m => params.points
      .map(p => math.core.multiply_matrix2_vector2(m, p)))
    .reduce((prev, curr) => prev.concat(curr), []);

  axiom_frame.valid = a !== undefined && b !== undefined
    && math.core.point_in_convex_poly(params.points[0], poly)
    && math.core.point_in_convex_poly(params.points[1], poly);
  axiom_frame.valid_solutions = axiom_frame.solutions
    .map((solution, i) => [
      axiom_frame.test.points_reflected[(i * 2)],
      axiom_frame.test.points_reflected[(i * 2) + 1]
    ])
    .map(p => math.core.point_in_convex_poly(p[0], poly)
      && math.core.point_in_convex_poly(p[1], poly));
  while (axiom_frame.valid_solutions.length < 3) {
    axiom_frame.valid_solutions.push(false);
  }
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

