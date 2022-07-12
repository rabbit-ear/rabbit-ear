/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @param {number[][]} matrix of relationships between faces.
 * @param {number} from. index of face. will be "above/below" the "to" face.
 * @param {number} to. index of face. the other face in the comparison.
 * @param {number} 1 or -1. there are two ways to walk through the faces,
 *  either always down or always up. 1 means walking down because
 *  face "from" will be set to be above face "to".
 * @returns {number[][]} array of relationships where each relationship is
 * an array of 3 items: face index A and B, and the relationship: -1, 0, 1.
 */
export const walk_pleat_path = (matrix, from, to, direction, visited = {}) => {
	// we only need to check one arrangement
	const from_to = `${from} ${to}`;
	if (visited[from_to] || from === to) { return []; }
	// but we want to set both arrangements
	visited[from_to] = true;
	visited[`${to} ${from}`] = true;
	// set matrix for both directions between face pair
	// gather the next iteration's indices, recurse.
	return matrix[to]
		.map((dir, index) => (dir === direction ? index : undefined))
		.filter(a => a !== undefined)
		.map(index => walk_pleat_path(matrix, from, index, direction, visited))
		.reduce((a, b) => a.concat(b), [])
		.concat([[from, to, direction], [to, from, -direction]]);
};
/**
 * @description starting from every face, for both "above" and "below",
 * walk adjacent faces by only visiting faces in the consistent direction.
 * this is analogous to walking from face to face down a mountain-valley pleat
 * where we can be certain that faces are above/below the starting face.
 *
 * this all only works with simple folds, origami without cycles.
 * todo: "cycles", what is the word i'm looking for?
 * @returns {number[][]} array of relationships where each relationship is
 * an array of 3 items: face index A and B, and the relationship: -1, 0, 1.
 */
export const walk_all_pleat_paths = matrix => matrix
	.map((_, from) => [-1, 0, 1]
		.map(direction => matrix[from]
			.map((dir, i) => (dir === direction ? i : undefined))
			.filter(a => a !== undefined)
			.map(to => walk_pleat_path(matrix, from, to, direction))
			.reduce((a, b) => a.concat(b), []))
		.reduce((a, b) => a.concat(b), []))
	.reduce((a, b) => a.concat(b), []);
// export const walk_all_pleat_paths = (matrix) => {
//   return matrix
//     .map((_, from) => {
//       const visited = {};
//       return [-1, 0, 1]
//       .map(direction => matrix[from]
//         .map((dir, i) => dir === direction ? i : undefined)
//         .filter(a => a !== undefined)
//         .map(to => walk_pleat_path(matrix, from, to, direction, visited))
//         .reduce((a, b) => a.concat(b), []))
//       .reduce((a, b) => a.concat(b), [])
//     })
//     .reduce((a, b) => a.concat(b), []);
// };
