/**
 * Rabbit Ear (c) Kraft
 */
import {
	exclude,
	excludeS,
} from "../../math/general/function.js";
import {
	boundingBox,
} from "../../math/geometry/polygon.js";
import {
	overlapBoundingBoxes,
	overlapConvexPolygonPoint,
} from "../../math/intersect/overlap.js";
import { intersectConvexPolygonLine } from "../../math/intersect/intersect.js";
import {
	makeEdgesVector,
	makeEdgesBoundingBox,
} from "../make.js";
// import { makeEdgesEdgesSimilar } from "./edgesEdges";
/**
 * @description Return an ExF matrix (number of: E=edges, F=faces), relating every edge
 * to every face. Value will contain true if the edge and face overlap each other, excluding
 * the space around the edge's endpoints, and the edges of the face.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean[][]} matrix relating edges to faces, answering, do they overlap?
 * @linkcode Origami ./src/graph/overlap.js 32
 */
export const makeEdgesFacesOverlap = ({
	vertices_coords, edges_vertices, edges_vector, edges_faces, faces_vertices,
}, epsilon) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const faces_winding = makeFacesWinding({ vertices_coords, faces_vertices });
	// use graph vertices_coords for edges vertices
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	// const edges_similar = makeEdgesEdgesSimilar({ vertices_coords, edges_vertices });
	const edges_coords = edges_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	const faces_coords = faces_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	faces_winding.forEach((winding, i) => {
		if (!winding) {
			faces_coords[i].reverse();
		}
	});

	// the result object
	const matrix = edges_vertices
		.map(() => faces_vertices
			.map(() => undefined));
	// edges which define a face are already known to not-overlap
	edges_faces.forEach((faces, e) => faces
		.forEach(f => { matrix[e][f] = false; }));

	// quick bounding box test to eliminate non-overlapping axis-aligned areas
	// todo improve n^2
	const edges_bounds = makeEdgesBoundingBox({ edges_coords });
	const faces_bounds = faces_coords
		.map(coords => boundingBox(coords));
	edges_bounds.forEach((edge_bounds, e) => faces_bounds.forEach((face_bounds, f) => {
		if (matrix[e][f] === false) { return; }
		if (!overlapBoundingBoxes(face_bounds, edge_bounds)) {
			matrix[e][f] = false;
		}
	}));

	edges_coords.forEach((edge_coords, e) => faces_coords.forEach((face_coords, f) => {
		if (matrix[e][f] !== undefined) { return; }
		const point_in_poly = edges_coords[e]
			.map(point => overlapConvexPolygonPoint(
				faces_coords[f],
				point,
				exclude,
				epsilon,
			)).reduce((a, b) => a || b, false);
		if (point_in_poly) { matrix[e][f] = true; return; }
		const edge_intersect = intersectConvexPolygonLine(
			faces_coords[f],
			{ vector: edges_vector[e], origin: edges_origin[e] },
			excludeS,
			excludeS,
			epsilon,
		);
		if (edge_intersect) { matrix[e][f] = true; return; }
		matrix[e][f] = false;
	}));

	// faster code. todo: switch this out for the block just above here
	// but refactor so that we use forEach instead of for()
	// const finished_edges = {};
	// for (let e = 0; e < matrix.length; e += 1) {
	// 	if (finished_edges[e]) { continue; }
	// 	for (let f = 0; f < matrix[e].length; f += 1) {
	// 		if (matrix[e][f] !== undefined) { continue; }
	// 		const point_in_poly = edges_coords[e]
	// 			.map(point => overlapConvexPolygonPoint(
	// 				faces_coords[f],
	// 				point,
	// 				exclude,
	// 				epsilon,
	// 			)).reduce((a, b) => a || b, false);
	// 		if (point_in_poly) { matrix[e][f] = true; continue; }
	// 		const edge_intersect = intersectConvexPolygonLine(
	// 			faces_coords[f],
	// 			{ vector: edges_vector[e], origin: edges_origin[e] },
	// 			excludeS,
	// 			excludeS,
	// 			epsilon,
	// 		);
	// 		if (edge_intersect) { matrix[e][f] = true; continue; }
	// 		matrix[e][f] = false;
	// 	}
	// 	edges_similar[e].forEach(adjacent_edge => {
	// 		matrix[adjacent_edge] = matrix[e].slice();
	// 		finished_edges[adjacent_edge] = true;
	// 	});
	// }

	// old code
	// matrix.forEach((row, e) => row.forEach((val, f) => {
	// 	if (val === false) { return; }
	// 	// both segment endpoints, true if either one of them is inside the face.
	// 	const point_in_poly = edges_coords[e]
	// 		.map(point => overlapConvexPolygonPoint(
	// 			faces_coords[f],
	// 			point,
	// 			exclude,
	// 			epsilon,
	// 		)).reduce((a, b) => a || b, false);
	// 	if (point_in_poly) { matrix[e][f] = true; return; }
	// 	const edge_intersect = intersectConvexPolygonLine(
	// 		faces_coords[f],
	// 		{ vector: edges_vector[e], origin: edges_origin[e] },
	// 		excludeS,
	// 		excludeS,
	// 		epsilon,
	// 	);
	// 	if (edge_intersect) { matrix[e][f] = true; return; }
	// 	matrix[e][f] = false;
	// }));
	return matrix;
};
