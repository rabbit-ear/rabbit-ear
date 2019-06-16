import math from "../../include/math";

/**
 * an axiom_frame is under the key "re:axiom", it contains:
 * - "axiom", the axiom number,
 * - "parameters", the inputs for the axiom. varying set of points and/or lines
 *   - "points": an array of entries. each entry is a point in array form
 *   - "lines": an array of entries. each entry is a line (point, vector) array
 * - "solutions", array of entries. each entry is a line (point, vector) array
 *
 * example: "re:axiom" =
 * {
 *  axiom: 6,
 *  parameters: {
 *    points: [
 *      [0.97319, 0.05149],
 *      [0.93478, 0.93204]
 *    ],
 *    lines: [
 *      [[0.36585, 0.01538], [0.707, 0.707]],
 *      [[0.16846, 0.64646], [1, 0]]
 *    ]
 *  },
 *  solutions: [
 *   [[0.5, 0.625], [0.6, -0.8]],
 *   [[0.25, 0.25], [0.4, -1.0]],
 *   [[0.15, 0.5], [0.2, -0.8]]
 *  ]
 * }
 *
 * example: "re:axiom" =
 * {
 *  axiom: 2,
 *  parameters: {
 *    points: [[0, 0], [1, 1]],
 *  },
 *  solutions: [
 *   [[0.5, 0.5], [0.707, -0.707]],
 *  ],
 *  valid: true / false,  // are the parameters possible to construct
 *  valid_solutions: [    // this should match the size of "solutions"
 *   [[0, 1], [1, 0]]
 *  ]
 *  valid_boundary: [[0, 0], [1, 0], [1, 1], [0, 1]]
 * }
*/

// please make sure poly is an array of points
const test_axiom1_2 = function (axiom_frame, poly) {
  const { points } = axiom_frame.parameters;
  return math.core.point_in_convex_poly(points[0], poly)
    && math.core.point_in_convex_poly(points[1], poly);
};

const test_axiom3 = function (axiom_frame, poly) {
  const Xing = math.core.intersection;
  const { lines } = axiom_frame.parameters;
  const a = Xing.convex_poly_line(poly, lines[0][0], lines[0][1]);
  const b = Xing.convex_poly_line(poly, lines[1][0], lines[1][1]);
  return a !== undefined && b !== undefined;
};

const test_axiom4 = function (axiom_frame, poly) {
  const params = axiom_frame.parameters;
  const overlap = math.core.intersection.line_line(
    params.lines[0][0], params.lines[0][1],
    params.points[0], [params.lines[0][1][1], -params.lines[0][1][0]],
  );
  if (overlap === undefined) { return false; }
  return math.core.point_in_convex_poly(overlap, poly)
    && math.core.point_in_convex_poly(params.points[0], poly);
};
const test_axiom5 = function (axiom_frame, poly) {
  return true;
};
const test_axiom6 = function (axiom_frame, poly) {
  return true;
};
const test_axiom7 = function (axiom_frame, poly) {
  if (axiom_frame.solutions.length === 0) { return false; }
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
  return math.core.point_in_convex_poly(reflected, poly)
    && math.core.point_in_convex_poly(intersect, poly);
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
export const apply_axiom = function (axiom_frame, poly) {
  // re.math.intersection.convex_poly_line
  axiom_frame.valid = test[axiom_frame.axiom].call(null, axiom_frame, poly);
  const polyobject = math.polygon(poly);
  axiom_frame.valid_solutions = (axiom_frame.valid
    ? axiom_frame.solutions.map(s => polyobject.clipLine(s))
    : []);
  return axiom_frame;
};


/**
 * @param {number} axiom is the axiom number, 1-7
 * @param {number[][]} array of points used to perform the axiom,
 *  encoded in array form [x,y]
 * @param {number[][][]} array of lines used to perform the axiom,
 *  encoded as [point, vector]
 * @param {number[][][]} solutions is an array of lines in [point, vector] form
 */
export const make_axiom_frame = function (axiom, parameters, solutions) {
  const solution = {
    axiom,
    parameters,
    solutions,
  };
  Object.defineProperty(solution, "apply", {
    value: (...args) => apply_axiom(solution, ...args)
  });
  return solution;
};
