/**
 * Rabbit Ear (c) Kraft
 */
import {
	planarizeVEF,
	planarizeEdges,
} from "./planarize/planarize.js";

/**
 * @description {FOLD} graph a FOLD object in foldedForm, can contain holes.
 * @returns {FOLD}
 */
export const fixCycles = (graph) => {
	const { result, changes: { faces: { map }} } = planarizeVEF(graph);
	// const { result, changes } = planarizeEdges(graph);
	return result;
};
