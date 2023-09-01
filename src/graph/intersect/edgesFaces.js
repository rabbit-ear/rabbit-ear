/**
 * Rabbit Ear (c) Kraft
 */
import {
	exclude,
	excludeS,
	epsilonEqual,
	epsilonEqualVectors,
} from "../../math/compare.js";
import { EPSILON } from "../../math/constant.js";
import { boundingBox } from "../../math/polygon.js";
import { intersectConvexPolygonLine } from "../../math/intersect.js";
import {
	overlapBoundingBoxes,
	overlapConvexPolygonPoint,
} from "../../math/overlap.js";
import {
	makeEdgesFacesUnsorted,
	makeEdgesVector,
	makeEdgesBoundingBox,
	makeEdgesCoords,
} from "../make.js";
import { makeFacesWinding } from "../faces/winding.js";
import { sweep } from "../sweep.js";
/**
 * update: yet again, there is something wrong with this method.
 *
 * @description well, this was supposed to be an improvement. try checking
 * these lines: setOfFaces.forEach((_, f) => setOfEdges.forEach((__, e) => {
 * it might have something to do with doing too many comparisons and not
 * only comparing against the new ones (not the entire current stack)
 */
// export const getEdgesFacesOverlap = ({
// 	vertices_coords, edges_vertices, edges_faces, faces_vertices, faces_edges,
// }, epsilon = EPSILON) => {
// 	if (!edges_faces) {
// 		edges_faces = makeEdgesFacesUnsorted({ edges_vertices, faces_edges });
// 	}
// 	const faces_winding = makeFacesWinding({ vertices_coords, faces_vertices });
// 	const edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
// 	// use graph vertices_coords for edges vertices
// 	const edges_origin = edges_vertices
// 		.map(verts => vertices_coords[verts[0]]);
// 	// const edges_similar = makeEdgesEdgesSimilar({ vertices_coords, edges_vertices });
// 	const edges_coords = edges_vertices
// 		.map(verts => verts.map(v => vertices_coords[v]));
// 	const faces_coords = faces_vertices
// 		.map(verts => verts.map(v => vertices_coords[v]));
// 	faces_winding.forEach((winding, i) => {
// 		if (!winding) {
// 			faces_coords[i].reverse();
// 		}
// 	});
// 	const edgesFacesLookup = edges_faces.map(() => []);
// 	edges_faces
// 		.forEach((faces, e) => faces
// 			.forEach(f => { edgesFacesLookup[e][f] = true; }));
// 	const edges_bounds = makeEdgesBoundingBox({ edges_coords });
// 	const faces_bounds = faces_coords.map(coords => boundingBox(coords));
// 	const intersections = edges_vertices.map(() => []);
// 	// as we progress through the line sweep, maintain a list (hash table)
// 	// of the set of edges which are currently overlapping this sweep line.
// 	const computeEdgeFace = (e, f) => {
// 		if (edgesFacesLookup[e][f]) { return; }
// 		if (intersections[e][f]) { return; }
// 		if (!overlapBoundingBoxes(faces_bounds[f], edges_bounds[e], epsilon)) { return; }
// 		// todo: memo the vertex-in-face result
// 		const point_in_poly = edges_coords[e]
// 			.map(point => overlapConvexPolygonPoint(
// 				faces_coords[f],
// 				point,
// 				exclude,
// 				epsilon,
// 			)).reduce((a, b) => a || b, false);
// 		if (point_in_poly) { intersections[e][f] = true; return; }
// 		const edge_intersect = intersectConvexPolygonLine(
// 			faces_coords[f],
// 			{ vector: edges_vector[e], origin: edges_origin[e] },
// 			excludeS,
// 			excludeS,
// 			epsilon,
// 		);
// 		if (edge_intersect) { intersections[e][f] = true; }
// 	};
// 	const setOfEdges = [];
// 	const setOfFaces = [];
// 	sweep({ vertices_coords, edges_vertices, faces_vertices }, 0, epsilon)
// 		.forEach(event => {
// 			event.edges.start.forEach(e => { setOfEdges[e] = true; });
// 			event.faces.start.forEach(f => { setOfFaces[f] = true; });
// 			setOfEdges
// 				.forEach((_, e) => event.faces.start
// 					.forEach(f => computeEdgeFace(e, f)));
// 			setOfFaces
// 				.forEach((_, f) => event.edges.start
// 					.forEach(e => computeEdgeFace(e, f)));
// 			event.edges.end.forEach(e => delete setOfEdges[e]);
// 			event.faces.end.forEach(f => delete setOfFaces[f]);
// 		});
// 	return intersections
// 		.map(faces => faces
// 			.map((overlap, i) => (overlap ? i : undefined))
// 			.filter(i => i !== undefined));
// };

const booleanMatrixToIndexedArray = matrix => matrix
	.map(row => row
		.map((value, i) => (value === true ? i : undefined))
		.filter(a => a !== undefined));

