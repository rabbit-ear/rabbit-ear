/**
 * Rabbit Ear (c) Kraft
 */

import * as constraints from "./constraints.js";
import * as solver from "./solver.js";
import * as edgeAdjacent from "./edgeAdjacent.js";
import * as facesSide from "./facesSide.js";
import * as tacosAndTortillas from "./tacosAndTortillas.js";

export default {
	...constraints,
	...edgeAdjacent,
	...facesSide,
	...solver,
	...tacosAndTortillas,
};
