/**
 * Rabbit Ear (c) Kraft
 */
import math from "../../math";
import { make_faces_polygon } from "../../graph/make";
import { make_faces_winding } from "../../graph/faces_winding";
import { make_edges_edges_crossing } from "../../graph/edges_edges";
import { boolean_matrix_to_indexed_array } from "../../general/arrays";
/**
 * @description make_tortilla_tortilla_edges_crossing
 * @param {object} graph a FOLD object graph
 * @param {todo} todo todo
 * @param {number} [epsilon=1e-6] optional epsilon value
 * @returns todo
 */
export const make_tortilla_tortilla_edges_crossing = (graph, edges_faces_side, epsilon) => {
	// get all tortilla edges. could also be done by searching
	// "edges_assignment" for all instances of F/f. perhaps this way is better.
	const tortilla_edge_indices = edges_faces_side
		.map(side => side.length === 2 && side[0] !== side[1])
		.map((bool, i) => bool ? i : undefined)
		.filter(a => a !== undefined);
	// get all edges which cross these tortilla edges. these edges can even be
	// boundary edges, it doesn't matter how many adjacent faces they have.
	const edges_crossing_matrix = make_edges_edges_crossing(graph, epsilon);
	const edges_crossing = boolean_matrix_to_indexed_array(edges_crossing_matrix);
	// parallel arrays. tortilla_edge_indices contains the edge index.
	// tortilla_edges_crossing contains an array of the crossing edge indices.
	const tortilla_edges_crossing = tortilla_edge_indices
		.map(i => edges_crossing[i]);
	// combine parallel arrays into one object.
	// tortilla_edge is a number. crossing_edges is an array of numbers.
	return tortilla_edges_crossing.map((edges, i) => ({
		tortilla_edge: tortilla_edge_indices[i],
		crossing_edges: edges,
	})).filter(el => el.crossing_edges.length);
};

export const make_tortillas_faces_crossing = (graph, edges_faces_side, epsilon) => {
	const faces_winding = make_faces_winding(graph);
	const faces_polygon = make_faces_polygon(graph, epsilon);
	for (let i = 0; i < faces_polygon.length; i++) {
		if (!faces_winding[i]) { faces_polygon[i].reverse(); }
	}
	const tortilla_edge_indices = edges_faces_side
		.map(side => side.length === 2 && side[0] !== side[1])
		.map((bool, i) => bool ? i : undefined)
		.filter(a => a !== undefined);
	const edges_coords = tortilla_edge_indices
		.map(e => graph.edges_vertices[e])
		.map(edge => edge
			.map(vertex => graph.vertices_coords[vertex]));
	const edges_vector = edges_coords
		.map(coords => math.core.subtract2(coords[1], coords[0]));
	const matrix = [];
	tortilla_edge_indices.forEach(e => { matrix[e] = []; });
	// console.log("clip", tortilla_edge_indices
		// .map((e, ei) => faces_polygon
		// 	.map((poly, f) => math.core.clip_line_in_convex_polygon(
		// 		poly,
		// 		edges_vector[ei],
		// 		edges_coords[ei][0],
		// 		math.core.exclude,
		// 		math.core.exclude_s,
		// 		epsilon))));
	const result = tortilla_edge_indices
		.map((e, ei) => faces_polygon
			.map((poly, f) => math.core.clip_line_in_convex_polygon(
				poly,
				edges_vector[ei],
				edges_coords[ei][0],
				math.core.exclude,
				math.core.exclude_s,
				epsilon))
			.map((result, f) => result !== undefined));
	// const result = tortilla_edge_indices
	// 	.map((e, ei) => faces_polygon
	// 		.map((poly, f) => math.core.intersect_convex_polygon_line(
	// 			poly,
	// 			edges_vector[ei],
	// 			edges_coords[ei][0],
	// 			math.core.exclude_s,
	// 			math.core.include_l ))
	// 			// epsilon))
	// 		.map((result, f) => result !== undefined));
	result.forEach((faces, ei) => faces
		.forEach((overlap, f) => {
			if (overlap) {
				matrix[tortilla_edge_indices[ei]].push(f);
			}
		}));
	// console.log("faces_polygon", faces_polygon);
	// console.log("tortilla_edge_indices", tortilla_edge_indices);
	// console.log("edges_coords", edges_coords);
	// console.log("edges_vector", edges_vector);
	// console.log("result", result);
	// console.log("matrix", matrix);
	return matrix;
}

export const make_tortilla_tortilla_faces_crossing = (graph, edges_faces_side, epsilon) => {
	const tortilla_tortilla_edges = make_tortilla_tortilla_edges_crossing(graph, edges_faces_side, epsilon);
	// console.log("tortilla_tortilla_edges", tortilla_tortilla_edges);
	const tortillas_faces_crossing = make_tortillas_faces_crossing(graph, edges_faces_side, epsilon);
	const tortilla_faces_results = tortillas_faces_crossing
		.map((faces, e) => faces.map(face => [graph.edges_faces[e], [face, face]]))
		.reduce((a, b) => a.concat(b), []);

	// const tortilla_tortilla_results = tortilla_tortilla_edges
	// 	.map(el => ({
	// 		tortilla_faces: graph.edges_faces[el.tortilla_edge],
	// 		crossing_faces: el.crossing_edges.map(edge => graph.edges_faces[edge]),
	// 	}))
	// 	.map(el => el.crossing_faces
	// 		// note, adjacent_faces could be singular in the case of a boundary edge,
	// 		// and this is still valid.
	// 		.map(adjacent_faces => adjacent_faces
	// 			.map(face => [el.tortilla_faces, [face, face]]))
	// 		.reduce((a, b) => a.concat(b), []))
	// 	.reduce((a, b) => a.concat(b), []);
	// console.log("tortillas_faces_crossing", tortillas_faces_crossing);
	// console.log("tortilla_tortilla_results", tortilla_tortilla_results);
	// console.log("tortilla_faces_results", tortilla_faces_results);
	// return tortilla_tortilla_results;
	return tortilla_faces_results;
};
