/**
 * Rabbit Ear (c) Kraft
 */
import {
	transferPointBetweenGraphs,
	transferPointOnEdgeBetweenGraphs,
} from "../transfer.js";

/**
 * @description Transfer a point from the "from" graph space into the
 * "to" graph space. The point object comes from the "splitLineIntoEdges"
 * method, which returns information about the point's construction which
 * we can use to re-parameterize into the other graph's space.
 * @param {FOLD} graph a FOLD object
 * @param {FOLD} graph a FOLD object
 * @param {object} point a point, the result of calling splitLineIntoEdges
 * @returns {number[]} a point
 */
export const transferPoint = (from, to, { edge, face, point, b }) => {
	if (edge !== undefined) {
		return transferPointOnEdgeBetweenGraphs(from, to, edge, b);
	}
	if (face !== undefined) {
		return transferPointBetweenGraphs(from, to, face, point);
	}
	return point;
};
