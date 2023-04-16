/**
 * Rabbit Ear (c) Kraft
 */

// todo: this top level export (src/layer/index.js) should be a function
// ear.layer() where this is now the solver (instead of ear.layer.solver())

import solver from "./solver2d/index.js";
import * as general from "./general.js";
import * as general2d from "./solver2d/general.js";
import singleVertexSolver from "./singleVertexSolver/index.js";
import singleVertexAssignmentSolver from "./singleVertexSolver/assignmentSolver.js";
import foldStripWithAssignments from "./singleVertexSolver/foldStripWithAssignments.js";

// import validateLayerSolver from "./singleVertexSolver/validateLayerSolver.js";
// import validateTacoTacoFacePairs from "./singleVertexSolver/validateTacoTacoFacePairs.js";
// import validateTacoTortillaStrip from "./singleVertexSolver/validateTacoTortillaStrip.js";

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
Object.assign(solver, {
	...general,
	...general2d,
	// table,
	// makeTacosTortillas,
	// makeFoldedStripTacos,
	// makeTransitivityTrios,

	singleVertexSolver,
	singleVertexAssignmentSolver,
	foldStripWithAssignments,
	// validateLayerSolver,
	// validateTacoTacoFacePairs,
	// validateTacoTortillaStrip,
	// makeConstraints,
	// makeFacePairsOrder,
	// globalSolverGeneral,
	// tortillaTortilla,
});

export default solver;
