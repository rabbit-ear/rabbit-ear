/**
 * Rabbit Ear (c) Kraft
 */
// flip 1 and 2 to be the other, leaving 0 to be 0.
const make_conditions_flip_condition = { 0: 0, 1: 2, 2: 1 };
// neighbor faces determined by crease between them
const make_conditions_assignment_direction = {
	M: 1, m: 1, V: 2, v: 2,
};
/**
 * @description Given a FOLD graph, already folded, find the layer arrangement
 * between neighboring faces (using edges_faces), and assign this facePair
 * a 1 or 2, checking whether faces have been flipped or not.
 * @param {FOLD} graph a FOLD graph
 * @param {string[]} facePairs an array of space-separated face-pair strings
 * @returns {object} an object describing all the solved facePairs (keys) and
 * their layer order 1 or 2 (value), the object only includes those facePairs
 * which are solved, so, no 0-value entries will exist.
 * @linkcode Origami ./src/layer/solver2d/makeFacePairsOrder.js 88
 */
const solveEdgeAdjacent = ({
	edges_faces, edges_assignment,
}, facePairs, faces_winding) => {
	const facePairsHash = {};
	facePairs.forEach(key => { facePairsHash[key] = true; });
	const solution = {};
	edges_faces.forEach((faces, edge) => {
		// the crease assignment determines the order between pairs of faces.
		const assignment = edges_assignment[edge];
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
		if (key1 in facePairsHash) { solution[key1] = global_order; }
		if (key2 in facePairsHash) {
			solution[key2] = make_conditions_flip_condition[global_order];
		}
	});
	return solution;
};

export default solveEdgeAdjacent;
