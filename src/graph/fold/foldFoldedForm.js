/**
 * Rabbit Ear (c) Kraft
 */
import {
	includeS,
} from "../../math/compare.js";
import {
	pointsToLine,
} from "../../math/convert.js";
import {
	mergeArraysWithHoles,
} from "../../general/array.js";
import {
	transferPointBetweenGraphs,
	transferPointOnEdgeBetweenGraphs,
} from "../transfer.js";
import {
	splitLineToEdges,
} from "../split/splitLine.js";

/**
 *
 */
export const foldFoldedForm = (cp, folded, segment, epsilon) => {
	// todo need to expose these options to the user
	const newAssignment = "F";
	const newFoldAngle = 0;

	const {
		vertices_coords,
		vertices_overlapInfo,
		edges_vertices,
		edges_collinear,
		edges_face,
	} = splitLineToEdges(
		folded,
		pointsToLine(...segment),
		includeS,
		segment,
		epsilon,
	);

	const edges_assignment = edges_vertices.map(() => newAssignment);
	const edges_foldAngle = edges_vertices.map(() => newFoldAngle);

	// splitSegmentWithGraph created new points in the foldedForm coordinate
	// space. we need to transfer these to their respective position in the
	// crease pattern space. 2 different methods depending on how the point was made
	vertices_overlapInfo.forEach((overlapInfo, v) => {
		if (overlapInfo.face !== undefined) {
			vertices_coords[v] = transferPointBetweenGraphs(
				folded,
				cp,
				overlapInfo.face,
				overlapInfo.point,
			);
		}
		if (overlapInfo.edge !== undefined) {
			vertices_coords[v] = transferPointOnEdgeBetweenGraphs(
				folded,
				cp,
				overlapInfo.edge,
				overlapInfo.b,
			);
		}
	});

	cp.vertices_coords = mergeArraysWithHoles(cp.vertices_coords, vertices_coords);
	cp.edges_vertices = mergeArraysWithHoles(cp.edges_vertices, edges_vertices);
	cp.edges_assignment = mergeArraysWithHoles(cp.edges_assignment, edges_assignment);
	cp.edges_foldAngle = mergeArraysWithHoles(cp.edges_foldAngle, edges_foldAngle);

	// collinear edges should be dealt in this way:
	// if the edge is alredy a M or V, we can ignore it
	// if the edge is a F or U, we need to fold it, and we need to know which
	// direction, this is done by checking one of its two neighboring faces
	// (edges_faces), they should be the same winding, so just grab one.

	// const faces_winding = makeFacesWinding(folded);

	// const reassignable = { F: true, f: true, U: true, u: true };

	// edges_collinear
	// 	.map((collinear, e) => collinear ? e : undefined)
	// 	.filter(a => a !== undefined)
	// 	.forEach(edge => {
	// 		// if edge is F or U:
	// 		if (!reassignable[cp.edges_assignment[edge]]) { return; }
	// 		const face = cp.edges_faces[edge]
	// 			.filter(a => a !== undefined)
	// 			.shift();
	// 		const winding = faces_winding[face];
	// 		cp.edges_assignment[edge] = winding ? "M" : "V";
	// 	});

	return cp;
};
