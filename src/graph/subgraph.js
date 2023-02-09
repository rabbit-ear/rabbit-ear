/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../general/strings.js";
import remove from "./remove.js";
import count from "./count.js";
import { uniqueSortedNumbers } from "../general/arrays.js";
/**
 * @description Given a self-relational array like faces_faces or
 * vertices_vertices, and a list of indices with which to keep,
 * copy the array so that only those elements found in "indices"
 * are copied over, including the data in the inner most arrays.
 * This will produce an array with holes.
 * @param {number[][]} array_array a self-relational index array,
 * such as "faces_faces".
 * @param {number[]} indices a list of indices to keep.
 * @returns {number[][]} a copy of the array_array but excluding
 * all indices which were not included in the "indices" parameter set.
 */
export const selfRelationalArraySubset = (array_array, indices) => {
	// quick lookup, is an index to be included?
	const hash = {};
	indices.forEach(f => { hash[f] = true; });
	// only include those faces which are in the group, both at
	// the top level and inside the inside reference arrays.
	const array_arraySubset = [];
	indices.forEach(i => {
		array_arraySubset[i] = array_array[i].filter(j => hash[j]);
	});
	return array_arraySubset;
};

// maybe we can do this without copying the entire graph first.
// use the component arrays to bring over only what is necessary

// todo: this is still an early sketch. needs to be completed
export const subgraph = (graph, components) => {
	const remove_indices = {};
	const sorted_components = {};
	[S._faces, S._edges, S._vertices].forEach(key => {
		remove_indices[key] = Array.from(Array(count[key](graph))).map((_, i) => i);
		sorted_components[key] = uniqueSortedNumbers(components[key] || []).reverse();
	});
	Object.keys(sorted_components)
		.forEach(key => sorted_components[key]
			.forEach(i => remove_indices[key].splice(i, 1)));
	const res = JSON.parse(JSON.stringify(graph));
	Object.keys(remove_indices)
		.forEach(key => remove(res, key, remove_indices[key]));
	return res;
};