const makeEdgesEdgesSimilar = ({
	vertices_coords, edges_vertices, edges_coords, edges_boundingBox,
}, epsilon = EPSILON) => {
	if (!edges_coords) {
		edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	}
	if (!edges_boundingBox) {
		edges_boundingBox = makeEdgesBoundingBox({
			vertices_coords, edges_vertices, edges_coords,
		});
	}
	const indexFirst = edges_vertices.map((_, i) => i).shift();
	const matrix = Array.from(Array(edges_coords.length)).map(() => []);
	if (indexFirst === undefined) { return booleanMatrixToIndexedArray(matrix); }
	const dimensions = edges_boundingBox[indexFirst].min.length;
	for (let i = 0; i < edges_coords.length - 1; i += 1) {
		if (!edges_boundingBox[i]) { continue; }
		for (let j = i + 1; j < edges_coords.length; j += 1) {
			if (!edges_boundingBox[j]) { continue; }
			let similar = true;
			for (let d = 0; d < dimensions; d += 1) {
				if (!epsilonEqual(
					edges_boundingBox[i].min[d],
					edges_boundingBox[j].min[d],
					epsilon,
				) || !epsilonEqual(
					edges_boundingBox[i].max[d],
					edges_boundingBox[j].max[d],
					epsilon,
				)) {
					similar = false;
				}
			}
			matrix[i][j] = similar;
			matrix[j][i] = similar;
		}
	}
	for (let i = 0; i < edges_coords.length - 1; i += 1) {
		for (let j = i + 1; j < edges_coords.length; j += 1) {
			if (!matrix[i][j]) { continue; }
			const test0 = epsilonEqualVectors(edges_coords[i][0], edges_coords[j][0], epsilon)
				&& epsilonEqualVectors(edges_coords[i][1], edges_coords[j][1], epsilon);
			const test1 = epsilonEqualVectors(edges_coords[i][0], edges_coords[j][1], epsilon)
				&& epsilonEqualVectors(edges_coords[i][1], edges_coords[j][0], epsilon);
			const similar = test0 || test1;
			matrix[i][j] = similar;
			matrix[j][i] = similar;
		}
	}
	return booleanMatrixToIndexedArray(matrix);
};

export const getEdgesFacesOverlap = ({
	vertices_coords, edges_vertices, edges_vector, edges_faces, faces_vertices,
}, epsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	// use graph vertices_coords for edges vertices
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	const matrix = edges_vertices
		.map(() => Array.from(Array(faces_vertices.length)));
	edges_faces.forEach((faces, e) => faces
		.forEach(f => { matrix[e][f] = false; }));
	const edges_coords = edges_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	// todo: is this okay if it contains adjacent collinear edges?
	const faces_coords = faces_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	makeFacesWinding({ vertices_coords, faces_vertices })
		.map((winding, i) => (!winding ? i : undefined))
		.filter(f => f !== undefined)
		.forEach(f => faces_coords[f].reverse());
	const edges_boundingBox = makeEdgesBoundingBox({ edges_coords });
	const faces_bounds = faces_coords.map(coords => boundingBox(coords));
	// should be inclusive, positive epsilon, we are filtering out
	// edge face pairs which DEFINITELY don't overlap.
	for (let e = 0; e < matrix.length; e += 1) {
		if (!edges_boundingBox[e]) { continue; }
		for (let f = 0; f < matrix[e].length; f += 1) {
			if (matrix[e][f] === false) { continue; }
			if (!faces_bounds[f]) { continue; }
			if (!overlapBoundingBoxes(faces_bounds[f], edges_boundingBox[e], epsilon)) {
				matrix[e][f] = false;
				continue;
			}
		}
	}
	// edges similar. able to duplicate solutions to other edges if they exist.
	const edges_similar = makeEdgesEdgesSimilar({
		vertices_coords, edges_vertices, edges_coords, edges_boundingBox,
	});
	// compute overlap
	const finished_edges = {};
	for (let e = 0; e < matrix.length; e += 1) {
		if (finished_edges[e]) { continue; }
		if (!edges_coords[e]) { continue; }
		for (let f = 0; f < matrix[e].length; f += 1) {
			if (matrix[e][f] !== undefined) { continue; }
			if (!faces_coords[f]) { continue; }
			const point_in_poly = edges_coords[e]
				.map(point => overlapConvexPolygonPoint(
					faces_coords[f],
					point,
					exclude,
					1e-3,
				)).reduce((a, b) => a || b, false);
			if (point_in_poly) { matrix[e][f] = true; continue; }
			const edge_intersect = intersectConvexPolygonLine(
				faces_coords[f],
				{ vector: edges_vector[e], origin: edges_origin[e] },
				excludeS,
				excludeS,
				epsilon,
			);
			if (edge_intersect) { matrix[e][f] = true; continue; }
			matrix[e][f] = false;
		}
		edges_similar[e].forEach(adjacent_edge => {
			matrix[adjacent_edge] = matrix[e].slice();
			finished_edges[adjacent_edge] = true;
		});
	}
	return matrix
		.map(faces => faces
			.map((overlap, i) => (overlap ? i : undefined))
			.filter(i => i !== undefined));
};
