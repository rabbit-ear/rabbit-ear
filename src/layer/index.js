/**
 * Rabbit Ear (c) Kraft
 */
import * as constraints from "./constraints.js";
import * as facesSide from "./facesSide.js";
import * as general from "./general.js";
import * as prototype from "./prototype.js";
import * as solver from "./solver.js";
import * as table from "./table.js";
import * as tacosTortillas from "./tacosTortillas.js";
import * as transitivity from "./transitivity.js";
import {
	solveLayerOrders,
	solveFaceOrders,
} from "./layer.js";

export default {
	...constraints,
	...facesSide,
	...general,
	...prototype,
	...solver,
	...table,
	...tacosTortillas,
	...transitivity,
	solveLayerOrders,
	solveFaceOrders,
};
