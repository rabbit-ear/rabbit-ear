/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/constant.js";
import { solverSolutionToFaceOrders } from "../solver2d/general.js";
import { dot } from "../../math/vector.js";
/**
 * @description a range is an array of two numbers [start, end]
 * not necessarily in sorted order.
 * Do the two spans overlap on the numberline?
 * @param {number[]} a range with two numbers
 * @param {number[]} b range with two numbers
 * @param {number} [epsilon=1e-6] a positive value makes the range
 * endpoints exclusive, a negative value makes range endpoints inclusive.
 */
export const doRangesOverlap = (a, b, epsilon = EPSILON) => {
	// make sure ranges are well formed (sorted low to high)
	const r1 = a[0] < a[1] ? a : [a[1], a[0]];
	const r2 = b[0] < b[1] ? b : [b[1], b[0]];
	const overlap = Math.min(r1[1], r2[1]) - Math.max(r1[0], r2[0]);
	return overlap > epsilon;
};
/**
 *
 */
export const doEdgesOverlap = ({
	vertices_coords, edges_vertices,
}, edgePair, vector, epsilon = EPSILON) => {
	const pairCoords = edgePair
		.map(edge => edges_vertices[edge]
			.map(v => vertices_coords[v]));
	const pairCoordsDots = pairCoords
		.map(edge => edge
			.map(coord => dot(coord, vector)));
	const result = doRangesOverlap(...pairCoordsDots, epsilon);
	return result;
};
/**
 * @description traverse the solution tree, convert any orders
 * from { string: number } where string is a face pair, like "3 29",
 * and the number is one of either (1,2) into the FOLD spec facesOrder
 * format, like [3, 29, -1].
 * The string becomes .split(" ") and the (1,2) order becomes (1,-1).
 * Modifies the solution parameter object in place.
 * @param {object} solution the result of calling src/layer/solver/index.js
 * @param {boolean[]} faces_winding for every face true or false,
 * specifically, the property on the result of getOverlappingFacesGroups.
 * @returns {object} the solution parameter, modified in place.
 */
export const reformatSolution = (solution, faces_winding) => {
	if (solution.orders) {
		solution.orders = solution.orders
			.flatMap(order => solverSolutionToFaceOrders(order, faces_winding));
	}
	if (solution.leaves) {
		solution.leaves = solution.leaves
			.map(order => solverSolutionToFaceOrders(order, faces_winding));
	}
	if (solution.partitions) {
		solution.partitions
			.forEach(child => reformatSolution(child, faces_winding));
	}
	if (solution.node) {
		solution.node
			.forEach(child => reformatSolution(child, faces_winding));
	}
	return solution;
};
