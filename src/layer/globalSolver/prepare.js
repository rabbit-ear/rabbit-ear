import makeTacosTortillas from "../tacos/makeTacosTortillas";
import makeTransitivityTrios from "../tacos/makeTransitivityTrios";
import filterTransitivity from "../tacos/filterTransitivity";
import { makeFacesFacesOverlap } from "../../graph/overlap";
import { makeFacesWinding } from "../../graph/facesWinding";
import makeTacoMaps from "./makeTacoMaps";
import makeConditions from "./makeConditions";

const prepare = (graph, epsilon = 1e-6) => {
	const overlap = makeFacesFacesOverlap(graph, epsilon);
	const facesWinding = makeFacesWinding(graph);
	// conditions encodes every pair of overlapping faces as a space-separated
	// string, low index first, as the keys of an object.
	// initialize all values to 0, but set neighbor faces to either 1 or 2.
	const conditions = makeConditions(graph, overlap, facesWinding);
	// get all taco/tortilla/transitivity events.
	const tacos_tortillas = makeTacosTortillas(graph, epsilon);
	const unfiltered_trios = makeTransitivityTrios(graph, overlap, facesWinding, epsilon);
	const transitivity_trios = filterTransitivity(unfiltered_trios, tacos_tortillas);
	// format the tacos and transitivity data into maps that relate to the
	// lookup table at the heart of the algorithm, located at "table.js"
	const maps = makeTacoMaps(tacos_tortillas, transitivity_trios);
	// console.log("overlap", overlap);
	// console.log("facesWinding", facesWinding);
	// console.log("tacos_tortillas", tacos_tortillas);
	// console.log("unfiltered_trios", unfiltered_trios);
	// console.log("transitivity_trios", transitivity_trios);
	// console.log("maps", maps);
	// console.log("conditions", conditions);
	return { maps, conditions, overlap };
};

export default prepare;
