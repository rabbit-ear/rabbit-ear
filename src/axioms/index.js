/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import validateAxiom from "./validate";
import * as AxiomsVO from "./axioms";
import * as AxiomsUD from "./axioms_ud";
/**
 * @description the core axiom methods return arrays for *some* of
 * the axioms.
 * @param {number} the axiom number
 * @returns {boolean} true false, does the core method return an array?
 */
const axiomReturnsArray = (number) => {
	switch (number) {
		case 3: case "3":
		case 5: case "5":
		case 6: case "6": return true;
		default: return false;
	}
};

const checkParams = (params) => ({
	points: (params.points || []).map(p => math.core.getVector(p)),
	lines: (params.lines || []).map(l => math.core.getLine(l)),
	lines_ud: (params.lines || [])
		.map(l => l.u !== undefined && l.d !== undefined ? l : undefined)
		.filter(a => a !== undefined)
});
const axiomVectorOrigin = (number, params) => {
	const result = AxiomsVO[`axiom${number}`](...params.lines, ...params.points);
	const array_results = axiomReturnsArray(number)
		? result
		: [result].filter(a => a !== undefined);
	return array_results.map(line => math.line(line));
};
const axiomNormalDistance = (number, params) => {
	const result = AxiomsUD[`axiom${number}ud`](...params.lines_ud, ...params.points)
	const array_results = axiomReturnsArray(number)
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


 // here's the problem. the mismatch between what gets recalculated inside the boundary test and here.
const axiomBoundaryless = (number, params) => {
	return params.lines_ud.length === params.lines.length
		? axiomNormalDistance(number, params)
		: axiomVectorOrigin(number, params);
};

const filterWithBoundary = (number, params, solutions, boundary) => {
	if (boundary == null) { return; }
	validateAxiom(number, params, boundary, solutions)
		.forEach((valid, i) => { if (!valid) { delete solutions[i]; } });
};
/**
 * The point and line parameter object passed into the axioms function.
 * @typedef {object} AxiomParams
 * @property {Array} lines an array of all lines
 * @property {Array} points an array of all points
 */

/**
 * @description seven origami axioms
 * @param {number} number the axiom number, 1-7
 * @param {AxiomParams} params the origami axiom parameters, lines and points, in one object.
 * @param {number[][]} [boundary] the optional boundary, including this will exclude results that lie outside.
 * @returns {Line[]} an array of solutions as lines, or an empty array if no solutions.
 */
const axiom = (number, params = {}, boundary) => {
	const parameters = checkParams(params);
	const solutions = axiomBoundaryless(number, parameters);
	filterWithBoundary(number, parameters, solutions, boundary);
	return solutions;
};

Object.keys(AxiomsVO).forEach(key => { axiom[key] = AxiomsVO[key]; });
Object.keys(AxiomsUD).forEach(key => { axiom[key] = AxiomsUD[key]; });

[1, 2, 3, 4, 5, 6, 7].forEach(number => {
	axiom[number] = (...args) => axiom(number, ...args);
});

// probably move this to axioms/index
axiom.validate = validateAxiom;

export default axiom;
