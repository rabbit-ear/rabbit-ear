/**
 * Rabbit Ear (c) Kraft
 */

import * as AxiomsVecLine from "./axiomsVecLine.js";
import * as AxiomsUniqueLine from "./axiomsUniqueLine.js";
import * as AxiomsBoundary from "./axiomsBoundary.js";
import * as ValidateAxioms from "./validate.js";

export default {
	...AxiomsVecLine,
	...AxiomsUniqueLine,
	...AxiomsBoundary,
	...ValidateAxioms,
};
