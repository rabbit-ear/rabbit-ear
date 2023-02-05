/**
 * Rabbit Ear (c) Kraft
 */
import count from "./count.js";
import { uniqueSortedNumbers } from "../general/arrays.js";
import {
	getGraphKeysWithSuffix,
	getGraphKeysWithPrefix,
} from "../fold/spec.js";
import Messages from "../environment/messages.json";
/**
 * @name replace
 * @memberof graph
 * @description Replaces vertices, edges, or faces (or anything really)
 * replace elements from inside arrays, shift up remaining components,
 * and updates all relevant references across other arrays due to shifting.
 * @param {FOLD} graph a FOLD object
 * @param {string} key like "vertices", the prefix of the arrays
 * @param {number[]} replaceIndices an array of vertex indices, like [1,9,25]
 * @returns {number[]} a map of changes to the graph
 * @example replace(foldObject, "vertices", [2,6,11,15]);
 * @example
 * for example: removing index 5 from a 10-long vertices list will shift all
 * indices > 5 up by one, and then will look through all other arrays like
 * edges_vertices, faces_vertices and update any reference to indices 6-9
 * to match their new positions 5-8.
 *
 * this can handle removing multiple indices at once; and is faster than
 * otherwise calling this multiple times with only one or a few removals.
 * @linkcode Origami ./src/graph/replace.js 30
 */
// replaceIndices: [4:3, 7:5, 8:3, 12:3, 14:9] where keys are indices to remove
const replaceGeometryIndices = (graph, key, replaceIndices) => {
	const geometry_array_size = count(graph, key);
	// make sure replace indices are well-formed. values cannot be larger than keys.
	// if this is the case, flip the index/value, assuming the two geometry items
	// are interchangeable and it doesn't matter which one we remove, but warn
	// the user that this took place.
	let didModify = false;
	Object.entries(replaceIndices)
		.filter(([index, value]) => index < value)
		.forEach(([index, value]) => {
			didModify = true;
			delete replaceIndices[index];
			replaceIndices[value] = index;
		});
	if (didModify) {
		console.warn(Messages.replaceModifyParam);
	}
	const removes = Object.keys(replaceIndices).map(n => parseInt(n, 10));
	const replaces = uniqueSortedNumbers(removes);
	const index_map = [];
	for (let i = 0, j = 0, walk = 0; i < geometry_array_size; i += 1, j += 1) {
		while (i === replaces[walk]) {
			// this prevents arrays with holes
			index_map[i] = index_map[replaceIndices[replaces[walk]]];
			if (index_map[i] === undefined) {
				throw new Error(Messages.replaceUndefined);
			}
			i += 1;
			walk += 1;
		}
		if (i < geometry_array_size) { index_map[i] = j; }
	}
	// update every component that points to vertices_coords
	// these arrays do not change their size, only their contents
	getGraphKeysWithSuffix(graph, key)
		.forEach(sKey => graph[sKey]
			.forEach((_, ii) => graph[sKey][ii]
				.forEach((v, jj) => { graph[sKey][ii][jj] = index_map[v]; })));
	// update every array with a 1:1 relationship to vertices_ arrays
	// these arrays do change their size, their contents are untouched
	replaces.reverse();
	getGraphKeysWithPrefix(graph, key)
		.forEach((prefix_key) => replaces
			.forEach(index => graph[prefix_key]
				.splice(index, 1)));
	return index_map;
};

export default replaceGeometryIndices;
