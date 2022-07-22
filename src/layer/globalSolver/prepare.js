import makeTacosTortillas from "../tacos/makeTacosTortillas";
import makeTransitivityTrios from "../tacos/makeTransitivityTrios";
import filterTransitivity from "../tacos/filterTransitivity";
import { makeFacesFacesOverlap } from "../../graph/overlap";
import { makeFacesWinding } from "../../graph/facesWinding";
import makeConstraints from "./makeConstraints";
import makeConstraintsInfo from "./makeConstraintsInfo";
import makeFacePairsOrder from "./makeFacePairsOrder";




// todo. better
const makeFacePairConstraintLookup = (facePairsOrder, constraintsInfo) => {
	const taco_types = Object.keys(constraintsInfo);
	const pairConstraintLooup = {};
	taco_types.forEach(taco_type => { pairConstraintLooup[taco_type] = {}; });
	taco_types.forEach(taco_type => Object.keys(facePairsOrder)
		.forEach(pair => { pairConstraintLooup[taco_type][pair] = []; }));
	taco_types
		.forEach(taco_type => constraintsInfo[taco_type]
			.forEach((el, i) => el.face_keys
				.forEach(pair => {
					pairConstraintLooup[taco_type][pair].push(i);
				})));
	return pairConstraintLooup;
};

const prepare = (graph, epsilon = 1e-6) => {
	// {boolean[][]} face-face matrix answering: do they overlap?
	const overlap = makeFacesFacesOverlap(graph, epsilon);
	// {boolean[]} for every face, true:counter-clockwise, false:flipped
	const facesWinding = makeFacesWinding(graph);
	// facePairsOrder encodes every pair of overlapping faces as a space-separated
	// string, low index first, as the keys of an object.
	// initialize all values to 0, but set neighbor faces to either 1 or 2.
	// {object} with keys like "3 15", "5 14"
	const facePairsOrder = makeFacePairsOrder(graph, overlap, facesWinding);
	// get all taco/tortilla/transitivity events.
	const tacos_tortillas = makeTacosTortillas(graph, epsilon);
	const unfiltered_trios = makeTransitivityTrios(graph, overlap, facesWinding, epsilon);
	const transitivity_trios = filterTransitivity(unfiltered_trios, tacos_tortillas);
	// format the tacos and transitivity data into maps that relate to the
	// lookup table at the heart of the algorithm, located at "table.js"
	const constraints = makeConstraints(tacos_tortillas, transitivity_trios);
	const facePairConstraints = makeFacePairConstraintLookup(
		facePairsOrder,
		makeConstraintsInfo(tacos_tortillas, transitivity_trios),
	);
	// console.log("overlap", overlap);
	// console.log("facesWinding", facesWinding);
	// console.log("tacos_tortillas", tacos_tortillas);
	// console.log("unfiltered_trios", unfiltered_trios);
	// console.log("transitivity_trios", transitivity_trios);
	// console.log("constraints", constraints);
	// console.log("facePairsOrder", facePairsOrder);
	// console.log("facePairConstraints", facePairConstraints);
	return {
		facePairsOrder,
		constraints,
		facePairConstraints,
		overlap,
	};
};

export default prepare;
