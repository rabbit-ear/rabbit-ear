/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../math/constant.js";
import {
	pleat as earPleat,
} from "../math/line.js";
import {
	intersectLineLine,
} from "../math/intersect.js";
import {
	includeL,
	includeS,
} from "../math/compare.js";
import {
	add2,
	scale2,
} from "../math/vector.js";
import {
	makeEdgesVector,
} from "./make.js";

import { pointsToLine } from "../math/convert.js";

const edgeToLine = ({ vertices_coords, edges_vertices }, edge) => (
	pointsToLine(...edges_vertices[edge].map(v => vertices_coords[v]))
);

// export const pleat = ({ vertices_coords, edges_vertices }, edgeA, edgeB, count, epsilon) => (
// 	earPleat(
// 		...[edgeA, edgeB]
// 			.map(e => edgeToLine({ vertices_coords, edges_vertices }, e)),
// 		count,
// 		epsilon,
// 	)
// );

export const pleat = (
	{ vertices_coords, edges_vertices },
	edgeA,
	edgeB,
	count,
	epsilon = EPSILON,
) => {
	// console.log("pleat", edgeA, edgeB, [edgeA, edgeB]
	// 	.map(e => edgeToLine({ vertices_coords, edges_vertices }, e)));
	const lineA = edgeToLine({ vertices_coords, edges_vertices }, edgeA);
	const lineB = edgeToLine({ vertices_coords, edges_vertices }, edgeB);
	const lineGroups = earPleat(lineA, lineB, count, epsilon);
	const edges_lines = makeEdgesVector({ vertices_coords, edges_vertices })
		.map((vector, i) => ({
			vector,
			origin: vertices_coords[edges_vertices[i][0]],
		}));
	const segments = lineGroups.map(lines => lines.map(line => {
		const dots = edges_lines.map(edgeLine => intersectLineLine(
			line,
			edgeLine,
			includeL,
			includeS,
			epsilon,
		).a).filter(a => a !== undefined);
		const min = Math.min(...dots);
		const max = Math.max(...dots);
		return Math.abs(max - min) < epsilon
			? undefined
			: [
				add2(line.origin, scale2(line.vector, min)),
				add2(line.origin, scale2(line.vector, max)),
			];
	}).filter(a => a !== undefined));
	return segments;
	// console.log("pleat", lines);
};
