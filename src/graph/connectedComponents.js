/**
 * Rabbit Ear (c) Kraft
 */

// or should there be a function called
// get_connected_components
// that returns all connected components, provided no additional arguments

/**
 * @description given a vertex, this will traverse adjacent edges and collect
 * all connected vertices.
 * The idea is that if there are two or more separated graphs, this is
 * meant to find them.
 */
// export const getConnectedVertices = ({ vertices_vertices }) => {
// };
/**
 * @description given a self-relational array of arrays, for example,
 * vertices_vertices, edges_edges, faces_faces, where the values in the
 * inner arrays relate to the indices of the outer array, create collection groups
 * where each item is included in a group if it points to another member
 * in that group.
 * @param {number[][]} matrix an array of arrays of numbers
 * @returns {number[][]} groups of the indices where each index appears only once
 * @linkcode Origami ./src/graph/connectedComponents.js 25
 */
export const connectedComponentsArray = (array_array) => {
	const groups = [];
	const recurse = (index, current_group) => {
		if (groups[index] !== undefined) { return 0; }
		groups[index] = current_group;
		array_array[index].forEach(i => recurse(i, current_group));
		return 1; // increment group # for next round
	};
	for (let row = 0, group = 0; row < array_array.length; row += 1) {
		if (!(row in array_array)) { continue; }
		group += recurse(row, group);
	}
	return groups;
};
