import {
	pleat as fnPleat,
} from "../math/line.js";

import { pointsToLine } from "../math/convert.js";

const edgeToLine = ({ vertices_coords, edges_vertices }, edge) => (
	pointsToLine(...edges_vertices[edge].map(v => vertices_coords[v]))
);

export const pleat = ({ vertices_coords, edges_vertices }, edgeA, edgeB, count, epsilon) => (
	fnPleat(
		...[edgeA, edgeB]
			.map(e => edgeToLine({ vertices_coords, edges_vertices }, e)),
		count,
		epsilon,
	)
);

// export const pleat = ({ vertices_coords, edges_vertices }, edgeA, edgeB, count, epsilon) => {
// 	console.log("pleat", edgeA, edgeB, [edgeA, edgeB]
// 		.map(e => edgeToLine({ vertices_coords, edges_vertices }, e)));
// 	return fnPleat(
// 		...[edgeA, edgeB]
// 			.map(e => edgeToLine({ vertices_coords, edges_vertices }, e)),
// 		count,
// 		epsilon,
// 	);
// };
