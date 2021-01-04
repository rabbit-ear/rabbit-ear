/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";

/**
 * this converts a user input object { points: ___, lines: ___ }
 * into the propert arrangement of input parameters for the axiom methods
 */
const list_function_params = function (number, points, lines) {
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

const arrayify = (number, result) => {
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
	const points = params.points
		? params.points.map(p => math.core.get_vector(p))
		: undefined;
	const lines = params.lines	
    ? params.lines.map(l => math.core.get_line(l))
		: undefined;
	const result = math.core[`axiom${number}`](...list_function_params(number, points, lines));
	return arrayify(number, result);
};

const axioms = [null, 1, 2, 3, 4, 5, 6, 7];
delete axioms[0];

Object.keys(axioms).forEach(number => {
  axiom[number] = (...args) => axiom(number, ...args);
});

export default axiom;

