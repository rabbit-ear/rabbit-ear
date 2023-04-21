/**
 * Rabbit Ear (c) Kraft
 */
import { layer } from "./solver2d/index.js";
import table from "./solver2d/table.js";
import * as setup from "./solver2d/setup.js";
import * as general2d from "./solver2d/general.js";

import { layer3d } from "./solver3d/index.js";
import * as setup3d from "./solver3d/setup.js";
import * as general3d from "./solver3d/general.js";

import * as general from "./general.js";
// single-vertex solver
import singleVertexSolver from "./singleVertexSolver/index.js";
import singleVertexAssignmentSolver from "./singleVertexSolver/assignmentSolver.js";
import foldStripWithAssignments from "./singleVertexSolver/foldStripWithAssignments.js";
// import validateLayerSolver from "./singleVertexSolver/validateLayerSolver.js";
// import validateTacoTacoFacePairs from "./singleVertexSolver/validateTacoTacoFacePairs.js";
// import validateTacoTortillaStrip from "./singleVertexSolver/validateTacoTortillaStrip.js";
/**
 * @description A collection of methods for calculating the layer order
 * of the faces of an origami in its folded state.
 */
Object.assign(layer, {
	table,
	...general,
	...general2d,
	...setup,
	layer3d,
	...setup3d,
	...general3d,
	// single-vertex solver
	singleVertexSolver,
	singleVertexAssignmentSolver,
	foldStripWithAssignments,
	// validateLayerSolver,
	// validateTacoTacoFacePairs,
	// validateTacoTortillaStrip,
});

export default layer;
