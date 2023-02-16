/* Math (c) Kraft, MIT License */
import { subtract } from '../algebra/vectors.js';
import { overlapLinePoint } from './overlap.js';
import { intersectLineLine } from './intersect.js';
import { includeL, excludeS, excludeL } from '../general/functions.js';

/**
 * Math (c) Kraft
 */
/**
 * @description Split a convex polygon by a line and rebuild each
 * half into two convex polygons.
 * @param {number[][]} polygon an array of points, each point is an array of numbers
 * @param {RayLine} line a line object with "vector" and "origin"
 * @param {number[]} origin the origin component of the line
 * @returns {number[][][]} an array of one or two polygons, each polygon is an array of points,
 * each point is an array of numbers.
 * @linkcode Math ./src/geometry/split-polygon.js 19
 */
const splitConvexPolygon = (poly, line) => {
	// todo: should this return undefined if no intersection?
	//       or the original poly?

	//    point: intersection [x,y] point or null if no intersection
	// at_index: where in the polygon this occurs
	const vertices_intersections = poly.map((v, i) => {
		const intersection = overlapLinePoint(line, v, includeL);
		return { point: intersection ? v : null, at_index: i };
	}).filter(el => el.point != null);
	const edges_intersections = poly
		.map((v, i, arr) => ({
			vector: subtract(v, arr[(i + 1) % arr.length]),
			origin: arr[(i + 1) % arr.length],
		}))
		.map((polyLine, i) => ({
			point: intersectLineLine(line, polyLine, excludeL, excludeS),
			at_index: i,
		}))
		.filter(el => el.point != null);
	// three cases: intersection at 2 edges, 2 points, 1 edge and 1 point
	if (edges_intersections.length === 2) {
		const sorted_edges = edges_intersections.slice()
			.sort((a, b) => a.at_index - b.at_index);

		const face_a = poly
			.slice(sorted_edges[1].at_index + 1)
			.concat(poly.slice(0, sorted_edges[0].at_index + 1));
		face_a.push(sorted_edges[0].point);
		face_a.push(sorted_edges[1].point);

		const face_b = poly
			.slice(sorted_edges[0].at_index + 1, sorted_edges[1].at_index + 1);
		face_b.push(sorted_edges[1].point);
		face_b.push(sorted_edges[0].point);
		return [face_a, face_b];
	}
	if (edges_intersections.length === 1 && vertices_intersections.length === 1) {
		vertices_intersections[0].type = "v";
		edges_intersections[0].type = "e";
		const sorted_geom = vertices_intersections.concat(edges_intersections)
			.sort((a, b) => a.at_index - b.at_index);

		const face_a = poly.slice(sorted_geom[1].at_index + 1)
			.concat(poly.slice(0, sorted_geom[0].at_index + 1));
		if (sorted_geom[0].type === "e") { face_a.push(sorted_geom[0].point); }
		face_a.push(sorted_geom[1].point); // todo: if there's a bug, it's here. switch this

		const face_b = poly
			.slice(sorted_geom[0].at_index + 1, sorted_geom[1].at_index + 1);
		if (sorted_geom[1].type === "e") { face_b.push(sorted_geom[1].point); }
		face_b.push(sorted_geom[0].point); // todo: if there's a bug, it's here. switch this
		return [face_a, face_b];
	}
	if (vertices_intersections.length === 2) {
		const sorted_vertices = vertices_intersections.slice()
			.sort((a, b) => a.at_index - b.at_index);
		const face_a = poly
			.slice(sorted_vertices[1].at_index)
			.concat(poly.slice(0, sorted_vertices[0].at_index + 1));
		const face_b = poly
			.slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index + 1);
		return [face_a, face_b];
	}
	return [poly.slice()];
};

export { splitConvexPolygon };
