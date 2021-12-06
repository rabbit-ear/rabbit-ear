/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import validate_axiom from "./validate";
import * as AxiomsVO from "./axioms";
import * as AxiomsUD from "./axioms_ud";
/**
 * @description the core axiom methods return arrays for *some* of
 * the axioms.
 * @param {number} the axiom number
 * @returns {boolean} true false, does the core method return an array?
 */
const axiom_returns_array = (number) => {
  switch (number) {
    case 3: case "3":
    case 5: case "5":
    case 6: case "6": return true;
    default: return false;
  }
};

const check_params = (params) => ({
  points: (params.points || []).map(p => math.core.get_vector(p)),
  lines: (params.lines || []).map(l => math.core.get_line(l)),
  lines_ud: (params.lines || [])
    .map(l => l.u !== undefined && l.d !== undefined ? l : undefined)
    .filter(a => a !== undefined)
});
const axiom_vector_origin = (number, params) => {
  const result = AxiomsVO[`axiom${number}`](...params.lines, ...params.points);
  const array_results = axiom_returns_array(number)
    ? result
    : [result].filter(a => a !== undefined);
  return array_results.map(line => math.line(line));
};
const axiom_normal_distance = (number, params) => {
  const result = AxiomsUD[`axiom${number}ud`](...params.lines_ud, ...params.points)
  const array_results = axiom_returns_array(number)
    ? result
    : [result].filter(a => a !== undefined);
  return array_results.map(line => math.line.ud(line));
};
/**
 * @description compute the axiom given a set of parameters, and depending
 * on the parameters, use the axioms-u-d methods which parameterize lines
 * in u-d form, otherwise use the methods on vector-origin lines.
 * @param {number} the axiom number 1-7
 * @param {object} axiom parameters
 * @returns {line[]} array of lines
 */
const axiom_boundaryless = (number, params) => {
  return params.lines_ud.length === params.lines.length
    ? axiom_normal_distance(number, params)
    : axiom_vector_origin(number, params);
};

const filter_with_boundary = (number, params, solutions, boundary) => {
  if (boundary == null) { return; }
  validate_axiom(number, params, boundary)
    .forEach((valid, i) => { if (valid) { delete valid_solutions[i]; } });
};

const axiom = (number, params = {}, boundary) => {
  const parameters = check_params(params);
  const solutions = axiom_boundaryless(number, parameters);
  filter_with_boundary(number, parameters, solutions, boundary);
  return solutions;
};

Object.keys(AxiomsVO).forEach(key => { axiom[key] = AxiomsVO[key]; });
Object.keys(AxiomsUD).forEach(key => { axiom[key] = AxiomsUD[key]; });

[1, 2, 3, 4, 5, 6, 7].forEach(number => {
  axiom[number] = (...args) => axiom(number, ...args);
});

// probably move this to axioms/index
axiom.validate = validate_axiom;

export default axiom;
