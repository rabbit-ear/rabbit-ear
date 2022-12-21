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
import solver from "./globalSolver/index";
import table from "./globalSolver/table";
import topologicalOrder from "./globalSolver/topologicalOrder";
// import * as makeConstraints from "./globalSolver/makeConstraints";
import * as makeFacePairsOrder from "./globalSolver/makeFacePairsOrder";
// import * as globalSolverGeneral from "./globalSolver/general";
import makeTacosTortillas from "./tacos/makeTacosTortillas";
import makeFoldedStripTacos from "./tacos/makeFoldedStripTacos";
import makeTransitivityTrios from "./tacos/makeTransitivityTrios";
// import * as tortillaTortilla from "./tacos/tortillaTortilla";

import solver3d from "./solver3d/index";
import prepare from "./solver3d/prepare";

/**
 * @description A collection of methods for calculating the layer order
 * of the faces of an origami in its folded state.
 */
export default Object.assign(
	Object.create(null),
	{
		solver,
		table,
		topologicalOrder,
		makeTacosTortillas,
		makeFoldedStripTacos,
		makeTransitivityTrios,

		singleVertexSolver,
		singleVertexAssignmentSolver,
		validateLayerSolver,
		validateTacoTacoFacePairs,
		validateTacoTortillaStrip,
		foldStripWithAssignments,
	},
	general,
	// makeConstraints,
	makeFacePairsOrder,
	// globalSolverGeneral,
	// tortillaTortilla,
	{
		solver3d,
		prepare,
	},
);
