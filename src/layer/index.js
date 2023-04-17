/**
 * Rabbit Ear (c) Kraft
 */
import { layer } from "./solver2d/index.js";
import makeTacosTortillas from "./solver2d/tacos/makeTacosTortillas.js";
import setup from "./solver2d/setup.js";
import table from "./solver2d/table.js";
import * as general from "./general.js";
import * as general2d from "./solver2d/general.js";
import * as transitivity from "./solver2d/tacos/transitivity.js";
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
	makeTacosTortillas,
	setup,
	table,
	...general,
	...general2d,
	...transitivity,
	// single-vertex solver
	singleVertexSolver,
	singleVertexAssignmentSolver,
	foldStripWithAssignments,
	// validateLayerSolver,
	// validateTacoTacoFacePairs,
	// validateTacoTortillaStrip,
});

export default layer;
