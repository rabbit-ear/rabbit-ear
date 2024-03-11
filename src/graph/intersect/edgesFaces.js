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
// 			).overlap).reduce((a, b) => a || b, false);
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
