/**
 * Rabbit Ear (c) Kraft
 */
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
export default {
	// single-vertex solver
	singleVertexSolver,
	singleVertexAssignmentSolver,
	foldStripWithAssignments,
	// validateLayerSolver,
	// validateTacoTacoFacePairs,
	// validateTacoTortillaStrip,
};
