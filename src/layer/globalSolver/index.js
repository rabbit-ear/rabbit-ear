/**
 * Rabbit Ear (c) Kraft
 */
import makeTacosTortillas from "../tacos/makeTacosTortillas";
import makeTransitivityTrios from "../tacos/makeTransitivityTrios";
import filterTransitivity from "../tacos/filterTransitivity";
import { makeFacesFacesOverlap } from "../../graph/overlap";
import { makeFacesWinding } from "../../graph/facesWinding";
import { unsignedToSignedConditions } from "./general";

import makeTacoMaps from "./makeTacoMaps";
import makeConditions from "./makeConditions";
import singleSolver from "./singleSolver";
import recursiveSolver from "./recursiveSolver";
// import dividingAxis from "./dividingAxis";

const makeMapsAndConditions = (graph, epsilon = 1e-6) => {
	const overlap_matrix = makeFacesFacesOverlap(graph, epsilon);
	const facesWinding = makeFacesWinding(graph);
	// conditions encodes every pair of overlapping faces as a space-separated
	// string, low index first, as the keys of an object.
	// initialize all values to 0, but set neighbor faces to either 1 or 2.
	const conditions = makeConditions(graph, overlap_matrix, facesWinding);
	// get all taco/tortilla/transitivity events.
	const tacos_tortillas = makeTacosTortillas(graph, epsilon);
	const unfiltered_trios = makeTransitivityTrios(graph, overlap_matrix, facesWinding, epsilon);
	const transitivity_trios = filterTransitivity(unfiltered_trios, tacos_tortillas);
	// format the tacos and transitivity data into maps that relate to the
	// lookup table at the heart of the algorithm, located at "table.js"
	const maps = makeTacoMaps(tacos_tortillas, transitivity_trios);
	// console.log("overlap_matrix", overlap_matrix);
	// console.log("facesWinding", facesWinding);
	// console.log("tacos_tortillas", tacos_tortillas);
	// console.log("unfiltered_trios", unfiltered_trios);
	// console.log("transitivity_trios", transitivity_trios);
	// console.log("maps", maps);
	// console.log("conditions", conditions);
	// return { maps, conditions };
	return { maps, conditions, overlap: overlap_matrix };
};
/**
 * @description iteratively calculate only one solution to layer order, ignoring any other solutions
 * @param {object} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a set of solutions where keys are face pairs
 * and values are +1 or -1, the relationship of the two faces.
 */
export const oneLayerConditions = (graph, epsilon = 1e-6) => {
	const data = makeMapsAndConditions(graph, epsilon);
	const solution = singleSolver(graph, data.maps, data.conditions);
	return solution;
};
/**
 * @description recursively calculate all solutions to layer order
 * @param {object} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a set of solutions where keys are face pairs
 * and values are +1 or -1, the relationship of the two faces.
 */
export const allLayerConditions = (graph, epsilon = 1e-6) => {
	const data = makeMapsAndConditions(graph, epsilon);
	const solutions = recursiveSolver(graph, data.maps, data.conditions, data.overlap);
	// solutions.certain = unsignedToSignedConditions(JSON.parse(JSON.stringify(data.conditions)));
	return solutions;
};

// const makeMapsAndConditionsDividingAxis = (folded, cp, line, epsilon = 1e-6) => {
// 	const overlap_matrix = makeFacesFacesOverlap(folded, epsilon);
// 	const faces_winding = makeFacesWinding(folded);
// 	const conditions = makeConditions(folded, overlap_matrix, faces_winding);
// 	dividingAxis(cp, line, conditions);
// 	// get all taco/tortilla/transitivity events.
// 	const tacos_tortillas = makeTacosTortillas(folded, epsilon);
// 	const unfiltered_trios = makeTransitivityTrios(folded, overlap_matrix, faces_winding, epsilon);
// 	const transitivity_trios = filterTransitivity(unfiltered_trios, tacos_tortillas);
// 	// format the tacos and transitivity data into maps that relate to the
// 	// lookup table at the heart of the algorithm, located at "table.js"
// 	const maps = makeTacoMaps(tacos_tortillas, transitivity_trios);
// 	return { maps, conditions };
// };
/**
 * @description Iteratively calculate only one solution to layer order,
 * ignoring any other solutions, enforcing a symmetry line where
 * two sets of faces never cross above/below each other.
 * @param {object} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a set of solutions where keys are face pairs
 * and values are +1 or -1, the relationship of the two faces.
 */
// export const oneLayerConditionsWithAxis = (folded, cp, line, epsilon = 1e-6) => {
// 	const data = makeMapsAndConditionsDividingAxis(folded, cp, line, epsilon);
// 	const solution = singleSolver(folded, data.maps, data.conditions);
// 	return solution;
// };
/**
 * @description Recursively calculate all solutions to layer order,
 * enforcing a symmetry line where two sets of faces never cross above/below each other.
 * @param {object} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a set of solutions where keys are face pairs
 * and values are +1 or -1, the relationship of the two faces.
 */
// export const allLayerConditionsWithAxis = (folded, cp, line, epsilon = 1e-6) => {
// 	const data = makeMapsAndConditionsDividingAxis(folded, cp, line, epsilon);
// 	const solutions = recursiveSolver(folded, data.maps, data.conditions);
// 	solutions.certain = unsignedToSignedConditions(JSON.parse(JSON.stringify(data.conditions)));
// 	return solutions;
// };
