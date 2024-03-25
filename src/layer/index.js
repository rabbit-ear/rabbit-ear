/**
 * Rabbit Ear (c) Kraft
 */
import * as constraints from "./constraints.js";
import * as constraints3D from "./constraints3d.js";
import * as facesSide from "./facesSide.js";
import * as general from "./general.js";
import * as initialSolution from "./initialSolution.js";
import * as intersect3D from "./intersect3d.js";
import * as prototype from "./prototype.js";
import * as solve from "./solve.js";
import * as solver from "./solver.js";
import * as table from "./table.js";
import * as tacosTortillas from "./tacosTortillas.js";
import * as transitivity from "./transitivity.js";
import { layer3D } from "./layer.js";

export default {
	...constraints,
	...constraints3D,
	...facesSide,
	...general,
	...initialSolution,
	...intersect3D,
	...prototype,
	...solve,
	...solver,
	...table,
	...tacosTortillas,
	...transitivity,
	layer3D,
};
