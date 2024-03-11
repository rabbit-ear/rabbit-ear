/**
 * Rabbit Ear (c) Kraft
 */
import { getEpsilon } from "../../graph/epsilon.js";
import { boundingBox } from "../../graph/boundary.js";
import { cleanNumber } from "../../general/number.js";
/**
 *
 */
export const findEpsilonInObject = (graph, object, key = "epsilon") => {
	if (typeof object === "object" && typeof object[key] === "number") {
		return object[key];
	}
	return typeof object === "number"
		? object
		: getEpsilon(graph);
};
/**
 * @description Invert the vertices and re-center them to
 * be inside the same bounding box as before.
 */
export const invertVertical = (vertices_coords) => {
	const box = boundingBox({ vertices_coords });
	const center = box.min[1] + box.span[1] / 2;
	const invMin = Math.min(-box.min[1], -box.max[1]);
	const invMax = Math.max(-box.min[1], -box.max[1]);
	const invSpan = invMax - invMin;
	const invCenter = invMin + invSpan / 2;
	const difference = center - invCenter;
	const yTranslate = cleanNumber(difference, 8);
	for (let i = 0; i < vertices_coords.length; i += 1) {
		vertices_coords[i][1] = -vertices_coords[i][1] + yTranslate;
	}
};
