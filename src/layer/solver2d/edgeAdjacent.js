/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Given a FOLD graph, already folded, find the layer arrangement
 * between neighboring faces (using edges_faces), and assign this facePair
 * a 1 or 2, checking whether faces have been flipped or not.
 * @param {FOLD} graph a FOLD object
 * @param {string[]} facePairs an array of space-separated face-pair strings
 * @returns {object} an object describing all the solved facePairs (keys) and
 * their layer order 1 or 2 (value), the object only includes those facePairs
 * which are solved, so, no 0-value entries will exist.
 * @linkcode Origami ./src/layer/solver2d/makeFacePairsOrder.js 88
 */
const solveEdgeAdjacent = ({
	edges_faces, edges_assignment,
}, facePairs, faces_winding) => {
	// flip 1 and 2 to be the other, leaving 0 to be 0.
	const flipCondition = { 0: 0, 1: 2, 2: 1 };
	// neighbor faces determined by crease between them
	const assignmentOrder = { M: 1, m: 1, V: 2, v: 2 };
	// quick lookup for face-pairs
	const facePairsHash = {};
	facePairs.forEach(key => { facePairsHash[key] = true; });
	// "solution" contains solved orders (1, 2) for face-pair keys.
	const solution = {};
	edges_faces.forEach((faces, edge) => {
		// the crease assignment determines the order between pairs of faces.
		const assignment = edges_assignment[edge];
		const localOrder = assignmentOrder[assignment];
		// skip boundary edges or edges with confusing assignments.
		if (faces.length < 2 || localOrder === undefined) { return; }
		// face[0] is the origin face.
		// the direction of "m" or "v" will be inverted if face[0] is flipped.
		const upright = faces_winding[faces[0]];
		// now we know from a global perspective the order between the face pair.
		const globalOrder = upright
			? localOrder
			: flipCondition[localOrder];
		// todo: are all face order pairs sorted? do we need to check 2 like this?
		const key1 = `${faces[0]} ${faces[1]}`;
		const key2 = `${faces[1]} ${faces[0]}`;
		if (key1 in facePairsHash) { solution[key1] = globalOrder; }
		if (key2 in facePairsHash) {
			solution[key2] = flipCondition[globalOrder];
		}
	});
	return solution;
};

export default solveEdgeAdjacent;
