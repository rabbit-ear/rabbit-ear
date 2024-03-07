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
import {
	overlapConvexPolygonPoint,
} from "../../math/overlap.js";

/**
 * @description Given a point, get the indices of all faces which this point
 * lies inside. An optional domain function allows you to specify
 * inclusive or exclusive. This method is 2D only.
 * @param {FOLD} graph a FOLD object
 * @param {number[]} point the point to test
 * @param {function} [domainFunction=include], an optional domain function
 * to specificy inclusive or exclusive.
 * @returns {number[]} an array of face indices
 * @linkcode
 */
export const facesContainingPoint = (
	{ vertices_coords, faces_vertices = [] },
	point,
	// vector = undefined, // would be nice to include this nudging behavior
	domainFunction = include,
) => (!vertices_coords
	? []
	: faces_vertices
		.map((fv, i) => ({ face: fv.map(v => vertices_coords[v]), i }))
		.filter(f => overlapConvexPolygonPoint(f.face, point, domainFunction).overlap)
		.map(el => el.i)
);

/**
 * @description Given a point, get the index of a face that this point
 * exists within. In the case when the point lies along an edge or
 * vertex, an additional vector parameter can be used to nudge the point
 * by a very tiny amount, then there will be a preference to return the
 * index of the face which encloses the nudged point.
 * This is a 2D-only method, any z-axis data will be ignored.
 * @param {FOLD} graph a FOLD object
 * @param {number[]} point the point to test
 * @param {number[]} vector an optional vector, used in the case that
 * the point exists along an edge or a vertex.
 * @returns {number|undefined} the index of a face, or undefined
 * if the point does not lie inside any face.
 * @linkcode
 */
export const faceContainingPoint = (
	{ vertices_coords, faces_vertices },
	point,
	vector,
) => {
	// The inclusive test includes the boundary around each face when computing
	// whether a point is inside a face or not. If this method returns:
	// - 0 solutions: then no solutions are possible. exit with no solution.
	// - 1 solution: we are done, exit and return this solution.
	// - 2 solutions: proceed with the rest of the algorithm.
	// this variable contains a list of face indices
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

	// from this point on, we will use the optional vector parameter to nudge
	// the point and find the best match for a face. if user did not provide
	// a vector, we can't do anything, simply return the first face in the list.
	if (!vector) { return facesInclusive[0]; }

	// continue search by nudging point.
	const nudgePoint = add2(point, scale2(vector, 1e-2));
	const polygons = facesInclusive
		.map(face => faces_vertices[face]
			.map(v => vertices_coords[v]));

	// filter the list of face indices to include only those which
	// the nudged point lies inside of, excluding the area around the boundary.
	const facesExclusive = facesInclusive.filter((_, i) => (
		overlapConvexPolygonPoint(polygons[i], nudgePoint, exclude).overlap
	));

	switch (facesExclusive.length) {
	// it's possible that the nudge went in the exact same direction as an edge,
	// in which case, we have to re-run an inclusive test with the nudged point,
	// then return the first face which satisfies the inclusive overlap test.
	case 0: return facesInclusive.find((_, i) => (
		overlapConvexPolygonPoint(polygons[i], nudgePoint, include).overlap
	));

	// the ideal case, only one face exists underneath the nudged point
	case 1: return facesExclusive[0];

	// the nudged point lies inside of all these faces, so it shouldn't matter
	// this implies that there are faces that overlap each other.
	default: return facesExclusive[0];
	}
};
