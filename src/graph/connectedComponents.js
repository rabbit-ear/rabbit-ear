/**
 * Rabbit Ear (c) Kraft
 */

/**
 * @description Given a self-relational array of arrays, for example,
 * vertices_vertices, edges_edges, faces_faces, where the values in the
 * inner arrays relate to the indices of the outer array, create
 * collection groups where each item is included in a group if it
 * points to another member in that group.
 * The result will be in the form of an array matching in length the
 * number of components, for each component, the value is its group number.
 * @param {number[][]} array_array an array of arrays of numbers
 * @returns {number[]} component array, the value is the group number
 * @linkcode Origami ./src/graph/connectedComponents.js 12
 */
export const connectedComponents = (array_array) => {
	const components = [];
	const recurse = (index, currentGroup) => {
		// do not increment components if this
		if (components[index] !== undefined) { return 0; }
		components[index] = currentGroup;
		array_array[index].forEach(i => recurse(i, currentGroup));
		// increment group (the index in "components") for next round
		return 1;
	};
	for (let row = 0, group = 0; row < array_array.length; row += 1) {
		if (!(row in array_array)) { continue; }
		group += recurse(row, group);
	}
	return components;
};

/**
 * @description Given a self-relational array of arrays, for example,
 * vertices_vertices, edges_edges, faces_faces, where the values in the
 * inner arrays relate to the indices of the outer array, create a list of
 * all pairwise combinations of connected indices. All pairs are sorted
 * so that for [i, j], i <= j. This allows for circular references (i === j).
 * @param {number[][]} array_array an array of arrays of integers
 * @returns {number[][]} array of two-dimensional array pairs of indices.
 * @linkcode Origami ./src/general/arrays.js 128
 */
export const connectedComponentsPairs = (array_array) => {
	const circular = [];
	const pairs = [];
	array_array.forEach((arr, i) => arr.forEach(j => {
		if (i < j) { pairs.push([i, j]); }
		if (i === j && !circular[i]) {
			circular[i] = true;
			pairs.push([i, j]);
		}
	}));
	return pairs;
};
