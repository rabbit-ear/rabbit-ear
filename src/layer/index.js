/**
 * Rabbit Ear (c) Kraft
 */
// top level
import * as general from "./general";
// single-vertex layer solver
import singleVertexSolver from "./singleVertexSolver/index";
import singleVertexAssignmentSolver from "./singleVertexSolver/assignmentSolver";
import validateLayerSolver from "./singleVertexSolver/validateLayerSolver";
import validateTacoTacoFacePairs from "./singleVertexSolver/validateTacoTacoFacePairs";
import validateTacoTortillaStrip from "./singleVertexSolver/validateTacoTortillaStrip";
import foldStripWithAssignments from "./singleVertexSolver/foldStripWithAssignments";
// global layer solver
import solver from "./solver3d/index";
import topologicalOrder from "./solver3d/topologicalOrder";
// old global layer solver in 2D
import solver2d from "./solver2d/index";
// import table from "./solver2d/table";
// import * as makeConstraints from "./solver2d/makeConstraints";
// import * as makeFacePairsOrder from "./solver2d/makeFacePairsOrder";
// import * as globalSolverGeneral from "./solver2d/general";
// import makeTacosTortillas from "./solver2d/tacos/makeTacosTortillas";
// import makeFoldedStripTacos from "./solver2d/tacos/makeFoldedStripTacos";
// import makeTransitivityTrios from "./solver2d/tacos/makeTransitivityTrios";
// import * as tortillaTortilla from "./solver2d/tacos/tortillaTortilla";

/**
 * @description A collection of methods for calculating the layer order
 * of the faces of an origami in its folded state.
 */
export default Object.assign(
	Object.create(null),
	{
		solver,
		solver2d,
		// table,
		topologicalOrder,
		// makeTacosTortillas,
		// makeFoldedStripTacos,
		// makeTransitivityTrios,

		singleVertexSolver,
		singleVertexAssignmentSolver,
		validateLayerSolver,
		validateTacoTacoFacePairs,
		validateTacoTortillaStrip,
		foldStripWithAssignments,
	},
	general,
	// makeConstraints,
	// makeFacePairsOrder,
	// globalSolverGeneral,
	// tortillaTortilla,
);
