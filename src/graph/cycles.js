/**
 * Rabbit Ear (c) Kraft
 */
import {
	planarizeVerbose,
} from "./planarize/planarize.js";

/**
 * @description {FOLD} graph a FOLD object in foldedForm, can contain holes.
 * @returns {FOLD}
 */
export const fixCycles = (graph) => {
	const { result, changes: { faces: { map }} } = planarizeVerbose(graph);

	return result;
};
