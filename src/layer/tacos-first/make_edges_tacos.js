/**
 * Rabbit Ear (c) Kraft
 */
import math from "../../math";
import { makeFacesCenter } from "../../graph/make";
import { makeEdgesEdgesParallelOverlap } from "../../graph/edgesEdges";
import {
	booleanMatrixToIndexedArray,
	makeSelfRelationalArrayClusters,
} from "../../general/arrays";
import { invertMap } from "../../graph/maps";

const get_overlapping_edge_groups = (graph, epsilon) => invertMap(
	makeSelfRelationalArrayClusters(
		booleanMatrixToIndexedArray(
			makeEdgesEdgesParallelOverlap(graph, epsilon))))
	.filter(el => typeof el !== "number");

const edges_to_adjacent_faces = (graph, groups_edges) => groups_edges
	.map(edges => edges
		.map(edge => graph.edges_faces[edge]));
/**
 * @description
 * @param {object} a FOLD graph. vertices_coords should already be folded.
 */
const make_edges_tacos = (graph, epsilon) => {
	const faces_center = makeFacesCenter(graph);
	const groups_edges = get_overlapping_edge_groups(graph, epsilon);
	const groups_edges_faces = edges_to_adjacent_faces(graph, groups_edges);
	// filter out edges which only have one face (boundary edges). ignore them.
	// they are folded tacos with only one side, there is no threat of
	// tortillas intersection, as their edge is aligned with the fold edge.
	const groups_tacos_edges = groups_edges
		.map((group, i) => group
			.filter((_, j) => groups_edges_faces[i][j].length > 1))
		.filter(arr => arr.length > 0);
	// console.log("groups_tacos_edges", groups_tacos_edges);
	const groups_tacos_faces = groups_edges_faces
		.map(group => group
			.filter(el => el.length > 1))
		.filter(arr => arr.length > 0);
	// each group of taco edges are aligned along a common edge.
	// get this edge coordinates, vector, origin.
	const groups_tacos_edge_coords = groups_tacos_edges
		.map(edges => graph.edges_vertices[edges[0]]
			.map(vertex => graph.vertices_coords[vertex]));
	const groups_tacos_edge_origin = groups_tacos_edge_coords
		.map(coords => coords[0]);
	const groups_tacos_edge_vector = groups_tacos_edge_coords
		.map(coords => math.core.subtract2(coords[1], coords[0]));
	const groups_tacos_faces_center = groups_tacos_faces
		.map(faces => faces
			.map(face_pair => face_pair
				.map(face => faces_center[face])));
	const groups_tacos_faces_side = groups_tacos_faces_center
		.map((faces, i) => faces
			.map(pairs => pairs
				.map(center => math.core.cross2(
					math.core.subtract2(center, groups_tacos_edge_origin[i]),
					groups_tacos_edge_vector[i]))
				.map(cross => Math.sign(cross))));
	// turn every taco into a -1 or 1, depending on its direction,
	// or a 0 in the case of a tortilla.
	const groups_tacos_side = groups_tacos_faces_side
		.map(faces => faces
			.map(pairs => pairs[0] === pairs[1]
				? pairs[0]
				: 0));
	const groups_left_taco_count = groups_tacos_side
		.map(sides => sides.filter(side => side === 1).length);
	const groups_right_taco_count = groups_tacos_side
		.map(sides => sides.filter(side => side === -1).length);
	const groups_tortilla_count = groups_tacos_side
		.map(sides => sides.filter(side => side === 0).length);
	// a group already passes the test if it has no tortillas and only
	// one of each left / right tacos.
	const groups_easy_valid = groups_tortilla_count
		.map((count, i) => groups_left_taco_count[i] + count < 2
			&& groups_right_taco_count[i] + count < 2);
	// console.log("groups_easy_valid", groups_easy_valid);
	const tacos = groups_tacos_edges.map((edges, i) => ({
		left: edges.filter((_, j) => groups_tacos_side[i][j] === -1),
		right: edges.filter((_, j) => groups_tacos_side[i][j] === 1),
		both: edges.filter((_, j) => groups_tacos_side[i][j] === 0),
	})).filter((_, i) => groups_easy_valid[i] === false);
	tacos.edges = invertMap(groups_tacos_edges);
	return tacos;
		// .map(el => {
		// 	if (el.left.length === 0) { delete el.left; }
		// 	if (el.right.length === 0) { delete el.right; }
		// 	if (el.both.length === 0) { delete el.both; }
		// 	return el;
		// });
};

export default make_edges_tacos;
