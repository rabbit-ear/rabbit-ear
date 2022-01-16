import {
	make_edges_edges_crossing,
} from "../../graph/edges_edges";
import {
	boolean_matrix_to_indexed_array,
} from "../../general/arrays";

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

export const make_tortilla_tortilla_faces_crossing = (graph, edges_faces_side, epsilon) => {
	return make_tortilla_tortilla_edges_crossing(graph, edges_faces_side, epsilon)
		.map(el => ({
			tortilla_faces: graph.edges_faces[el.tortilla_edge],
			crossing_faces: el.crossing_edges.map(edge => graph.edges_faces[edge]),
		}))
		.map(el => el.crossing_faces
			// note, adjacent_faces could be singular in the case of a boundary edge,
			// and this is still valid.
			.map(adjacent_faces => adjacent_faces
				.map(face => [el.tortilla_faces, [face, face]]))
			.reduce((a, b) => a.concat(b), []))
		.reduce((a, b) => a.concat(b), []);
};
