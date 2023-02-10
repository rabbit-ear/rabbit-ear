/**
 * Rabbit Ear (c) Kraft
 */
import * as AxiomsVO from "./axiomsVecOrigin.js";
import * as AxiomsND from "./axiomsNormDist.js";
import * as BoundaryAxioms from "./axiomsInBoundary.js";
import {
	validateAxiom1,
	validateAxiom2,
	validateAxiom3,
	validateAxiom4,
	validateAxiom5,
	validateAxiom6,
	validateAxiom7,
	validateAxiom,
} from "./validate.js";
/**
 * @description Perform one of the seven origami axioms. Supply an optional boundary
 * so that only the results possible inside the boundary will be returned.
 * @param {number} number the axiom number, 1-7. **note, 0 is not an option**
 * @param {AxiomParams} params the origami axiom parameters, lines and points,
 * where the lines are either {RayLine} or {UniqueLine}.
 * @param {number[][]} [boundary] the optional boundary,
 * including this will exclude results that lie outside.
 * @returns {RayLine[]} an array of solutions as lines, or an empty array if no solutions.
 * @linkcode Origami ./src/axioms/index.js 26
 */
const axiom = (number, params = {}, boundary = undefined) => BoundaryAxioms
	.axiomInBoundary(number, params, boundary);

Object.keys(AxiomsVO).forEach(key => { axiom[key] = AxiomsVO[key]; });
Object.keys(AxiomsND).forEach(key => { axiom[key] = AxiomsND[key]; });
Object.keys(BoundaryAxioms).forEach(key => { axiom[key] = BoundaryAxioms[key]; });

axiom.validateAxiom1 = validateAxiom1;
axiom.validateAxiom2 = validateAxiom2;
axiom.validateAxiom3 = validateAxiom3;
axiom.validateAxiom4 = validateAxiom4;
axiom.validateAxiom5 = validateAxiom5;
axiom.validateAxiom6 = validateAxiom6;
axiom.validateAxiom7 = validateAxiom7;
axiom.validate = validateAxiom; // different name

export default axiom;
