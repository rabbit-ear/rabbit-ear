/**
 * Rabbit Ear (c) Kraft
 */
import {
	distance2,
} from "../math/vector.js";
import {
	isCollinear,
} from "../math/line.js";
import {
	trilateration,
} from "../math/triangle.js";

/**
 * @description Transfer a point from one graph to another, given the
 * two graphs are isomorphic, but contain different vertices coords.
 * Supply a face index which contains the point and the new point's
 * coordinates will be calculated via. trilateration.
 * @param {FOLD} from a fold graph which the point now lies inside
 * @param {FOLD} to a fold graph we want to move the point into
 * @param {number} face the index of the face which contains this point
 * @param {number[]} point the point, as it exists inside the "from" graph
 * @returns {number[]} a new point
 */
export const transferPointInFaceBetweenGraphs = (from, to, face, point) => {
	// Assuming the graphs are isomorphic except for the vertices_coords,
	// we have to account for the possibility that vertices_coords might have
	// invalid references or non existent coordinate data.

	// Filter out any vertices which have non existent coords or are collinear.
	const faceVerticesInitial = to.faces_vertices[face]
		.filter(v => from.vertices_coords[v] && to.vertices_coords[v]);

	// Trilateration will fail if the three chosen vertices are collinear.
	// For every vertex, check collinearity between prev-this-next vertex.
	const faceVertsInitialCollinear = faceVerticesInitial
		.map((v, i, arr) => [
			arr[(i + arr.length - 1) % arr.length], v, arr[(i + 1) % arr.length],
		])
		.map(verts => (
			isCollinear(...verts.map(v => from.vertices_coords[v]))
			|| isCollinear(...verts.map(v => to.vertices_coords[v]))));

	// we want only vertices which are not collinear
	const faceVertices = faceVerticesInitial
		.filter((_, i) => !faceVertsInitialCollinear[i]);

	if (faceVertices.length < 3) { return undefined; }

	const fromPoly = faceVertices.map(v => from.vertices_coords[v]);
	const toPoly = faceVertices.map(v => to.vertices_coords[v]);

	// compute the distances from the input point to the first 3 polygon points.
	// the trilateration method only looks at the first 3 points.
	const distances = Array.from(Array(3))
		.map((_, i) => distance2(fromPoly[i], point));
	return trilateration(toPoly, distances);
};
