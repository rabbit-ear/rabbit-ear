import math from "../math";
import { arrayify } from "./methods";
import * as AxiomsVO from "./axiomsVecOrigin";
import * as AxiomsND from "./axiomsNormDist";
import * as Validate from "./validate";

const paramsVecsToNorms = (params) => ({
	points: params.points,
	lines: params.lines.map(math.core.uniqueLineToRayLine),
});
/**
 * @description All axiom method arguments are ordered such that all lines are
 * listed first, followed by all points. convert the axiom params object
 * (with "points", "lines" keys) into a single flat array
 */
const spreadParams = (params) => {
	const lines = params.lines ? params.lines : [];
	const points = params.points ? params.points : [];
	return [...lines, ...points];
};
/**
 * @description Perform one of the seven origami axioms, and provide a boundary so that
 * only the results possible inside the boundary will be returned.
 * @param {number} number the axiom number, 1-7. **note, 0 is not an option**
 * @param {AxiomParams} params the origami axiom parameters, lines and points,
 * where the lines are only {RayLine} lines.
 * @param {number[][]} [boundary] the optional boundary,
 * including this will exclude results that lie outside.
 * @returns {RayLine[]} an array of solutions as lines, or an empty array if no solutions.
 * @linkcode Origami ./src/axioms/axiomsInBoundary.js 30
 */
export const axiomInBoundary = (number, params = {}, boundary = undefined) => {
	const solutions = arrayify(
		number,
		AxiomsVO[`axiom${number}`](...spreadParams(params)),
	).map(l => math.line(l));
	if (boundary) {
		arrayify(number, Validate[`validateAxiom${number}`](params, boundary, solutions))
			.forEach((valid, i) => (valid ? i : undefined))
			.filter(a => a !== undefined)
			.forEach(i => delete solutions[i]);
	}
	return solutions;
};
/**
 * @description Perform one of the seven origami axioms, and provide a boundary so that
 * only the results possible inside the boundary will be returned.
 * @param {number} number the axiom number, 1-7. **note, 0 is not an option**
 * @param {AxiomParams} params the origami axiom parameters, lines and points,
 * where the lines are only {UniqueLine} lines.
 * @param {number[][]} [boundary] the optional boundary,
 * including this will exclude results that lie outside.
 * @returns {UniqueLine[]} an array of solutions as lines, or an empty array if no solutions.
 * @linkcode Origami ./src/axioms/axiomsInBoundary.js 54
 */
export const normalAxiomInBoundary = (number, params = {}, boundary = undefined) => {
	const solutions = arrayify(
		number,
		AxiomsND[`normalAxiom${number}`](...spreadParams(params)),
	).map(l => math.line.fromNormalDistance(l));
	if (boundary) {
		arrayify(number, Validate[`validateAxiom${number}`](paramsVecsToNorms(params), boundary, solutions))
			.forEach((valid, i) => (valid ? i : undefined))
			.filter(a => a !== undefined)
			.forEach(i => delete solutions[i]);
	}
	return solutions;
};
