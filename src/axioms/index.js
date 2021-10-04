/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import test_axiom from "./test_axiom";
/**
 * this method reformats all axiom results so that
 * the lines are included inside an Array.
 */
const axiom_arrayify = (number, result) => {
  switch (number) {
    case "1": case 1:
    case "2": case 2:
    case "4": case 4:
    case "7": case 7: return [result].filter(a => a !== undefined);
    case "3": case 3:
    case "5": case 5:
    case "6": case 6: return result;
    default: break;
  }
};

// todo: implement boundary in here
const axiom = (number, params = {}, boundary) => {
  const points = (params.points || []).map(p => math.core.get_vector(p));
  const lines = (params.lines || []).map(l => math.core.get_line(l));
  const lines_ud = (params.lines || [])
    .map(l => l.u !== undefined && l.d !== undefined ? l : undefined)
    .filter(a => a !== undefined);
  const ud = lines_ud.length >= lines.length;
  const result = ud
    ? math.core[`axiom${number}ud`](...lines_ud, ...points)
    : math.core[`axiom${number}`](...lines, ...points);
  return axiom_arrayify(number, result)
    .map(l => ud ? math.line.ud(l) : math.line(l));
};

const axioms = [null, 1, 2, 3, 4, 5, 6, 7];
delete axioms[0];

Object.keys(axioms).forEach(number => {
  axiom[number] = (...args) => axiom(number, ...args);
});

// probably move this to axioms/index
axiom.test = test_axiom;

export default axiom;
