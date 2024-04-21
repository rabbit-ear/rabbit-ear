/**
 * Rabbit Ear (c) Kraft
 */
import * as constraints3D from "./constraints3D.js";
import * as constraints3DFaces from "./constraints3DFaces.js";
import * as constraints3DEdges from "./constraints3DEdges.js";
import * as constraintsFlat from "./constraintsFlat.js";
import * as facesSide from "./facesSide.js";
import * as general from "./general.js";
import * as initialSolutionsFlat from "./initialSolutionsFlat.js";
import * as prototype from "./prototype.js";
import * as solve from "./solve.js";
import * as solver from "./solver.js";
import * as table from "./table.js";
import * as tacosTortillas from "./tacosTortillas.js";
import * as transitivity from "./transitivity.js";
import { layer, layer3D } from "./layer.js";

const layerMethods = {
	...constraints3D,
	...constraints3DFaces,
	...constraints3DEdges,
	...constraintsFlat,
	...facesSide,
	...general,
	...initialSolutionsFlat,
	...prototype,
	...solve,
	...solver,
	...table,
	...tacosTortillas,
	...transitivity,
	layer3D,
};

const layerExport = Object.assign(layer, layerMethods);

export default layerExport;
