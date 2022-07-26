/**
 * Rabbit Ear (c) Kraft
 */
// top level
import makeFacesLayers from "./makeFacesLayers";
import flipFacesLayer from "./flipFacesLayer";
// single-vertex layer solver
import singleVertexSolver from "./singleVertexSolver/index";
import singleVertexAssignmentSolver from "./singleVertexSolver/assignmentSolver";
import validateLayerSolver from "./singleVertexSolver/validateLayerSolver";
import validateTacoTacoFacePairs from "./singleVertexSolver/validateTacoTacoFacePairs";
import validateTacoTortillaStrip from "./singleVertexSolver/validateTacoTortillaStrip";
import * as foldAssignments from "./singleVertexSolver/foldAssignments";
// global layer solver
import globalLayerSolver from "./globalSolver/index";
import table from "./globalSolver/table";
import topologicalOrder from "./globalSolver/topologicalOrder";
import * as makeFacePairsOrder from "./globalSolver/makeFacePairsOrder";
import makeConstraintsInfo from "./globalSolver/makeConstraintsInfo";
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
		makeFacesLayers,
		flipFacesLayer,

		singleVertexSolver,
		singleVertexAssignmentSolver,
		validateLayerSolver,
		validateTacoTacoFacePairs,
		validateTacoTortillaStrip,

		globalLayerSolver,
		table,
		makeConstraintsInfo,
		topologicalOrder,
		makeTacosTortillas,
		makeFoldedStripTacos,
		makeTransitivityTrios,
	},
	makeFacePairsOrder,
	globalSolverGeneral,
	tortillaTortilla,
	foldAssignments,
);
