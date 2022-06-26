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
import makeEdgesFacesOverlap from "../../graph/makeEdgesFacesOverlap";

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
const makeTacosTortillas = (graph, epsilon) => {
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
		.map(group => group
			.map(faces_side => faces_side[0] === faces_side[1]
				? faces_side[0]
				: 0));
	// maintain groups but filter types by left/right taco / tortilla.
	const groups_tacos_left = groups_tacos_edges
		.map((edges, i) => edges
			.filter((_, j) => groups_tacos_side[i][j] === -1));
	const groups_tacos_right = groups_tacos_edges
		.map((edges, i) => edges
			.filter((_, j) => groups_tacos_side[i][j] === 1));
	const groups_tortillas = groups_tacos_edges
		.map((edges, i) => edges
			.filter((_, j) => groups_tacos_side[i][j] === 0));

	// up until now, all taco data is stored as edge indices.
	// (except for face center / face-sidedness)
	// now, data will be converted into faces, which needs to happen because
	// taco-tortilla refers to one face from an edge. must convert to faces.

	// taco-taco
	// scissor join two arrays
	const taco_taco_edges = [];
	for (let i = 0; i < groups_tacos_edges.length; i++) {
		if (groups_tacos_left[i].length) { taco_taco_edges.push(groups_tacos_left[i]); }
		if (groups_tacos_right[i].length) { taco_taco_edges.push(groups_tacos_right[i]); }
	}
	const taco_taco = taco_taco_edges
		.filter(edges => edges.length > 1)
		.map(edges => edges
			.map(e => graph.edges_faces[e]));

	// tortilla-tortilla
	const tortilla_tortilla = groups_tortillas
		.map(edges => edges
			.map(e => graph.edges_faces[e]))
		.filter(group => group.length);

	// taco-tortilla
	const groups_tortillas_faces_left = groups_tacos_edges
		.map((group, i) => group
			.map((e, j) => graph.edges_faces[e]
				.filter((_, k) => groups_tacos_faces_side[i][j][k] === -1))
			.filter((_, j) => groups_tacos_side[i][j] === 0)
			.reduce((a, b) => a.concat(b), []));
	const groups_tortillas_faces_right = groups_tacos_edges
		.map((group, i) => group
			.map((e, j) => graph.edges_faces[e]
				.filter((_, k) => groups_tacos_faces_side[i][j][k] === 1))
			.filter((_, j) => groups_tacos_side[i][j] === 0)
			.reduce((a, b) => a.concat(b), []));
	const groups_taco_tortillas_left = groups_tortillas_faces_left
		.map((tortillas, i) => tortillas.length && groups_tacos_left[i].length
			? ({ tortillas, tacos: groups_tacos_left[i].map(e => graph.edges_faces[e]) })
			: undefined)
	const groups_taco_tortillas_right = groups_tortillas_faces_right
		.map((tortillas, i) => tortillas.length && groups_tacos_right[i].length
			? ({ tortillas, tacos: groups_tacos_right[i].map(e => graph.edges_faces[e]) })
			: undefined)
	// scissor join two arrays
	const aligned_taco_tortilla = [];
	for (let i = 0; i < groups_tacos_edges.length; i++) {
		if (groups_taco_tortillas_left[i] !== undefined) {
			aligned_taco_tortilla.push(groups_taco_tortillas_left[i]);
		}
		if (groups_taco_tortillas_right[i] !== undefined) {
			aligned_taco_tortilla.push(groups_taco_tortillas_right[i]);
		}
	}
	// taco-tortillas overlap
	const edges_faces_overlap = makeEdgesFacesOverlap(graph, epsilon);
	const edges_with_two_adjacent_faces = graph.edges_faces
		.map(faces => faces.length > 1);
	const edges_overlap_faces = booleanMatrixToIndexedArray(edges_faces_overlap)
		.map((faces, e) => edges_with_two_adjacent_faces[e] ? faces : []);
	const crossing_taco_tortillas = edges_overlap_faces
		.map((tortillas, edge) => ({ tacos: [graph.edges_faces[edge]], tortillas }))
		.filter(el => el.tortillas.length);
	const taco_tortilla = aligned_taco_tortilla.concat(crossing_taco_tortillas);

	// console.log("groups_edges", groups_edges);
	// console.log("groups_tacos_left", groups_tacos_left);
	// console.log("groups_tacos_right", groups_tacos_right);
	// console.log("taco_taco_edges", taco_taco_edges);
	// console.log("taco_taco", taco_taco);
	// console.log("edges_overlap_faces", edges_overlap_faces);
	// console.log("aligned_taco_tortilla", aligned_taco_tortilla);
	// console.log("crossing_taco_tortillas", crossing_taco_tortillas);

	return {
		taco_taco,
		tortilla_tortilla,
		taco_tortilla,
	};
};

export default makeTacosTortillas;
