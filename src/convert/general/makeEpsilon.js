import { boundingBox } from "../../graph/boundary.js";

const makeEpsilon = (graph) => {
	// if the user wants an epsilon, return it.
	const bounds = boundingBox(graph);
	return bounds && bounds.span
		? 1e-3 * Math.min(...bounds.span)
		: 1e-3;
};

export default makeEpsilon;
