/**
 * Rabbit Ear (c) Kraft
 */
// top level
import flipFacesLayer from "./flipFacesLayer";
// single-vertex layer solver
import singleVertexSolver from "./singleVertexSolver/index";
import singleVertexAssignmentSolver from "./singleVertexSolver/assignmentSolver";
import validateLayerSolver from "./singleVertexSolver/validateLayerSolver";
import validateTacoTacoFacePairs from "./singleVertexSolver/validateTacoTacoFacePairs";
import validateTacoTortillaStrip from "./singleVertexSolver/validateTacoTortillaStrip";
import * as foldAssignments from "./singleVertexSolver/foldAssignments";
// global layer solver
import solver from "./globalSolver/index";
import table from "./globalSolver/table";
import topologicalOrder from "./globalSolver/topologicalOrder";
import * as makeConstraints from "./globalSolver/makeConstraints";
import * as makeFacePairsOrder from "./globalSolver/makeFacePairsOrder";
import * as globalSolverGeneral from "./globalSolver/general";
import makeTacosTortillas from "./tacos/makeTacosTortillas";
import makeFoldedStripTacos from "./tacos/makeFoldedStripTacos";
import makeTransitivityTrios from "./tacos/makeTransitivityTrios";
import * as tortillaTortilla from "./tacos/tortillaTortilla";
/**
 * @description A collection of methods for calculating the layer order
 * of the faces of an origami in its folded state.
 */
export default Object.assign(
	Object.create(null),
	{
		flipFacesLayer,

		singleVertexSolver,
		singleVertexAssignmentSolver,
		validateLayerSolver,
		validateTacoTacoFacePairs,
		validateTacoTortillaStrip,

		solver,
		table,
		topologicalOrder,
		makeTacosTortillas,
		makeFoldedStripTacos,
		makeTransitivityTrios,
	},
	makeConstraints,
	makeFacePairsOrder,
	globalSolverGeneral,
	tortillaTortilla,
	foldAssignments,
);
