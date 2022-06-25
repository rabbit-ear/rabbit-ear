/**
 * Rabbit Ear (c) Kraft
 */
import * as AxiomsVO from "./axiomsVecOrigin";
import * as AxiomsND from "./axiomsNormDist";
import * as BoundaryAxioms from "./axiomsInBoundary";
import * as Validate from "./validate";
/**
 * @description Perform one of the seven origami axioms. Supply an optional boundary
 * so that only the results possible inside the boundary will be returned.
 * @param {number} number the axiom number, 1-7. **note, 0 is not an option**
 * @param {AxiomParams} params the origami axiom parameters, lines and points,
 * where the lines are either {RayLine} or {UniqueLine}.
 * @param {number[][]} [boundary] the optional boundary, including this will exclude results that lie outside.
 * @returns {RayLine[]} an array of solutions as lines, or an empty array if no solutions.
 */
const axiom = (number, params = {}, boundary) => BoundaryAxioms
	.axiomInBoundary(number, params, boundary);

Object.keys(AxiomsVO).forEach(key => { axiom[key] = AxiomsVO[key]; });
Object.keys(AxiomsND).forEach(key => { axiom[key] = AxiomsND[key]; });
Object.keys(BoundaryAxioms).forEach(key => { axiom[key] = BoundaryAxioms[key]; });
Object.keys(Validate).forEach(key => { axiom[key] = Validate[key]; });

export default axiom;
