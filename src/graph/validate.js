/**
 * Rabbit Ear (c) Kraft
 */
import {
	filterKeysWithPrefix,
	filterKeysWithSuffix,
	getAllPrefixes,
	getAllSuffixes,
} from "../fold/spec.js";
import {
	foldKeys,
} from "../fold/keys.js";
import {
	duplicateEdges,
} from "./edges/duplicate.js";
import {
	circularEdges,
} from "./edges/circular.js";
// import {
// 	duplicateVertices,
// } from "./vertices/duplicate.js";
// import {
// 	isolatedVertices,
// } from "./vertices/isolated.js";

const noNulls = (array) => array
	.map((el, i) => (el === null || el === undefined ? i : undefined))
	.filter(a => a !== undefined);

const basicComponentTest = (graph) => {
	const errors = [];
	// check if any graph array has null values at the top level
	foldKeys.graph
		.filter(key => graph[key])
		.forEach(key => errors.push(...noNulls(graph[key])
			.map(i => `${key}[${i}] undefined or null`)));

	if (graph.vertices_coords) {
		errors.push(...graph.vertices_coords
			.map((coords, v) => (coords.length !== 2 && coords.length !== 3
				? v
				: undefined))
			.filter(a => a !== undefined)
			.map(e => `vertices_coords[${e}] is not length 2 or 3`));
	}

	if (graph.edges_vertices) {
		errors.push(...graph.edges_vertices
			.map((vertices, e) => (vertices.length !== 2 ? e : undefined))
			.filter(a => a !== undefined)
			.map(e => `edges_vertices[${e}] is not length 2`));

		const circular_edges = circularEdges(graph);
		if (circular_edges.length !== 0) {
			errors.push(`contains circular edges: ${circular_edges.join(", ")}`);
		}

		const duplicate_edges = duplicateEdges(graph);
		if (duplicate_edges.length !== 0) {
			const dups = duplicate_edges
				.map((dup, e) => `${e}(${dup})`)
				.filter(a => a)
				.join(", ");
			errors.push(`duplicate edges: ${dups}`);
		}
	}

	if (graph.faces_vertices) {
		errors.push(...graph.faces_vertices
			.map((vertices, f) => (vertices.length === 0 ? f : undefined))
			.filter(a => a !== undefined)
			.map(f => `faces_vertices[${f}] contains no vertices`));
	}

	if (graph.faces_edges) {
		errors.push(...graph.faces_edges
			.map((edges, f) => (edges.length === 0 ? f : undefined))
			.filter(a => a !== undefined)
			.map(f => `faces_edges[${f}] contains no edges`));
	}
	return errors;
};

/**
 *
 */
const intersectionOfStrings = (array1, array2) => {
	const counts = {};
	array1.forEach(key => { counts[key] = 1; });
	array2.forEach(key => {
		counts[key] = counts[key] === 1 ? 2 : 1;
	});
	return Object.keys(counts).filter(key => counts[key] === 2);
};

/**
 * @description Provide a list of arrays. This method will ensure that
 * all arrays contain the same indices. This works with arrays with holes.
 * O(n)
 * @param {any[][]} arrays any number of arrays
 * @returns {string[]} array of error messages. empty if all tests pass.
 */
const arraysHaveSameIndices = (arrays = []) => {
	// base case test passes.
	if (arrays.length < 2) { return []; }
	// store arrays[0]'s indices into a hash lookup.
	const indices = {};
	arrays[0].forEach((_, i) => { indices[i] = true; });
	// arrays 1...N-1. test each array against array 0.
	return Array.from(Array(arrays.length - 1))
		.map((_, i) => arrays[i + 1])
		.flatMap((arr, p) => arr
			// if error, return [a, b, i], where a and b are the indices
			// of the arrays inside "arrays" param, and i is the out of place index.
			// (p is off by one due to i + 1 mapping 0...N-2 to 1...N-1).
			.map((_, i) => (indices[i] ? undefined : [0, p + 1, i]))
			.filter(a => a !== undefined));
};

