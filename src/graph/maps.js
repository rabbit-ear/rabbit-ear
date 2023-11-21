/**
 * Rabbit Ear (c) Kraft
 */
import {
	filterKeysWithSuffix,
	filterKeysWithPrefix,
} from "../fold/spec.js";
/**
 * @description Provide two or more simple nextmaps in the order they were made
 * and this will merge them into one nextmap which reflects all changes to the graph.
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
 * @description Provide two or more nextmaps in the order they were made
 * and this will merge them into one nextmap which reflects all changes to the graph.
 * @param {...number[][]} ...maps a sequence of nextmaps
 * @returns {number[][]} one nextmap reflecting the sum of changes
 * @linkcode Origami ./src/graph/maps.js 23
 */
export const mergeNextmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	const solution = maps[0].map((_, i) => [i]);
	maps.forEach(map => {
		solution.forEach((s, i) => s.forEach((indx, j) => { solution[i][j] = map[indx]; }));
		solution.forEach((arr, i) => {
			solution[i] = arr
				.reduce((a, b) => a.concat(b), [])
				.filter(a => a !== undefined);
		});
	});
	return solution;
};
/**
 * @description Provide two or more simple backmaps in the order they were made
 * and this will merge them into one backmap which reflects all changes to the graph.
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
 * @description Provide two or more  backmaps in the order they were made
 * and this will merge them into one backmap which reflects all changes to the graph.
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
 * @description Invert an array of integers so that indices become values
 * and values become indices. In the case of duplicate indices
 * (duplicate input values), the duplicates will be overwritten.
 * @param {number[]} map an array of integers
 * @returns {number[]} the inverted map
 * @linkcode Origami ./src/graph/maps.js 119
 */
export const invertSimpleMap = (map) => {
	const inv = [];
	map.forEach((n, i) => { inv[n] = i; });
	return inv;
};
export const invertSimpleMapNoReplace = (map) => {
	const inv = [];
	map.forEach((n, i) => { inv[n] = inv[n] === undefined ? i : inv[n]; });
	return inv;
};
/**
 * @description Invert an array of integers so that indices become values and
 * values become indices. The values of the result will be an array.
 * In the case of duplicate indices (duplicate input values), they will all
 * end up in the value array. No data will be lost.
 * @param {number[]|number[][]} map an array of integers
 * @returns {number[][]} the inverted map
 * @linkcode Origami ./src/graph/maps.js 83
 */
export const invertArrayMap = (map) => {
	const inv = [];
	// set inv[index] = value, but before we do, make sure an array exists
	const setIndexValue = (index, value) => {
		if (inv[index] === undefined) { inv[index] = []; }
		inv[index].push(value);
	};
	// iterate through the argument array and flip the index/value
	// in the new array so that the index is the value and visa versa.
	map.forEach((n, i) => {
		if (n == null) { return; }
		if (typeof n === "number") { setIndexValue(n, i); }
		if (n.constructor === Array) {
			n.forEach(m => setIndexValue(m, i));
		}
	});
	return inv;
};
/**
 * @description Invert an array of integers so that indices become values and
 * values become indices. In the case of multiple values trying to insert
 * into the same index, a child array is made to house both (or more) numbers.
 * @param {number[]|number[][]} map an array of integers
 * @returns {number[]|number[][]} the inverted map
 * @linkcode Origami ./src/graph/maps.js 83
 */
export const invertMap = (map) => {
	const inv = [];
	// set inv[index] = value, but before we do, make sure that an array
	// will be formed if there are multiple values at that index
	const setIndexValue = (index, value) => {
		// before we set the inverted map [i] spot, check if something is already there
		if (inv[index] !== undefined) {
			// if that thing is a number, turn it into an array
			if (typeof inv[index] === "number") {
				inv[index] = [inv[index], value];
			} else {
				// already an array, add to it
				inv[index].push(value);
			}
		} else {
			inv[index] = value;
		}
	};
	// iterate through the argument array and flip the index/value
	// in the new array so that the index is the value and visa versa.
	map.forEach((n, i) => {
		if (n == null) { return; }
		if (typeof n === "number") { setIndexValue(n, i); }
		if (n.constructor === Array) {
			n.forEach(m => setIndexValue(m, i));
		}
	});
	return inv;
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
	const inverted = invertSimpleMap(indexMap);
	filterKeysWithPrefix(graph, component)
		.forEach(key => { graph[key] = inverted.map(i => graph[key][i]); });
};
/**
 *
 */
export const remapKey = (graph, key, indexMap) => {
	const invertedMap = invertSimpleMapNoReplace(indexMap);
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
