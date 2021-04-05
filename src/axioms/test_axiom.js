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
  .map(p => math.core.overlap_convex_polygon_point(poly, p, ear.math.include))
  .reduce((a, b) => a && b, true)];

const test_axiom3 = (params, poly) => {
  const segments = params.lines.map(line => math.core
    .clip_line_in_convex_polygon(poly,
      line.vector,
      line.origin,
      math.core.include,
      math.core.include_l));
  // if line parameters lie outside polygon, no solution possible
  if (segments[0] === undefined || segments[1] === undefined) {
    return [false, false];
  }
  const results = math.core.axiom3(
    params.lines[0].vector, params.lines[0].origin,
    params.lines[1].vector, params.lines[1].origin);
  // test A:
  // make sure the results themselves lie in the polygon
  // exclusive! an exterior line collinear to polygon's point is excluded
  const results_clip = results
    .map(line => line === undefined ? undefined : math.core
      .intersect_convex_polygon_line(
        poly,
        line.vector,
        line.origin,
        ear.math.include_s,
        ear.math.exclude_l));
  const results_inside = [0, 1].map((i) => results_clip[i] !== undefined);
  // test B:
  // make sure that for each of the results, the result lies between two
  // of the parameters, in other words, reflect the segment 0 both ways
  // (both fold solutions) and make sure there is overlap with segment 1
  const seg0Reflect = results
    .map((foldLine, i) => foldLine === undefined ? undefined : [
      reflect_point(foldLine, segments[0][0]),
      reflect_point(foldLine, segments[0][1])
    ]);
  const reflectMatch = seg0Reflect
    .map((seg, i) => seg === undefined ? false : (
      math.core.overlap_line_point(math.core
        .subtract(segments[1][1], segments[1][0]),
        segments[1][0], seg[0], math.core.include_s) ||
      math.core.overlap_line_point(math.core
        .subtract(segments[1][1], segments[1][0]),
        segments[1][0], seg[1], math.core.include_s) ||
      math.core.overlap_line_point(math.core
        .subtract(seg[1], seg[0]), seg[0],
        segments[1][0], math.core.include_s) ||
      math.core.overlap_line_point(math.core
        .subtract(seg[1], seg[0]), seg[0],
        segments[1][1], math.core.include_s)
    ));
  // valid if A and B
  return [0, 1].map(i => reflectMatch[i] === true && results_inside[i] === true);
};

const test_axiom4 = (params, poly) => {
  const intersect = math.core.intersect_line_line(
    params.lines[0].vector, params.lines[0].origin,
    math.core.rotate90(params.lines[0].vector), params.points[0],
    math.core.include_l, math.core.include_l);
  return [
    [params.points[0], intersect]
      .filter(a => a !== undefined)
      .map(p => math.core.overlap_convex_polygon_point(poly, p, math.core.include))
      .reduce((a, b) => a && b, true)
  ];
};

const test_axiom5 = (params, poly) => {
  const result = math.core.axiom5(
    params.lines[0].vector, params.lines[0].origin,
    params.points[0], params.points[1]);
  if (result.length === 0) { return []; }
  const testParamPoints = params.points
    .map(point => math.core.overlap_convex_polygon_point(poly, point, math.core.include))
    .reduce((a, b) => a && b, true);
  const testReflections = result
    .map(foldLine => reflect_point(foldLine, params.points[1]))
    .map(point => math.core.overlap_convex_polygon_point(poly, point, math.core.include));
  return testReflections.map(ref => ref && testParamPoints);
};

const test_axiom6 = function (params, poly) {
  const results = math.core.axiom6(
    params.lines[0].vector, params.lines[0].origin,
    params.lines[1].vector, params.lines[1].origin,
    params.points[0], params.points[1]);
  if (results.length === 0) { return []; }
  const testParamPoints = params.points
    .map(point => math.core.overlap_convex_polygon_point(poly, point, math.core.include))
    .reduce((a, b) => a && b, true);
  if (!testParamPoints) { return results.map(() => false); }
  const testReflect0 = results
    .map(foldLine => reflect_point(foldLine, params.points[0]))
    .map(point => math.core.overlap_convex_polygon_point(poly, point, math.core.include));
  const testReflect1 = results
    .map(foldLine => reflect_point(foldLine, params.points[1]))
    .map(point => math.core.overlap_convex_polygon_point(poly, point, math.core.include));
  return results.map((_, i) => testReflect0[i] && testReflect1[i]);
};

const test_axiom7 = (params, poly) => {
  // check if the point parameter is inside the polygon
  const paramPointTest = math.core
    .overlap_convex_polygon_point(poly, params.points[0], math.core.include);
  // check if the reflected point on the fold line is inside the polygon
  const foldLine = math.core.axiom7(
    params.lines[0].vector, params.lines[0].origin,
    params.lines[1].vector, params.points[0]);
  if (foldLine === undefined) { return [false]; }
  const reflected = reflect_point(foldLine, params.points[0]);
  const reflectTest = math.core.overlap_convex_polygon_point(poly, reflected, math.core.include);
  // check if the line to fold onto itself is somewhere inside the polygon
  const paramLineTest = (math.core.intersect_convex_polygon_line(poly,
    params.lines[1].vector,
    params.lines[1].origin,
    math.core.include_s,
    math.core.include_l) !== undefined);
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

