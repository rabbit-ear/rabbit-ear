/**
 * Rabbit Ear (c) Kraft
 */
import { booleanMatrixToUniqueIndexPairs } from "../../general/arrays";
import { makeFacesFacesOverlap } from "../../graph/overlap";
import { makeFacesWinding } from "../../graph/facesWinding";
// flip 1 and 2 to be the other, leaving 0 to be 0.
const make_conditions_flip_condition = { 0: 0, 1: 2, 2: 1 };
// neighbor faces determined by crease between them
const make_conditions_assignment_direction = {
	M: 1, m: 1, V: 2, v: 2,
};
/**
 * @description This is the initial step for building a set of conditions.
 * Store the relationships between all adjacent faces, built from
 * the crease assignment of the edge between the pair of faces, taking into
 * consideration if a face has been flipped (clockwise winding).
 * @param {FOLD} graph a FOLD object
 * @param {boolean[][]} overlap_matrix a 2D matrix relating faces to faces,
 * indicating if a faces overlaps another face
 * @param {boolean[]} faces_winding for every face, true or false
 * is the face upright or flipped?
 * @returns {object} keys are space-separated face pairs, like "3 17".
 * values are layer orientations, 0 (unknown) 1 (a above b) 2 (b above a).
 */
const makeFacePairsOrder = (graph, overlap_matrix, faces_winding) => {
	if (!faces_winding) {
		faces_winding = makeFacesWinding(graph);
	}
	if (!overlap_matrix) {
		overlap_matrix = makeFacesFacesOverlap(graph);
	}
	const facePairsOrder = {};
	// set all facePairsOrder (every pair of overlapping faces) initially to 0
	booleanMatrixToUniqueIndexPairs(overlap_matrix)
		.map(pair => pair.join(" "))
		.forEach(key => { facePairsOrder[key] = 0; });
	graph.edges_faces.forEach((faces, edge) => {
		// the crease assignment determines the order between pairs of faces.
		const assignment = graph.edges_assignment[edge];
		const local_order = make_conditions_assignment_direction[assignment];
		// skip boundary edges or edges with confusing assignments.
		if (faces.length < 2 || local_order === undefined) { return; }
		// face[0] is the origin face.
		// the direction of "m" or "v" will be inverted if face[0] is flipped.
		const upright = faces_winding[faces[0]];
		// now we know from a global perspective the order between the face pair.
		const global_order = upright
			? local_order
			: make_conditions_flip_condition[local_order];
		const key1 = `${faces[0]} ${faces[1]}`;
		const key2 = `${faces[1]} ${faces[0]}`;
		if (key1 in facePairsOrder) { facePairsOrder[key1] = global_order; }
		if (key2 in facePairsOrder) {
			facePairsOrder[key2] = make_conditions_flip_condition[global_order];
		}
	});
	return facePairsOrder;
};

export default makeFacePairsOrder;
