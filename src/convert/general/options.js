/**
 * Rabbit Ear (c) Kraft
 */
import makeEpsilon from "./makeEpsilon.js";
/**
 *
 */
export const findEpsilonInObject = (graph, object, key = "epsilon") => {
	if (typeof object === "object" && typeof object[key] === "number") {
		return object[key];
	}
	return typeof object === "number"
		? object
		: makeEpsilon(graph);
};
