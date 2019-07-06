import math from "../../include/math";
import { get_boundary } from "../fold/query";

// please make sure poly is an array of points
const test_axiom1_2 = function (axiom_frame, poly) {
  const { points } = axiom_frame.parameters;
  axiom_frame.valid = math.core.point_in_convex_poly(points[0], poly)
    && math.core.point_in_convex_poly(points[1], poly);
  axiom_frame.valid_solutions = [axiom_frame.valid];
};

const test_axiom3 = function (axiom_frame, poly) {
  const Xing = math.core.intersection;
  const { lines } = axiom_frame.parameters;
  const a = Xing.convex_poly_line(poly, lines[0][0], lines[0][1]);
  const b = Xing.convex_poly_line(poly, lines[1][0], lines[1][1]);
  axiom_frame.valid = (a !== undefined && b !== undefined);
  axiom_frame.valid_solutions = axiom_frame.solutions
    .map(s => (s === undefined
      ? false
      : Xing.convex_poly_line(poly, s[0], s[1]) !== undefined));
};

const test_axiom4 = function (axiom_frame, poly) {
  const params = axiom_frame.parameters;
  const overlap = math.core.intersection.line_line(
    params.lines[0][0], params.lines[0][1],
    params.points[0], [params.lines[0][1][1], -params.lines[0][1][0]],
  );
  if (overlap === undefined) {
    axiom_frame.valid = false;
    axiom_frame.valid_solutions = [false];
  }
  axiom_frame.valid = math.core.point_in_convex_poly(overlap, poly)
    && math.core.point_in_convex_poly(params.points[0], poly);
  axiom_frame.valid_solutions = [axiom_frame.valid];
};
const test_axiom5 = function (axiom_frame, poly) {
  if (axiom_frame.solutions.length === 0) {
    axiom_frame.valid = false;
    axiom_frame.valid_solutions = [false, false];
    return;
  }
  // todo: not done
  const params = axiom_frame.parameters;
  axiom_frame.test = {};
  axiom_frame.test.points_reflected = axiom_frame.solutions
    .map(s => math.core.make_matrix2_reflection(s[1], s[0]))
    .map(m => math.core.multiply_vector2_matrix2(params.points[1], m));
  axiom_frame.valid = math.core.point_in_convex_poly(params.points[0], poly)
    && math.core.point_in_convex_poly(params.points[1], poly);
  axiom_frame.valid_solutions = axiom_frame.test.points_reflected
    .map(p => math.core.point_in_convex_poly(p, poly));
};
const test_axiom6 = function (axiom_frame, poly) {
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

  const params = axiom_frame.parameters;
  axiom_frame.test = {};
  axiom_frame.test.points_reflected = axiom_frame.solutions
    .map(s => math.core.make_matrix2_reflection(s[1], s[0]))
    .map(m => params.points
      .map(p => math.core.multiply_vector2_matrix2(p, m)))
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
const test_axiom7 = function (axiom_frame, poly) {
  if (axiom_frame.solutions.length === 0) {
    axiom_frame.valid = false;
    axiom_frame.valid_solutions = [false];
  }
  const solution = axiom_frame.solutions[0];
  const params = axiom_frame.parameters;
  const m = math.core.make_matrix2_reflection(solution[1], solution[0]);
  const reflected = math.core.multiply_vector2_matrix2(params.points[0], m);
  const intersect = math.core.intersection.line_line(
    params.lines[1][0], params.lines[1][1],
    solution[0], solution[1],
  );
  axiom_frame.test = {
    points_reflected: [reflected], // 1:1 length as paramters.points
  };
  axiom_frame.valid = math.core.point_in_convex_poly(params.points[0], poly)
    && math.core.point_in_convex_poly(reflected, poly)
    && math.core.point_in_convex_poly(intersect, poly);
  axiom_frame.valid_solutions = [axiom_frame.valid];
};

const test = [null,
  test_axiom1_2,
  test_axiom1_2,
  test_axiom3,
  test_axiom4,
  test_axiom5,
  test_axiom6,
  test_axiom7,
];


/**
 * this modifies the input argument axiom_frame
 *
 */
const apply_axiom_in_polygon = function (axiom_frame, poly) {
  // re.math.intersection.convex_poly_line
  test[axiom_frame.axiom].call(null, axiom_frame, poly);
  // const polyobject = math.polygon(poly);
  // axiom_frame.valid_solutions = (axiom_frame.valid
  //   ? axiom_frame.solutions.map(s => polyobject.clipLine(s))
  //   : []);
  return axiom_frame;
};

/**
 * this modifies the input argument axiom_frame
 *
 */
const apply_axiom_in_fold = function (axiom_frame, fold_object) {
  const boundary = get_boundary(fold_object);
  const polygon = boundary.vertices.map(v => fold_object.vertices_coords[v]);
  test[axiom_frame.axiom].call(null, axiom_frame, polygon);
  return axiom_frame;
};

export {
  apply_axiom_in_polygon,
  apply_axiom_in_fold
};
