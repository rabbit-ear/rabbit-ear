/**
 * Rabbit Ear (c) Kraft
 */
// top level
// import flipFacesLayer from "./flipFacesLayer";
import makeFacesLayer from "./makeFacesLayer";
import makeFacesLayers from "./makeFacesLayers";
import flipFacesLayer from "./flipFacesLayer";
// global layer solver
import table from "./globalSolver/table"
import * as globalSolvers from "./globalSolver/index"
import * as globalSolverGeneral from "./globalSolver/general"
import * as edgesAssignments from "./globalSolver/edgesAssignments"
import dividingAxis from "./globalSolver/dividingAxis"
import topologicalOrder from "./globalSolver/topologicalOrder";
import makeConditions from "./globalSolver/makeConditions";
import makeTacoMaps from "./globalSolver/makeTacoMaps";
import recursiveSolver from "./globalSolver/recursiveSolver";
import singleSolver from "./globalSolver/singleSolver";
import conditionsToMatrix from "./globalSolver/conditionsToMatrix";
// tacos
import makeTacosTortillas from "./tacos/makeTacosTortillas";
import makeFoldedStripTacos from "./tacos/makeFoldedStripTacos"
import makeTransitivityTrios from "./tacos/makeTransitivityTrios";
import * as tortillaTortilla from "./tacos/tortillaTortilla";
// single-vertex layer solver
import assignmentSolver from "./singleVertexSolver/assignmentSolver";
import singleVertexSolver from "./singleVertexSolver/index";
import validateLayerSolver from "./singleVertexSolver/validateLayerSolver";
import validateTacoTacoFacePairs from "./singleVertexSolver/validateTacoTacoFacePairs";
import validateTacoTortillaStrip from "./singleVertexSolver/validateTacoTortillaStrip";
// layers_face
// import make_layers_face from "./layers_face/make_layers_face";
// import makeLayersFaces from "./layers_face/makeLayersFaces";
// layer relationship matrix
// import get_layer_violations from "./matrix/get_layer_violations";
// import get_splice_indices from "./matrix/get_splice_indices";
// import make_edges_tacos_layers_faces from "./matrix/make_edges_tacos_layers_faces";
// import make_face_layer_matrix from "./matrix/make_face_layer_matrix";
// import matrixToLayersFace from "./matrix/matrixToLayersFace";
// import matrixToLayers from "./matrix/matrixToLayers";

// non-default level exports
import * as foldAssignments from "./singleVertexSolver/foldAssignments";
// import * as edges_crossing from "./matrix/edges_crossing";
// import * as relationships from "./matrix/relationships";
// import * as pleat_paths from "./matrix/pleat_paths";

/**
 * @description A collection of methods for calculating the layer order
 * of the faces of an origami in its folded state.
 */
export default Object.assign(Object.create(null), {
	makeFacesLayer,
	makeFacesLayers,
	flipFacesLayer,

	assignmentSolver,
	singleVertexSolver,
	validateLayerSolver,
	validateTacoTacoFacePairs,
	validateTacoTortillaStrip,

	table,
	makeConditions,
	makeTacoMaps,
	recursiveSolver,
	singleSolver,
	dividingAxis,
	topologicalOrder,
	conditionsToMatrix,

	makeTacosTortillas,
	makeFoldedStripTacos,
	makeTransitivityTrios,
},
	globalSolvers,
	globalSolverGeneral,
	edgesAssignments,
	tortillaTortilla,
	foldAssignments,
);
