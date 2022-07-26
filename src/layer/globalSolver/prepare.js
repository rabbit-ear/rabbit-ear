import makeTacosTortillas from "../tacos/makeTacosTortillas";
import makeTransitivityTrios from "../tacos/makeTransitivityTrios";
import filterTransitivity from "../tacos/filterTransitivity";
import { makeFacesFacesOverlap } from "../../graph/overlap";
import { makeFacesWinding } from "../../graph/facesWinding";
import makeConstraints from "./makeConstraints";
import {
	makeFacePairs,
	solveEdgeAdjacentFacePairs,
} from "./makeFacePairsOrder";
import {
	constraintToFacePairs,
	pairArrayToSortedPairString,
} from "./general";
/**
 * @description Given a list of constraints for each taco/tortilla/transitivity,
 * convert each constraint from an array of faces into an array of face-pair
 * strings, where the smallest index is listed first.
 */
const constraintsToFacePairs = (constraints) => {
	// convert all conditions to all facePair combinations
	const conditionFacePairs = {};
	Object.keys(constraints).forEach(type => {
		conditionFacePairs[type] = constraints[type]
			.map(constraint => constraintToFacePairs[type](constraint))
			.map(arrays => arrays.map(pairArrayToSortedPairString));
	});
	return conditionFacePairs;
};
/**
 * @description Given a list of constraints for each taco/tortilla/transitivity,
 * create a reverse-lookup map, where the keys are the face-pairs, and the value
 * is an array of indices from the "constraints" parameter in which this
 * face-pair appears.
 */
const makeFacePairConstraintLookup = (constraints) => {
	// convert all conditions to all facePair combinations
	const constraintFacePairs = constraintsToFacePairs(constraints);
	const lookup = {};
	Object.keys(constraintFacePairs)
		.forEach(type => { lookup[type] = {}; });
	// for every key, (for every taco type), initialize an empty array
	Object.keys(constraintFacePairs)
		.forEach(type => constraintFacePairs[type]
			.forEach(keys => keys
				.forEach(key => { lookup[type][key] = []; })));
	// for every key, (for every taco type), push the index to the array
	Object.keys(constraintFacePairs)
		.forEach(type => constraintFacePairs[type]
			.forEach((keys, i) => keys
				.forEach(key => lookup[type][key].push(i))));
	return lookup;
};

const prepare = (graph, epsilon = 1e-6) => {
	// {boolean[][]} face-face matrix answering: do they overlap?
	const overlap = makeFacesFacesOverlap(graph, epsilon);
	// {boolean[]} for every face, true:counter-clockwise, false:flipped
	const facesWinding = makeFacesWinding(graph);
	// get all taco/tortilla/transitivity events.
	const tacos_tortillas = makeTacosTortillas(graph, epsilon);
	const unfiltered_trios = makeTransitivityTrios(graph, overlap, facesWinding, epsilon);
	const transitivity_trios = filterTransitivity(unfiltered_trios, tacos_tortillas);
	// format the tacos and transitivity data into maps that relate to the
	// lookup table at the heart of the algorithm, located at "table.js"
	const constraints = makeConstraints(tacos_tortillas, transitivity_trios);
	const facePairConstraints = makeFacePairConstraintLookup(constraints);
	// these are all the variables we need to solve- all overlapping faces in
	// pairwise combinations, as a space-separated string, smallest index first
	const facePairsArray = makeFacePairs(graph, overlap);
	const facePairsOrder = {};
	facePairsArray.forEach(facePair => { facePairsOrder[facePair] = 0; });
	const edgeAdjacentOrders = solveEdgeAdjacentFacePairs(graph, facePairsArray, facesWinding);
	// console.log("overlap", overlap);
	// console.log("facesWinding", facesWinding);
	// console.log("tacos_tortillas", tacos_tortillas);
	// console.log("unfiltered_trios", unfiltered_trios);
	// console.log("transitivity_trios", transitivity_trios);
	// console.log("constraints", constraints);
	// console.log("facePairsOrder", facePairsOrder);
	// console.log("facePairConstraints", facePairConstraints);
	return {
		constraints,
		facePairConstraints,
		facePairsArray,
		facePairsOrder,
		edgeAdjacentOrders,
	};
};

export default prepare;
