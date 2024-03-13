/**
 * Rabbit Ear (c) Kraft
 */
import * as constraints from "./constraints.js";
import * as facesSide from "./facesSide.js";
import * as general from "./general.js";
import * as propagate from "./propagate.js";
import * as solver from "./solver.js";
import * as table from "./table.js";
import * as tacosTortillas from "./tacosTortillas.js";
import * as transitivity from "./transitivity.js";

export default {
	...constraints,
	...facesSide,
	...general,
	...propagate,
	...solver,
	...table,
	...tacosTortillas,
	...transitivity,
};
