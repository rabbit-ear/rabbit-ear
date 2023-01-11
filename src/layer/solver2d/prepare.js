/**
 * Rabbit Ear (c) Kraft
 */
import makeTacosTortillas from "./tacos/makeTacosTortillas";
import makeTransitivityTrios from "./tacos/makeTransitivityTrios";
import filterTransitivity from "./tacos/filterTransitivity";
import { getFacesFaces2DOverlap } from "../../graph/overlap";
import { makeFacesWinding } from "../../graph/facesWinding";
import {
	makeConstraints,
	makeConstraintsLookup,
} from "./makeConstraints";
import {
	makeFacePairs,
	solveEdgeAdjacentFacePairs,
} from "./makeFacePairsOrder";

const prepare = (graph, epsilon = 1e-6) => {
	// let lastTime = new Date();
	// 200ms: {boolean[][]} face-face matrix answering: do they overlap?
	const overlap = getFacesFaces2DOverlap(graph, epsilon);
	// console.log(Date.now() - lastTime, "overlap"); lastTime = new Date();
	// 0ms: {boolean[]} for every face, true:counter-clockwise, false:flipped
	const facesWinding = makeFacesWinding(graph);
	// 950ms: get all taco/tortilla events
	const tacos_tortillas = makeTacosTortillas(graph, epsilon);
	// console.log(Date.now() - lastTime, "tacos"); lastTime = new Date();
	// 2,200ms: get all transitivity events
	const unfiltered_trios = makeTransitivityTrios(graph, overlap, facesWinding, epsilon);
	// console.log(Date.now() - lastTime, "transitivity"); lastTime = new Date();
	// 500ms:
	const transitivity_trios = filterTransitivity(unfiltered_trios, tacos_tortillas);
	// console.log(Date.now() - lastTime, "filter transitivity"); lastTime = new Date();
	// format the tacos and transitivity data into maps that relate to the
	// lookup table at the heart of the algorithm, located at "table.js"
	// 50ms:
	const constraints = makeConstraints(tacos_tortillas, transitivity_trios);
	// 700ms:
	const constraintsLookup = makeConstraintsLookup(constraints);
	// console.log(Date.now() - lastTime, "constraintsLookup"); lastTime = new Date();
	// these are all the variables we need to solve- all overlapping faces in
	// pairwise combinations, as a space-separated string, smallest index first
	// 5ms:
	const facePairs = makeFacePairs(graph, overlap);
	// 15ms:
	const edgeAdjacentOrders = solveEdgeAdjacentFacePairs(graph, facePairs, facesWinding);
	// console.log("overlap", overlap);
	// console.log("graph", graph);
	// console.log("facesWinding", facesWinding);
	// console.log("tacos_tortillas", tacos_tortillas);
	// console.log("unfiltered_trios", unfiltered_trios);
	// console.log("transitivity_trios", transitivity_trios);
	// console.log("facePairs", facePairs);
	// console.log("constraints", constraints);
	// console.log("constraintsLookup", constraintsLookup);
	// console.log("edgeAdjacentOrders", edgeAdjacentOrders);
	// console.log(`transitivity: ${unfiltered_trios.length} down to ${transitivity_trios.length} (${unfiltered_trios.length - transitivity_trios.length} removed from tacos/tortillas)`);
	// console.log(`${constraints.taco_taco.length} taco-taco, ${constraints.taco_tortilla.length} taco-tortilla, ${constraints.tortilla_tortilla.length} tortilla-tortilla, ${constraints.transitivity.length} transitivity`);
	return {
		constraints,
		constraintsLookup,
		facePairs,
		edgeAdjacentOrders,
	};
};

export default prepare;
