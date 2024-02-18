/**
 * Rabbit Ear (c) Kraft
 */
import {
	transferPointInFaceBetweenGraphs,
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
export const transferPoint = (from, to, { vertex, edge, face, point, b }) => {
	if (vertex !== undefined) {
		return to.vertices_coords[vertex];
	}
	if (edge !== undefined) {
		return transferPointOnEdgeBetweenGraphs(to, edge, b);
	}
	if (face !== undefined) {
		return transferPointInFaceBetweenGraphs(from, to, face, point);
	}
	throw new Error("transferPoint() failed");
};
