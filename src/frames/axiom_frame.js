import { apply_axiom_in_polygon } from "../origami/axioms_test";

/**
 * @param {number} axiom is the axiom number, 1-7
 * @param {number[][]} array of points used to perform the axiom,
 *  encoded in array form [x,y]
 * @param {number[][][]} array of lines used to perform the axiom,
 *  encoded as [point, vector]
 * @param {number[][][]} solutions is an array of lines in [point, vector] form
 */
const make_axiom_frame = function (axiom, parameters, solutions) {
  const solution = {
    axiom,
    parameters,
    solutions,
  };
  Object.defineProperty(solution, "apply", {
    value: (...args) => apply_axiom_in_polygon(solution, ...args)
  });
  return solution;
};

export default make_axiom_frame;

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
 *  axiom: 3,
 *  parameters: {
 *    lines: [
 *     [[0, 0], [1, 1]],
 *     [[0, 1], [1, 0]]
 *    ]
 *  },
 *  solutions: [
 *   [[0.5, 0.5], [1, 0]],
 *   [[0.5, 0.5], [0, 1]],
 *  ],
 *  valid: true / false,  // are the parameters possible to construct
 *  valid_solutions: [    // are the solutions possible
 *   true,
 *   false
 *  ]
 * }
*/
