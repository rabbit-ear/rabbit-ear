/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import { makeFacesCenterQuick } from "./make";
/**
 * @returns index of nearest vertex in vertices_ arrays or
 * this is the only one of the nearest_ functions that works in 3-dimensions
 *
 * todo: improve with space partitioning
 */
export const nearestVertex = ({ vertices_coords }, point) => {
	if (!vertices_coords) { return undefined; }
	// resize our point to be the same dimension as the first vertex
	const p = math.core.resize(vertices_coords[0].length, point);
	// sort by distance, hold onto the original index in vertices_coords
	const nearest = vertices_coords
		.map((v, i) => ({ d: math.core.distance(p, v), i }))
		.sort((a, b) => a.d - b.d)
		.shift();
	// return index, not vertex
	return nearest ? nearest.i : undefined;
};
/**
 * returns index of nearest edge in edges_ arrays or
 *  undefined if there are no vertices_coords or edges_vertices
 */
export const nearestEdge = ({ vertices_coords, edges_vertices }, point) => {
	if (!vertices_coords || !edges_vertices) { return undefined; }
	const nearest_points = edges_vertices
		.map(e => e.map(ev => vertices_coords[ev]))
		.map(e => math.core.nearestPointOnLine(
			math.core.subtract(e[1], e[0]),
			e[0],
			point,
			math.core.segmentLimiter));
	return math.core.smallestComparisonSearch(point, nearest_points, math.core.distance);
};
/**
 * from a planar perspective, ignoring z components
 */
export const faceContainingPoint = ({ vertices_coords, faces_vertices }, point) => {
	if (!vertices_coords || !faces_vertices) { return undefined; }
	const face = faces_vertices
		.map((fv, i) => ({ face: fv.map(v => vertices_coords[v]), i }))
		.filter(f => math.core.overlapConvexPolygonPoint(f.face, point))
		.shift();
	return (face === undefined ? undefined : face.i);
};

export const nearestFace = (graph, point) => {
	const face = faceContainingPoint(graph, point);
	if (face !== undefined) { return face; }
	if (graph.edges_faces) {
		const edge = nearestEdge(graph, point);
		const faces = graph.edges_faces[edge];
		if (faces.length === 1) { return faces[0]; }
		if (faces.length > 1) {
			const faces_center = makeFacesCenterQuick({
				vertices_coords: graph.vertices_coords,
				faces_vertices: faces.map(f => graph.faces_vertices[f])
			});
			const distances = faces_center
				.map(center => math.core.distance(center, point));
			let shortest = 0;
			for (let i = 0; i < distances.length; i++) {
				if (distances[i] < distances[shortest]) { shortest = i; }
			}
			return faces[shortest];
		}
	}
};
