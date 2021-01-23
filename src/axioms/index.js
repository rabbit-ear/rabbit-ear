/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";

/**
 * this converts a user input object { points: ___, lines: ___ }
 * into the propert arrangement of input parameters for the axiom methods
 */
const axiom_param_map = [null,
  a => a,
  a => a,
  (_, l) => [l[0].vector, l[0].origin, l[1].vector, l[1].origin],
  (p, l) => [l[0].vector, p[0]],
  (p, l) => [l[0].vector, l[0].origin, p[0], p[1]],
  (p, l) => [l[0].vector, l[0].origin, l[1].vector, l[1].origin, p[0], p[1]],
  (p, l) => [l[0].vector, l[0].origin, l[1].vector, p[0]],
];

const axiom_paramify = (number, points, lines) => axiom_param_map[number]
  ? axiom_param_map[number](points, lines)
  : [];

const axiom_arrayify = (number, result) => {
  switch (number) {
    case "1": case 1:
    case "2": case 2:
    case "4": case 4:
    case "7": case 7: return [result];
    case "3": case 3:
    case "5": case 5:
    case "6": case 6: return result;
    default: break;
  }
};

const axiom = (number, params = {}) => {
  const points = (params.points || []).map(p => math.core.get_vector(p))
  const lines = (params.lines || []).map(l => math.core.get_line(l))
  const result = math.core[`axiom${number}`](...axiom_paramify(number, points, lines));
  return axiom_arrayify(number, result);
};

const axioms = [null, 1, 2, 3, 4, 5, 6, 7];
delete axioms[0];

Object.keys(axioms).forEach(number => {
  axiom[number] = (...args) => axiom(number, ...args);
});

export default axiom;

