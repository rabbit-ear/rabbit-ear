/**
 * Rabbit Ear (c) Kraft
 */
import { makeEdgesEdgesCrossing } from "../../graph/edgesEdges";
import { makeEdgesFaces } from "../../graph/make";
import { booleanMatrixToIndexedArray } from "../../general/arrays";
/**
 * @desecription given a FOLD object in its folded state (vertices_coords),
 * a pre-built +1/-1 face relationship matrix, gather together all edges
 * that cross each other, where "crossing" means overlaps but not parallel.
 * compare each edge to each edge by focusing on their adjacent face(s).
 * If one face is defined (in the matrix) to be above or below one of the
 * other edge's faces, we can set all the adjacent faces of these two edges
 * to follow the same rule.
 *
 * The similar test where we compare edges which overlap and ARE parallel
 * is the taco-taco/tortilla test. This is a different function, located in
 * make_edges_tacos_layers_faces.
 */
export const make_edges_crossing_layer_matrix = (graph, face_matrix, epsilon) => {
	const edges_faces = graph.edges_faces
		? graph.edges_faces
		: makeEdgesFaces(graph);
	const edges_edges_overlap = booleanMatrixToIndexedArray(
		makeEdgesEdgesCrossing(graph, epsilon),
	);
	// TODO
	// from this point on, keep a catalog of every face that gets updated,
	// and every face that wasn't able to update due to lack of information.
	// we need to allow for a face that got passed over due to lack of info
	// to be able to be revisited and worked upon if new information was uncovered
	// const faces_did_update = {};
	// const faces_not_updated = {};
	// for every edge-edge pair overlap, get all adjacent faces involved
	// (each should have 1 or 2, 1 for boundary edges). check the face_matrix
	// for any rules about faces orders between any of these faces.
	// if no rules exist, we can't do anything. skip.
	// if at least one rule exists, set all other faces to obey the same rule,
	// meaning, if edge1's face is below edge2, then all of edge1's faces
	// must be below all of edge2's faces.
	const edge_matrix = edges_edges_overlap.map(() => []);
	edges_edges_overlap
		.forEach((row, e1) => row
			.forEach(e2 => edges_faces[e1]
				.forEach(f1 => edges_faces[e2]
					.filter(f2 => face_matrix[f1][f2] != null)
					.forEach(f2 => { edge_matrix[e1][e2] = face_matrix[f1][f2]; }))));
	return edge_matrix;
};

/**
 * @returns {number[][]} array of relationships: [f1, f2, dir]
 */
export const make_edges_crossing_face_orders = (graph, matrix, epsilon) => {
	const orders = [];
	make_edges_crossing_layer_matrix(graph, matrix, epsilon)
		.forEach((row, e1) => row
			.forEach((rule, e2) => graph.edges_faces[e1]
				.forEach(f1 => graph.edges_faces[e2]
					.forEach(f2 => orders.push([f1, f2, rule], [f2, f1, -rule])))));
	return orders;
};
