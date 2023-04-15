/**
 * Rabbit Ear (c) Kraft
 */
import {
	exclude,
	excludeS,
} from "../../math/general/function.js";
import { boundingBox } from "../../math/geometry/polygon.js";
import { intersectConvexPolygonLine } from "../../math/intersect/intersect.js";
import {
	overlapBoundingBoxes,
	overlapConvexPolygonPoint,
} from "../../math/intersect/overlap.js";
import {
	makeEdgesFaces,
	makeEdgesVector,
	makeEdgesBoundingBox,
} from "../make.js";
import { makeFacesWinding } from "../faces/winding.js";
import { sweep } from "../sweep.js";
/**
 * @description well, this was supposed to be an improvement. try checking
 * these lines: setOfFaces.forEach((_, f) => setOfEdges.forEach((__, e) => {
 * it might have something to do with doing too many comparisons and not
 * only comparing against the new ones (not the entire current stack)
 */
export const getEdgesFacesOverlap = (graph, epsilon) => {
	const faces_winding = makeFacesWinding(graph);
	const edges_vector = makeEdgesVector(graph);
	// use graph vertices_coords for edges vertices
	const edges_origin = graph.edges_vertices
		.map(verts => graph.vertices_coords[verts[0]]);
	// const edges_similar = makeEdgesEdgesSimilar({ vertices_coords, edges_vertices });
	const edges_coords = graph.edges_vertices
		.map(verts => verts.map(v => graph.vertices_coords[v]));
	const faces_coords = graph.faces_vertices
		.map(verts => verts.map(v => graph.vertices_coords[v]));
	faces_winding.forEach((winding, i) => {
		if (!winding) {
			faces_coords[i].reverse();
		}
	});
	const edges_faces = graph.edges_faces
		? graph.edges_faces
		: makeEdgesFaces(graph);
	const edgesFacesLookup = edges_faces.map(() => []);
	edges_faces
		.forEach((faces, e) => faces
			.forEach(f => { edgesFacesLookup[e][f] = true; }));
	const edges_bounds = makeEdgesBoundingBox({ edges_coords });
	const faces_bounds = faces_coords.map(coords => boundingBox(coords));
	const intersections = graph.edges_vertices.map(() => []);
	// as we progress through the line sweep, maintain a list (hash table)
	// of the set of edges which are currently overlapping this sweep line.
	const computeEdgeFace = (e, f) => {
		if (edgesFacesLookup[e][f]) { return; }
		if (intersections[e][f]) { return; }
		if (!overlapBoundingBoxes(faces_bounds[f], edges_bounds[e])) { return; }
		// todo: memo the vertex-in-face result
		const point_in_poly = edges_coords[e]
			.map(point => overlapConvexPolygonPoint(
				faces_coords[f],
				point,
				exclude,
				epsilon,
			)).reduce((a, b) => a || b, false);
		if (point_in_poly) { intersections[e][f] = true; return; }
		const edge_intersect = intersectConvexPolygonLine(
			faces_coords[f],
			{ vector: edges_vector[e], origin: edges_origin[e] },
			excludeS,
			excludeS,
			epsilon,
		);
		if (edge_intersect) { intersections[e][f] = true; }
	};
	const setOfEdges = [];
	const setOfFaces = [];
	sweep(graph, 0, epsilon)
		.forEach(event => {
			event.edges.start.forEach(e => { setOfEdges[e] = true; });
			event.faces.start.forEach(f => { setOfFaces[f] = true; });
			setOfEdges
				.forEach((_, e) => event.faces.start
					.forEach(f => computeEdgeFace(e, f)));
			setOfFaces
				.forEach((_, f) => event.edges.start
					.forEach(e => computeEdgeFace(e, f)));
			event.edges.end.forEach(e => delete setOfEdges[e]);
			event.faces.end.forEach(f => delete setOfFaces[f]);
		});
	return intersections
		.map(faces => faces
			.map((overlap, i) => (overlap ? i : undefined))
			.filter(i => i !== undefined));
};

export const getEdgesFacesOverlapOld = ({
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
	// todo bad n^2
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
