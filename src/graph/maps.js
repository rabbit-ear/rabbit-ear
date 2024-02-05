/**
 * Rabbit Ear (c) Kraft
 */
import {
	filterKeysWithSuffix,
	filterKeysWithPrefix,
} from "../fold/spec.js";

/**
 * @description Invert an array of integer values where
 * values become indices and the top level indices become values.
 * If indices and values are not bijective, values will be overwritten.
 * @param {number[]} map an array of integers
 * @returns {number[]} the inverted array
 * @linkcode
 */
export const invertFlatMap = (map) => {
	const inv = [];
	map.forEach((n, i) => { inv[n] = i; });
	return inv;
};

/**
 * @description Invert an array of arrays of integer values where
 * values become indices and the top level indices become values.
 * If indices and values are not bijective, values will be overwritten.
 * @param {number[][]} map an array of arrays of integers
 * @returns {number[]} the inverted flat array
 * @linkcode
 */
export const invertArrayToFlatMap = (map) => {
	const inv = [];
	map.forEach((arr, i) => arr.forEach(n => { inv[n] = i; }));
	return inv;
};

/**
 * @description Invert an array of integer values where values become indices
 * and the indices are stored inside array values.
 * This ensures that for non-bijective maps, no data is lost.
 * @param {number[]} map an array of integers
 * @returns {number[][]} the inverted array of arrays of integers
 * @linkcode
 */
export const invertFlatToArrayMap = (map) => {
	const inv = [];
	map.forEach((n, i) => {
		if (inv[n] === undefined) { inv[n] = []; }
		inv[n].push(i);
	});
	return inv;
};

/**
 * @description Invert an array of arrays of integer values where
 * values become indices and indices are stored inside array values.
 * This ensures that for non-bijective maps, no data is lost.
 * @param {number[][]} map an array of arrays of integers
 * @returns {number[][]} the inverted array of arrays of integers
 * @linkcode
 */
export const invertArrayMap = (map) => {
	const inv = [];
	map.forEach((arr, i) => arr.forEach(m => {
		if (inv[m] === undefined) { inv[m] = []; }
		inv[m].push(i);
	}));
	return inv;
};

/**
 * @description Provide two or more simple nextmaps in the order
 * they were made and this will merge them into one nextmap which
 * reflects all changes to the graph.
 * @param {...number[]} ...maps a sequence of simple nextmaps
 * @returns {number[]} one nextmap reflecting the sum of changes
 * @linkcode Origami ./src/graph/maps.js 10
 */
export const mergeSimpleNextmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	const solution = maps[0].map((_, i) => i);
	maps.forEach(map => solution.forEach((s, i) => { solution[i] = map[s]; }));
	return solution;
};

/**
 * @description Provide two or more nextmaps in the order
 * they were made and this will merge them into one nextmap which
 * reflects all changes to the graph.
 * @param {...number[][]} ...maps a sequence of nextmaps
 * @returns {number[][]} one nextmap reflecting the sum of changes
 * @linkcode Origami ./src/graph/maps.js 23
 */
export const mergeNextmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	const solution = maps[0].map((_, i) => [i]);
	maps.forEach(map => {
		solution.forEach((s, i) => s
			.forEach((indx, j) => { solution[i][j] = map[indx]; }));
		solution.forEach((arr, i) => {
			solution[i] = arr
				.reduce((a, b) => a.concat(b), [])
				.filter(a => a !== undefined);
		});
	});
	return solution;
};

/**
 * @description Provide two or more simple backmaps in the order
 * they were made and this will merge them into one backmap which
 * reflects all changes to the graph.
 * @param {...number[]} ...maps a sequence of simplebackmaps
 * @returns {number[]} one backmap reflecting the sum of changes
 * @linkcode Origami ./src/graph/maps.js 43
 */
export const mergeSimpleBackmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	let solution = maps[0].map((_, i) => i);
	maps.forEach(map => {
		const next = map.map(n => solution[n]);
		solution = next;
	});
	return solution;
};

/**
 * @description Provide two or more  backmaps in the order
 * they were made and this will merge them into one backmap which
 * reflects all changes to the graph.
 * @param {...number[][]} ...maps a sequence of backmaps
 * @returns {number[][]} one backmap reflecting the sum of changes
 * @linkcode Origami ./src/graph/maps.js 59
 */
export const mergeBackmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	let solution = maps[0].reduce((a, b) => a.concat(b), []).map((_, i) => [i]);
	maps.forEach(map => {
		const next = [];
		map.forEach((el, j) => {
			if (typeof el === "number") {
				next[j] = solution[el];
			} else {
				next[j] = el.map(n => solution[n]).reduce((a, b) => a.concat(b), []);
			}
		});
		solution = next;
	});
	return solution;
};

/**
 * @description Remap the indices of a component in the graph.
 * This will update all references to this component too. For example,
 * modifying "vertices" indices will move around "vertices_coords" but
 * also update "faces_vertices" to match the new indices.
 * @param {FOLD} graph a FOLD graph, will be modified in place.
 * @param {string} component the name of a component, most likely either:
 * "vertices", "edges", or "faces".
 * @param {number[]} an index map, indicating where the old
 * indices should be.
 */
export const remapComponent = (graph, component, indexMap = []) => {
	// replace the references inside of each component, where the
	// component is the suffix. for example, update the new vertex indices
	// inside of edges_vertices.
	filterKeysWithSuffix(graph, component)
		.forEach(key => graph[key]
			.forEach((_, ii) => graph[key][ii]
				.forEach((v, jj) => { graph[key][ii][jj] = indexMap[v]; })));
	// shift the arrays themselves to the new location in the index map.
	const inverted = invertFlatMap(indexMap);
	filterKeysWithPrefix(graph, component)
		.forEach(key => { graph[key] = inverted.map(i => graph[key][i]); });
};

/**
 *
 */
export const remapKey = (graph, key, indexMap) => {
	// Perform a simple invertFlatMap, indices/values swap, but in the case of
	// non-bijective maps, the first encounter will be kept, skipping duplicates.
	const invertedMap = [];
	indexMap.forEach((n, i) => {
		invertedMap[n] = (invertedMap[n] === undefined ? i : invertedMap[n]);
	});

	// update every component that points to vertices_coords
	// these arrays do not change their size, only their contents
	filterKeysWithSuffix(graph, key)
		.forEach(sKey => graph[sKey]
			.forEach((_, ii) => graph[sKey][ii]
				.forEach((v, jj) => { graph[sKey][ii][jj] = indexMap[v]; })));

	// if a key was not included in indexMap for whatever reason,
	// it will be registered as "undefined". remove these.
	// the upcoming "prefix" step will automatically do this as well.
	filterKeysWithSuffix(graph, key)
		.forEach(sKey => graph[sKey]
			.forEach((_, ii) => {
				graph[sKey][ii] = graph[sKey][ii].filter(a => a !== undefined);
			}));

	// set the top-level arrays
	filterKeysWithPrefix(graph, key).forEach(prefix => {
		graph[prefix] = invertedMap.map(old => graph[prefix][old]);
	});
};
