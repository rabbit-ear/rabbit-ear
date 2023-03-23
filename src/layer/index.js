/**
 * Rabbit Ear (c) Kraft
 */
// top level
import * as general from "./general.js";
import * as nudge from "./nudge.js";
import * as facesLayer from "./facesLayer.js";
// single-vertex layer solver
import singleVertexSolver from "./singleVertexSolver/index.js";
import singleVertexAssignmentSolver from "./singleVertexSolver/assignmentSolver.js";
// import validateLayerSolver from "./singleVertexSolver/validateLayerSolver.js";
// import validateTacoTacoFacePairs from "./singleVertexSolver/validateTacoTacoFacePairs.js";
// import validateTacoTortillaStrip from "./singleVertexSolver/validateTacoTortillaStrip.js";
import foldStripWithAssignments from "./singleVertexSolver/foldStripWithAssignments.js";
// global layer solver
// import solver from "./solver3d/index.js";
// import topologicalOrder from "./solver3d/topologicalOrder.js";
import topologicalOrder from "./topological.js";
// old global layer solver in 2D
// import solver from "./solver2d/index.js";
import solver from "./solver3d/index.js";

// import table from "./solver2d/table.js";
// import * as makeConstraints from "./solver2d/makeConstraints.js";
// import * as makeFacePairsOrder from "./solver2d/makeFacePairsOrder.js";
// import * as globalSolverGeneral from "./solver2d/general.js";
// import makeTacosTortillas from "./solver2d/tacos/makeTacosTortillas.js";
// import makeFoldedStripTacos from "./solver2d/tacos/makeFoldedStripTacos.js";
// import makeTransitivityTrios from "./solver2d/tacos/makeTransitivityTrios.js";
// import * as tortillaTortilla from "./solver2d/tacos/tortillaTortilla.js";

/**
 * @description A collection of methods for calculating the layer order
 * of the faces of an origami in its folded state.
 */
export default {
	solver,
	// solver2d,
	// table,
	topologicalOrder,
	// makeTacosTortillas,
	// makeFoldedStripTacos,
	// makeTransitivityTrios,

	singleVertexSolver,
	singleVertexAssignmentSolver,
	// validateLayerSolver,
	// validateTacoTacoFacePairs,
	// validateTacoTortillaStrip,
	foldStripWithAssignments,
	...general,
	...nudge,
	...facesLayer,
	// makeConstraints,
	// makeFacePairsOrder,
	// globalSolverGeneral,
	// tortillaTortilla,
};
