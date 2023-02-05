/**
 * Rabbit Ear (c) Kraft
 */
import { assignmentsToFacesFlip } from "./general.js";
/**
 * @description Given an array of sectors (defined by length),
 * and a fenceposted-array of fold assignments, fold the sectors
 * along the numberline, returning each sector as a pair of numbers
 * that mark the two ends of the of the folded sector: [end1, end2].
 * The first sector is always starts at 0, and spans [0, sector].
 *
 * When a boundary edge is encountered, the walk stops, no sectors after
 * the boundary will be included in the result. The algorithm will walk in
 * one direction, incrementing, starting at index "start", stopping at "end".
 * @param {number[]} faces an array of sector lengths
 * @param {string[]} an array of assignments "B", "V", "M", "F"
 * @returns {number[][]} array of sector positions with two indices representing
 * either end of the sector. any sectors caught between multiple
 * boundaries will be undefined.
 * @linkcode Origami ./src/layer/singleVertexSolver/foldStripWithAssignments.js 20
 */
const foldStripWithAssignments = (faces, assignments) => {
	// one number for each sector, locally, the movement away from 0.
	const faces_end = assignmentsToFacesFlip(assignments)
		.map((flip, i) => faces[i] * (flip ? -1 : 1));
	// the cumulative position for each sector, stored as an array of 2:
	// [ the start of the sector, the end of the sector ]
	const cumulative = faces.map(() => undefined);
	cumulative[0] = [0, faces_end[0]];
	for (let i = 1; i < faces.length; i += 1) {
		if (assignments[i] === "B" || assignments[i] === "b") { break; }
		const prev = (i - 1 + faces.length) % faces.length;
		const prev_end = cumulative[prev][1];
		cumulative[i] = [prev_end, prev_end + faces_end[i]];
	}
	return cumulative;
};

export default foldStripWithAssignments;