const reflexiveTest = (a_b, b_a, aName, bName) => {
	const abHash = {};
	a_b.forEach((_, a) => { abHash[a] = {}; });
	a_b.forEach((arr, a) => arr.forEach(b => { abHash[a][b] = true; }));

	const baHash = {};
	b_a.forEach((_, b) => { baHash[b] = {}; });
	b_a.forEach((arr, b) => arr.forEach(a => { baHash[b][a] = true; }));

	const abErrors = a_b
		.flatMap((arr, a) => arr
			.map(b => (!baHash[b][a]
				? `${bName}_${aName}[${b}][${a}] missing in ${aName}_${bName}`
				: undefined))
			.filter(el => el !== undefined));
	const baErrors = b_a
		.flatMap((arr, b) => arr
			.map(a => (!abHash[a][b]
				? `${aName}_${bName}[${a}][${b}] missing in ${bName}_${aName}`
				: undefined))
			.filter(el => el !== undefined));

	return abErrors.concat(baErrors);
};

// const extraVerticesTest = (graph, epsilon) => {
// 	const errors = [];
// 	const isolated_vertices = isolatedVertices(graph);
// 	const duplicate_vertices = duplicateVertices(graph, epsilon);
// 	if (isolated_vertices.length !== 0) {
// 		errors.push(`contains isolated vertices: ${isolated_vertices.join(", ")}`);
// 	}
// 	if (duplicate_vertices.length !== 0) {
// 		errors.push(`contains duplicate vertices`);
// 	}
// 	return errors;
// };

/**
 * @description Validate a graph, ensuring that all references across
 * different arrays point to valid data, there are no mismatching
 * array references.
 * @algorithm Inspect every array whose key contains a "_" symbol.
 * Ensure that every matching prefix (all "edges_" arrays) all match
 * in length and contain the same indices.
 * Ensure that every suffix array (all "_edges" arrays) with a matching
 * prefix array (all "edges_" arrays) contain only indices which match
 * with some value in the prefix array.
 * @param {FOLD} graph a FOLD object
 * @returns {string[]} array of error messages. an empty array means no errors.
 */
export const validate = (graph) => {
	// test 0:
	const basicErrors = basicComponentTest(graph);

	const allPrefixes = getAllPrefixes(graph)
		.filter(key => key !== "file" && key !== "frame");
	const allSuffixes = getAllSuffixes(graph);

	// test 1: for every similar prefix array (vertices_), ensure that each
	// of them are the same length (all of their indices match).
	const prefixKeys = allPrefixes
		.map(prefix => filterKeysWithPrefix(graph, prefix));
	const prefixTestErrors = prefixKeys
		.map(keys => keys
			.map(key => graph[key])
			// only allow array values
			.filter(arr => arr.constructor === Array))
		.map(arraysHaveSameIndices)
		.flatMap((prefixErrors, p) => prefixErrors
			.map(err => [prefixKeys[p][err[0]], prefixKeys[p][err[1]], err[2]]))
		.map(([a, b, i]) => `array indices differ ${a}, ${b} at index ${i}`);

	// test 2: in the case of a suffix referencing another array's prefix,
	// check that the indices from the suffix exist in the prefix
	const referenceErrors = intersectionOfStrings(allPrefixes, allSuffixes)
		.flatMap(match => {
			const prefixArrayKeys = prefixKeys[allPrefixes.indexOf(match)];
			const prefixArray = graph[prefixArrayKeys[0]];
			return filterKeysWithSuffix(graph, match)
				.flatMap(key => graph[key]
					.flatMap((arr, i) => arr
						// "index" can be null, ie: vertices_faces can be [[2, null, 5]]
						.map((index, j) => (index === null
							|| index === undefined
							|| prefixArray[index] !== undefined
							? undefined
							: `${key}[${i}][${j}] references ${match} ${index}, missing in ${prefixArrayKeys[0]}`))
						.filter(a => a !== undefined)));
		});

	// test 3: test reflexive component relationships.
	const reflexiveErrors = [];
	if (graph.faces_vertices && graph.vertices_faces) {
		reflexiveErrors.push(...reflexiveTest(
			graph.faces_vertices,
			graph.vertices_faces,
			"faces",
			"vertices",
		));
	}
	if (graph.edges_vertices && graph.vertices_edges) {
		reflexiveErrors.push(...reflexiveTest(
			graph.edges_vertices,
			graph.vertices_edges,
			"edges",
			"vertices",
		));
	}
	if (graph.faces_edges && graph.edges_faces) {
		reflexiveErrors.push(...reflexiveTest(
			graph.faces_edges,
			graph.edges_faces,
			"faces",
			"edges",
		));
	}

	return basicErrors
		.concat(prefixTestErrors)
		.concat(referenceErrors)
		.concat(reflexiveErrors);
};
