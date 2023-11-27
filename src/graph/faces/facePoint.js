/**
 * Rabbit Ear (c) Kraft
 */
import {
	include,
	exclude,
} from "../../math/compare.js";
import {
	add2,
	scale2,
} from "../../math/vector.js";
import { overlapConvexPolygonPoint } from "../../math/overlap.js";
import { facesContainingPoint } from "../nearest.js";
/**
 * @description Given a point, get the index of a face that this point
 * exists within. In the case when the point lies along an edge or
 * vertex, supply a vector indicating the direction to nudge the point
 * a very tiny amount, then there will be a preference to return the
 * index of the face which encloses the nudged point.
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} point the point to test
 * @param {number[]} vector an optional vector, used in the case that
 * the point exists along an edge or a vertex.
 * @returns {number} the index of a face
 */
export const getFaceContainingPoint = (
	{ vertices_coords, faces_vertices },
	point,
	vector,
) => {
	const facesInclusive = facesContainingPoint(
		{ vertices_coords, faces_vertices },
		point,
		include,
	);
	switch (facesInclusive.length) {
	case 0: return undefined;
	case 1: return facesInclusive[0];
	default: break;
	}
	// if user did not supply a vector, stop. return the first face in the list.
	if (!vector) { return facesInclusive[0]; }
	// continue search by nudging point.
	const nudgePoint = add2(point, scale2(vector, 1e-2));
	const polygons = facesInclusive
		.map(face => faces_vertices[face]
			.map(v => vertices_coords[v]));
	const facesExclusive = facesInclusive
		.filter((face, i) => overlapConvexPolygonPoint(polygons[i], nudgePoint, exclude));
	switch (facesExclusive.length) {
	// backtrack and try inclusive using nudge point and facesInclusive
	case 0: return facesInclusive
		.filter((face, i) => overlapConvexPolygonPoint(polygons[i], nudgePoint, include))
		.shift();
	case 1: return facesExclusive[0];
		// all faces lie on the point so it shouldn't matter
	default: return facesExclusive[0];
	}
};
