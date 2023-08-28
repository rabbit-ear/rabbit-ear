/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description given a self-relational array of arrays, for example,
 * vertices_vertices, edges_edges, faces_faces, where the values in the
 * inner arrays relate to the indices of the outer array, create
 * collection groups where each item is included in a group if it
 * points to another member in that group.
 * For example, if you run this with vertices_vertices, the result will
 * be an array the length of vertices, and each value will be 0...N-1,
 * where N is the number of disjoint groups. so, all values will be 0
 * in the case of a connected graph.
 * @param {number[][]} array_array an array of arrays of numbers
 * @returns {number[][]} groups of the indices where each index appears only once
 * @linkcode Origami ./src/graph/connectedComponents.js 12
 */
const connectedComponents = (array_array) => {
	const groups = [];
	const recurse = (index, current_group) => {
		// do not increment groups if this
		if (groups[index] !== undefined) { return 0; }
		groups[index] = current_group;
		array_array[index].forEach(i => recurse(i, current_group));
		// increment group (the index in "groups") for next round
		return 1;
	};
	for (let row = 0, group = 0; row < array_array.length; row += 1) {
		if (!(row in array_array)) { continue; }
		group += recurse(row, group);
	}
	return groups;
};

export default connectedComponents;
