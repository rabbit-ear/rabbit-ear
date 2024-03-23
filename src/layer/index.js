/**
 * Rabbit Ear (c) Kraft
 */
import * as adjacentEdges from "./adjacentEdges.js";
import * as constraints from "./constraints.js";
import * as constraints3D from "./constraints3d.js";
import * as facesSide from "./facesSide.js";
import * as general from "./general.js";
import * as planarSets from "./planarSets.js";
import * as prototype from "./prototype.js";
import * as solve from "./solve.js";
import * as solver from "./solver.js";
import * as table from "./table.js";
import * as tacosTortillas from "./tacosTortillas.js";
import * as transitivity from "./transitivity.js";

export default {
	...adjacentEdges,
	...constraints,
	...constraints3D,
	...facesSide,
	...general,
	...planarSets,
	...prototype,
	...solve,
	...solver,
	...table,
	...tacosTortillas,
	...transitivity,
};
