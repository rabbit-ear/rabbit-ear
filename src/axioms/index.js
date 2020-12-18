/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";

const axioms = [null,
  math.core.axiom1,
  math.core.axiom2,
  math.core.axiom3,
  math.core.axiom4,
  math.core.axiom5,
  math.core.axiom6,
  math.core.axiom7
];

delete axioms[0];

/**
 * this converts a user input object { points: ___, lines: ___ }
 * into the propert arrangement of input parameters for the axiom methods
 */
const sort_axiom_params = function (number, points, lines) {
  switch (number) {
    case "1":
    case "2":
    case 1:
    case 2: return points;
    case "3":
    case 3: return [lines[0].vector, lines[0].origin, lines[1].vector, lines[1].origin];
    case "4":
    case 4: return [lines[0].vector, points[0]];
    case "5":
    case 5: return [lines[0].vector, lines[0].origin, points[0], points[1]];
    case "6":
    case 6: return [lines[0].vector, lines[0].origin, lines[1].vector, lines[1].origin, points[0], points[1]];
    case "7":
    case 7: return [lines[0].vector, lines[0].origin, lines[1].vector, points[0]];
    default: break;
  }
  return [];
};

const axiom = (number, params) => axioms[number](
  ...sort_axiom_params(
    number,
    params.points.map(p => math.core.get_vector(p)),
    params.lines.map(l => math.core.get_line(l))));

Object.keys(axioms).forEach(key => {
  axiom[key] = axioms[key];
})

export default axiom;
