/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import {
  axiom3,
  axiom5,
  axiom6,
  axiom7,
} from "./axioms";
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

/**
 * @description axiom 1 and 2, check input points, if they are both
 * inside the boundary polygon, the solution is valid.
 */
const validate_axiom1_2 = (params, boundary) => [params.points
  .map(p => math.core.overlap_convex_polygon_point(boundary, p, ear.math.include))
  .reduce((a, b) => a && b, true)];

const validate_axiom3 = (params, boundary) => {
  const segments = params.lines.map(line => math.core
    .clip_line_in_convex_polygon(boundary,
      line.vector,
      line.origin,
      math.core.include,
      math.core.include_l));
  // if line parameters lie outside polygon, no solution possible
  if (segments[0] === undefined || segments[1] === undefined) {
    return [false, false];
  }
  const results = axiom3(
    params.lines[0].vector, params.lines[0].origin,
    params.lines[1].vector, params.lines[1].origin);
  // test A:
  // make sure the results themselves lie in the polygon
  // exclusive! an exterior line collinear to polygon's point is excluded
  const results_clip = results
    .map(line => line === undefined ? undefined : math.core
      .intersect_convex_polygon_line(
        boundary,
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

const validate_axiom4 = (params, boundary) => {
  const intersect = math.core.intersect_line_line(
    params.lines[0].vector, params.lines[0].origin,
    math.core.rotate90(params.lines[0].vector), params.points[0],
    math.core.include_l, math.core.include_l);
  return [
    [params.points[0], intersect]
      .filter(a => a !== undefined)
      .map(p => math.core.overlap_convex_polygon_point(boundary, p, math.core.include))
      .reduce((a, b) => a && b, true)
  ];
};

const validate_axiom5 = (params, boundary) => {
  const result = axiom5(
    params.lines[0].vector, params.lines[0].origin,
    params.points[0], params.points[1]);
  if (result.length === 0) { return []; }
  const testParamPoints = params.points
    .map(point => math.core.overlap_convex_polygon_point(boundary, point, math.core.include))
    .reduce((a, b) => a && b, true);
  const testReflections = result
    .map(foldLine => reflect_point(foldLine, params.points[1]))
    .map(point => math.core.overlap_convex_polygon_point(boundary, point, math.core.include));
  return testReflections.map(ref => ref && testParamPoints);
};

const validate_axiom6 = function (params, boundary) {
  const results = axiom6(
    params.lines[0].vector, params.lines[0].origin,
    params.lines[1].vector, params.lines[1].origin,
    params.points[0], params.points[1]);
  if (results.length === 0) { return []; }
  const testParamPoints = params.points
    .map(point => math.core.overlap_convex_polygon_point(boundary, point, math.core.include))
    .reduce((a, b) => a && b, true);
  if (!testParamPoints) { return results.map(() => false); }
  const testReflect0 = results
    .map(foldLine => reflect_point(foldLine, params.points[0]))
    .map(point => math.core.overlap_convex_polygon_point(boundary, point, math.core.include));
  const testReflect1 = results
    .map(foldLine => reflect_point(foldLine, params.points[1]))
    .map(point => math.core.overlap_convex_polygon_point(boundary, point, math.core.include));
  return results.map((_, i) => testReflect0[i] && testReflect1[i]);
};

const validate_axiom7 = (params, boundary) => {
  // check if the point parameter is inside the polygon
  const paramPointTest = math.core
    .overlap_convex_polygon_point(boundary, params.points[0], math.core.include);
  // check if the reflected point on the fold line is inside the polygon
  const foldLine = axiom7(
    params.lines[0].vector, params.lines[0].origin,
    params.lines[1].vector, params.points[0]);
  if (foldLine === undefined) { return [false]; }
  const reflected = reflect_point(foldLine, params.points[0]);
  const reflectTest = math.core.overlap_convex_polygon_point(boundary, reflected, math.core.include);
  // check if the line to fold onto itself is somewhere inside the polygon
  const paramLineTest = (math.core.intersect_convex_polygon_line(boundary,
    params.lines[1].vector,
    params.lines[1].origin,
    math.core.include_s,
    math.core.include_l) !== undefined);
  return [paramPointTest && reflectTest && paramLineTest];
};

const validate_axiom_funcs = [null,
  validate_axiom1_2,
  validate_axiom1_2,
  validate_axiom3,
  validate_axiom4,
  validate_axiom5,
  validate_axiom6,
  validate_axiom7,
];
delete validate_axiom_funcs[0];

// todo: get boundary needs support for multiple boundaries
const validate_axiom = (number, params, obj) => {
  const boundary = (typeof obj === "object" && obj.vertices_coords)
    ? get_boundary(obj).vertices.map(v => obj.vertices_coords[v])
    : obj;
  return validate_axiom_funcs[number](params, boundary);
};

Object.keys(validate_axiom_funcs).forEach(number => {
  validate_axiom[number] = (...args) => validate_axiom(number, ...args);
});

export default validate_axiom;
