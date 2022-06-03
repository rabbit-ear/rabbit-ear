/**
 * Rabbit Ear (c) Kraft
 */
import { walk_all_pleat_paths } from "./pleat_paths";
import {
	faces_layer_to_relationships,
	common_relationships,
} from "./relationships";
import { make_edges_crossing_face_orders } from "./edges_crossing";
import make_edges_tacos_layers_faces from "./make_edges_tacos_layers_faces";
import { invert_map } from "../../graph/maps";
import make_vertices_faces_layer from "../../graph/vertices_faces_layer";
import get_layer_violations from "./get_layer_violations";

const matrix_count = (matrix) => {
	let count = 0;
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix.length; j++) {
			if (matrix[i][j] !== undefined) { count++; }
		}
	}
	return count;
};
/**
 * @description perform a layer solver on all vertices indipendently,
 * for each vertex, the result will be 1 or many solutions (hopefully not 0).
 * layer solutions come in the form of key/value: { face: layer }
 * and layers are only locally distributed 0...n.
 * gather all together and assign them to a matrix that relates NxN faces
 * with a value -1, 0, 1, declaring if face[i] is above face[i][j].
 */
const make_face_layer_matrix = (graph, face, epsilon) => {
	const add_relationship = order => matrix[order[0]][order[1]] = order[2];
	// todo: using faces_vertices to get face count?
	const matrix = Array
		.from(Array(graph.faces_vertices.length))
		.map(() => Array(graph.faces_vertices.length));

	// each single-vertex layer order, individually
	const vertices_faces_layer = make_vertices_faces_layer(graph, face, epsilon);
	// extract all the solutions at vertices where there is only one solution
	// we can be absolutely certain about these rules.
	vertices_faces_layer
		.filter(solutions => solutions.length === 1)
		.map(solutions => solutions[0])
		.map(faces_layer_to_relationships)
		.forEach(group => group
			.forEach(add_relationship));

	// console.log("vertices", matrix_count(matrix));
	// complex cases have more than one solution, but among all their solutions,
	// there are consistent rules that are true among all solutions. find those.
	vertices_faces_layer
		.filter(solutions => solutions.length > 1)
		.map(common_relationships)
		.forEach(group => group
			.forEach(add_relationship));

	// console.log("vertices generalized", matrix_count(matrix));

	// next, walk adjacent faces down mountain-valley pleats.
	walk_all_pleat_paths(matrix)
		.forEach(add_relationship);

	// console.log("walk", matrix_count(matrix));

	// adjacent faces of crossing (non-parallel) edges
	// should be on either side of each other
	make_edges_crossing_face_orders(graph, matrix, epsilon)
		.forEach(add_relationship);

	// console.log("taco tortillas", matrix_count(matrix));

	make_edges_tacos_layers_faces(graph, matrix, epsilon)
		.map(layers_faces => layers_faces.map(invert_map))
		.map(faces_layers => common_relationships(faces_layers))
		.forEach(group => group
			.forEach(add_relationship));

	// console.log("taco tacos", matrix_count(matrix));

	// sometimes, new pleat paths have opened up. walk again.
	walk_all_pleat_paths(matrix)
		.forEach(add_relationship);

	// console.log("walk again", matrix_count(matrix));

	make_edges_crossing_face_orders(graph, matrix, epsilon)
		.forEach(add_relationship);

	// console.log("taco tortillas again", matrix_count(matrix));

	vertices_faces_layer
		.filter(solutions => solutions.length > 1)
		.map(solutions => solutions
			.filter(solution => get_layer_violations(matrix, solution).length === 0))
		.map(common_relationships)
		.forEach(group => group
			.forEach(add_relationship));

	// console.log("vertices generalized again", matrix_count(matrix));

	walk_all_pleat_paths(matrix)
		.forEach(add_relationship);

	// console.log("walk again again", matrix_count(matrix));

	make_edges_tacos_layers_faces(graph, matrix, epsilon)
		.map(layers_faces => layers_faces.map(invert_map))
		.map(faces_layers => common_relationships(faces_layers))
		.forEach(group => group
			.forEach(add_relationship));

	// console.log("taco tacos again", matrix_count(matrix));

	vertices_faces_layer
		.filter(solutions => solutions.length > 1)
		.map(solutions => solutions
			.filter(solution => get_layer_violations(matrix, solution).length === 0))
		.map(common_relationships)
		.forEach(group => group
			.forEach(add_relationship));

	// console.log("vertices generalized again", matrix_count(matrix));

	walk_all_pleat_paths(matrix)
		.forEach(add_relationship);

	// console.log("walk again again", matrix_count(matrix));

	return matrix;
};

export default make_face_layer_matrix;
