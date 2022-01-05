import math from "../../math";
import { make_faces_center } from "../../graph/make";
import { make_edges_edges_parallel_overlap } from "../../graph/edges_edges";
import {
	boolean_matrix_to_unique_index_pairs,
	boolean_matrix_to_indexed_array,
	make_unique_sets_from_self_relational_arrays,
} from "../../general/arrays";
import { invert_map } from "../../graph/maps";
import make_edges_faces_overlap from "../../graph/make_edges_faces_overlap";

const get_overlapping_edge_groups = (graph, epsilon) => invert_map(
	make_unique_sets_from_self_relational_arrays(
		boolean_matrix_to_indexed_array(
			make_edges_edges_parallel_overlap(graph, epsilon))))
	.filter(el => typeof el !== "number");

const edges_to_adjacent_faces = (graph, groups_edges) => groups_edges
	.map(edges => edges
		.map(edge => graph.edges_faces[edge]));

/**
 * @description classify a pair of adjacent faces encoded as +1 or -1
 * depending on which side they are on into one of 3 types:
 * - "both": tortilla (faces lie on both sides of the edge)
 * - "left": a taco facing left
 * - "right": a taco facing right
 */
const classify_faces_pair = (pair) => {
	if ((pair[0] === 1 && pair[1] === -1) ||
		(pair[0] === -1 && pair[1] === 1)) {
		return "both";
	}
	if ((pair[0] === 1 && pair[1] === 1)) { return "right"; }
	if ((pair[0] === -1 && pair[1] === -1)) { return "left"; }
};
const is_taco_taco = (classes) => {
	return classes[0] === classes[1] && classes[0] !== "both";
};
const is_tortilla_tortilla = (classes) => {
	return classes[0] === classes[1] && classes[0] === "both";
};
const is_taco_tortilla = (classes) => {
	return classes[0] !== classes[1]
		&& (classes[0] === "both" || classes[1] === "both");
};
const make_taco_tortilla = (face_pairs, types, faces_center) => {
	const direction = types[0] === "left" || types[1] === "left" ? -1 : 1;
	const taco = types[0] === "both" ? [...face_pairs[1]] : [...face_pairs[0]];
	// get only one side of the tortilla
	const index = types[0] === "both" ? 0 : 1;
	const tortilla = faces_center[index][0] === direction
		? face_pairs[index][0]
		: face_pairs[index][1];
	return { taco, tortilla };
}
/**
 * @description
 * @param {object} a FOLD graph. vertices_coords should already be folded.
 *
 * due to the face_center calculation to determine face-edge sidedness, this
 * is currently hardcoded to only work with convex polygons.
 */
const make_tacos_tortillas = (graph, epsilon) => {
  // find which edges are tacos
	const faces_center = make_faces_center(graph);
	const edges_origin = graph.edges_vertices
		.map(vertices => graph.vertices_coords[vertices[0]]);
	const edges_vector = graph.edges_vertices
		.map(vertices => math.core.subtract2(
			graph.vertices_coords[vertices[1]],
			graph.vertices_coords[vertices[0]],
		));
	const edges_faces_side = graph.edges_faces
		.map((faces, i) => faces
			.map(face => math.core.cross2(
				math.core.subtract2(
					faces_center[face],
					edges_origin[i]),
					edges_vector[i]))
			.map(cross => Math.sign(cross)));

	const edge_edge_overlap_matrix = make_edges_edges_parallel_overlap(graph, epsilon);
	const tacos_edges = boolean_matrix_to_unique_index_pairs(edge_edge_overlap_matrix)
		.filter(pair => pair
			.map(edge => graph.edges_faces[edge].length > 1)
			.reduce((a, b) => a && b, true));
	const tacos_faces = tacos_edges
		.map(pair => pair
			.map(edge => graph.edges_faces[edge]));

	const tacos_edge_coords = tacos_edges
		.map(edges => graph.edges_vertices[edges[0]]
			.map(vertex => graph.vertices_coords[vertex]));
	const tacos_edge_origin = tacos_edge_coords
		.map(coords => coords[0]);
	const tacos_edge_vector = tacos_edge_coords
		.map(coords => math.core.subtract2(coords[1], coords[0]));

	const tacos_faces_center = tacos_faces
		.map(faces => faces
			.map(face_pair => face_pair
				.map(face => faces_center[face])));

	const tacos_faces_side = tacos_faces_center
		.map((faces, i) => faces
			.map(pairs => pairs
				.map(center => math.core.cross2(
					math.core.subtract2(
						center,
						tacos_edge_origin[i]),
						tacos_edge_vector[i]))
				.map(cross => Math.sign(cross))));

	const tacos_types = tacos_faces_side
		.map((faces, i) => faces
			.map(classify_faces_pair));

	const taco_taco = tacos_types
		.map((pair, i) => is_taco_taco(pair) ? tacos_faces[i] : undefined)
		.filter(a => a !== undefined);
	const tortilla_tortilla = tacos_types
		.map((pair, i) => is_tortilla_tortilla(pair) ? tacos_faces[i] : undefined)
		.filter(a => a !== undefined);
	const aligned_taco_tortilla = tacos_types
		.map((pair, i) => is_taco_tortilla(pair)
			? make_taco_tortilla(tacos_faces[i], tacos_types[i], tacos_faces_side[i])
			: undefined)
		.filter(a => a !== undefined);

	// console.log("edge_edge_overlap_matrix", edge_edge_overlap_matrix);
	// console.log("tacos_edges", tacos_edges);
	// console.log("tacos_faces", tacos_faces);
	// console.log("tacos_faces_center", tacos_faces_center);
	// console.log("tacos_faces_side", tacos_faces_side);
	// console.log("tacos_types", tacos_types);

  // taco-tortillas overlap
  const edges_faces_overlap = make_edges_faces_overlap(graph, epsilon);
  const edges_overlap_faces = boolean_matrix_to_indexed_array(edges_faces_overlap)
    .map((faces, e) => edges_faces_side[e].length > 1
    	&& edges_faces_side[e][0] === edges_faces_side[e][1]
    		? faces
    		: []);
  const crossing_taco_tortillas = edges_overlap_faces
  	.map((tortillas, edge) => ({ taco: graph.edges_faces[edge], tortillas }))
  	.filter(el => el.tortillas.length);
  const crossing_taco_tortilla = crossing_taco_tortillas
  	.map(el => el.tortillas
  		.map(tortilla => ({ taco: [...el.taco], tortilla })))
  	.reduce((a, b) => a.concat(b), []);
  const taco_tortilla = aligned_taco_tortilla
  	.concat(crossing_taco_tortilla)
  	.sort((a, b) => a.tortilla - b.tortilla);

	// console.log("edges_faces_overlap", edges_faces_overlap);
	// console.log("edges_overlap_faces", edges_overlap_faces);
	// console.log("crossing_taco_tortillas", crossing_taco_tortillas);

	// console.log("edges_origin", edges_origin);
	// console.log("edges_vector", edges_vector);
	// console.log("edges_faces_side", edges_faces_side);

  return {
  	taco_taco,
  	tortilla_tortilla,
  	taco_tortilla,
  };
};

export default make_tacos_tortillas;
