import math from "../math";
import * as AxiomsVO from "./axiomsVecOrigin";
import * as AxiomsND from "./axiomsNormDist";
import * as Validate from "./validate";

const paramsVecsToNorms = (params) => ({
	points: params.points,
	lines: params.lines.map(math.core.makeVectorOriginLine),
});
/**
 * @description The core axiom methods return arrays for *some* of the axioms.
 * Standardize the output so that all of them are inside arrays.
 * @param {number} the axiom number
 * @param {Line|Line[]} the solutions from having run the axiom method
 * @returns {Line[]} the solution lines, now consistently inside an array.
 */
const arrayify = (axiomNumber, solutions) => {
	switch (axiomNumber) {
		case 3: case "3":
		case 5: case "5":
		case 6: case "6": return solutions;
		default: return [solutions];
	}
};
/**
 * @description Perform one of the seven origami axioms, and provide a boundary so that
 * only the results possible inside the boundary will be returned.
 * @param {number} number the axiom number, 1-7. **note, 0 is not an option**
 * @param {AxiomParams} params the origami axiom parameters, lines and points,
 * where the lines are only {RayLine} lines.
 * @param {number[][]} [boundary] the optional boundary, including this will exclude results that lie outside.
 * @returns {RayLine[]} an array of solutions as lines, or an empty array if no solutions.
 */
export const axiomInBoundary = (number, params = {}, boundary) => {
	const solutions = arrayify(number,
		AxiomsVO[`axiom${number}`](...params.lines, ...params.points));
		// .filter(a => a !== undefined);
		// .map(line => math.line(line));
	if (boundary) {
		arrayify(number, Validate[`validateAxiom${number}`](params, boundary, solutions))
			.forEach((valid, i) => valid ? i : undefined)
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
 * @param {number[][]} [boundary] the optional boundary, including this will exclude results that lie outside.
 * @returns {UniqueLine[]} an array of solutions as lines, or an empty array if no solutions.
 */
export const normalAxiomInBoundary = (number, params = {}, boundary) => {
	const solutions = arrayify(number,
		AxiomsND[`normalAxiom${number}`](...params.lines, ...params.points));
	if (boundary) {
		arrayify(number, Validate[`validateAxiom${number}`](paramsVecsToNorms(params), boundary, solutions))
			.forEach((valid, i) => valid ? i : undefined)
			.filter(a => a !== undefined)
			.forEach(i => delete solutions[i]);
	}
	return solutions;
};
