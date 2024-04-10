/**
 * Rabbit Ear (c) Kraft
 */
import {
	foldKeys,
	filterKeysWithPrefix,
	filterKeysWithSuffix,
	getAllPrefixes,
	getAllSuffixes,
} from "../fold/spec.js";
import {
	duplicateEdges,
} from "./edges/duplicate.js";
import {
	circularEdges,
} from "./edges/circular.js";
import {
	makeVerticesToEdge,
	makeVerticesToFace,
	makeEdgesToFace,
} from "./make/lookup.js";

/**
 * @returns {number[]} indices
 */
const noNulls = (array) => array
	.map((el, i) => (el === null || el === undefined ? i : undefined))
	.filter(a => a !== undefined);

const basicComponentTest = (graph) => {
	const errors = [];
	// check if any graph array has null values at the top level
	foldKeys.graph
		.filter(key => graph[key])
		.forEach(key => errors.push(...noNulls(graph[key])
			.map(i => `${key}[${i}] is undefined or null`)));

	try {
		[
			"vertices_coords",
			"vertices_vertices",
			"vertices_edges",
			"edges_vertices",
			"faces_vertices",
			"faces_edges",
		].filter(key => graph[key])
			.flatMap(key => graph[key]
				.map(noNulls)
				.flatMap((indices, i) => indices.map(j => `${key}[${i}][${j}] is undefined or null`)))
			.forEach(error => errors.push(error));
	} catch (error) {
		errors.push("inner array null validation failed due to bad index access");
	}

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
			errors.push(`circular edges_vertices: ${circular_edges.join(", ")}`);
		}

		const duplicate_edges = duplicateEdges(graph);
		if (duplicate_edges.length !== 0) {
			const dups = duplicate_edges
				.map((dup, e) => `${e}(${dup})`)
				.filter(a => a)
				.join(", ");
			errors.push(`duplicate edges_vertices: ${dups}`);
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
 * @returns {number[][]} array of error messages. empty if all tests pass.
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

/**
 * @description In the case where two identical but opposite arrays exist,
 * this will test to make sure that every item in one array appears in the
 * other; for example, in vertices_faces and faces_vertices.
 */
const pairwiseReferenceTest = (a_b, b_a, aName, bName) => {
	try {
		// when we iterate through each array at its second level depth, we need
		// to be sure to filter out any null or undefined, as for example it's
		// requird by the spec to include undefined inside of vertices_faces,
		// but only inside the inner arrays. at the top level no nulls should exist.
		const abHash = {};
		a_b.forEach((_, a) => { abHash[a] = {}; });
		a_b.forEach((arr, a) => arr
			.filter(el => el !== null && el !== undefined)
			.forEach(b => { abHash[a][b] = true; }));

		const baHash = {};
		b_a.forEach((_, b) => { baHash[b] = {}; });
		b_a.forEach((arr, b) => arr
			.filter(el => el !== null && el !== undefined)
			.forEach(a => { baHash[b][a] = true; }));

		const abErrors = a_b
			.flatMap((arr, a) => arr
				.filter(el => el !== null && el !== undefined)
				.map(b => (!baHash[b] || !baHash[b][a]
					? `${bName}_${aName}[${b}] missing ${a} referenced in ${aName}_${bName}`
					: undefined))
				.filter(el => el !== undefined));
		const baErrors = b_a
			.flatMap((arr, b) => arr
				.filter(el => el !== null && el !== undefined)
				.map(a => (!abHash[a] || !abHash[a][b]
					? `${aName}_${bName}[${a}] missing ${b} referenced in ${bName}_${aName}`
					: undefined))
				.filter(el => el !== undefined));

		return abErrors.concat(baErrors);
	} catch (error) {
		return ["pairwise reference validation failed due to bad index access"]
	}
};

/**
 * @description This will test a reflexive array, like vertices_vertices,
 * to ensure that every reference also exists
 */
const reflexiveTest = (a_a, aName) => (
	pairwiseReferenceTest(a_a, a_a, aName, aName)
);

/**
 * @description Validate that the winding around each vertex
 * matches across arrays.
 * @param {FOLD} graph a FOLD object
 * @returns {string[]} list of errors, empty if none
 */
export const validateVerticesWinding = ({
	vertices_vertices,
	vertices_edges,
	vertices_faces,
	edges_vertices,
	faces_vertices,
	faces_edges,
}) => {
	const errors = [];
	const verticesToEdge = edges_vertices
		? makeVerticesToEdge({ edges_vertices })
		: undefined;
	const verticesToFace = faces_vertices
		? makeVerticesToFace({ faces_vertices })
		: undefined;
	const edgesToFace = faces_edges
		? makeEdgesToFace({ faces_edges })
		: undefined;
	try {
		if (vertices_vertices && vertices_edges && verticesToEdge) {
			const vAndE = vertices_vertices
				.flatMap((vertices, v) => vertices
					.map(v2 => [v, v2])
					.map(pair => pair.join(" "))
					.map(key => verticesToEdge[key])
					.map((edge, i) => (vertices_edges[v][i] !== edge
						? [v, i, edge, vertices_edges[v][i]]
						: undefined)))
				.filter(a => a !== undefined)
				.map(([a, b, e1, e2]) => `windings of vertices_vertices and vertices_edges at [${a}][${b}] do not match (${e1} ${e2})`);
			errors.push(...vAndE);
		}

		if (vertices_vertices && vertices_faces && verticesToFace) {
			const vAndF = vertices_vertices
				.flatMap((vertices, v) => vertices
					.map(vertex => [v, vertex])
					// .map((vertex, index, arr) => [arr[(index + 1) % arr.length], v, vertex])
					.map(three => three.join(" "))
					.map(key => verticesToFace[key])
					// single not-equals to be able to compare null == undefined as true
					.map((face, i) => (vertices_faces[v][i] != face
						? [v, i, face, vertices_faces[v][i]]
						: undefined)))
				.filter(a => a !== undefined)
				.map(([a, b, f1, f2]) => `windings of vertices_vertices and vertices_faces at [${a}][${b}] do not match (${f1} ${f2})`);
			errors.push(...vAndF);
		}

		if (vertices_edges && vertices_faces && edgesToFace) {
			const eAndF = vertices_edges
				.flatMap((edges, v) => edges
					.map((edge, index, arr) => [arr[(index + 1) % arr.length], edge])
					.map(pair => pair.join(" "))
					.map(key => edgesToFace[key])
					// single not-equals to be able to compare null == undefined as true
					.map((face, i) => (vertices_faces[v][i] != face
						? [v, i, face, vertices_faces[v][i]]
						: undefined)))
				.filter(a => a !== undefined)
				.map(([a, b, f1, f2]) => `windings of vertices_edges and vertices_faces at [${a}][${b}] do not match (${f1} ${f2})`);
			errors.push(...eAndF);
		}
	} catch (error) {
		errors.push("vertices winding validation failed due to bad index access");
	}
	return errors;
};

/**
 * @description Validate that the winding around each face definition matches
 * across arrays.
 * @param {FOLD} graph a FOLD object
 * @returns {string[]} list of errors, empty if none
 */
const validateFacesWinding = ({
	edges_vertices,
	edges_faces,
	faces_vertices,
	faces_edges,
	faces_faces,
}) => {
	const errors = [];
	const verticesToEdge = edges_vertices
		? makeVerticesToEdge({ edges_vertices })
		: undefined;
	const verticesToFace = faces_vertices
		? makeVerticesToFace({ faces_vertices })
		: undefined;
	try {
		if (faces_vertices && faces_edges && verticesToEdge) {
			const vAndE = faces_vertices
				.flatMap((vertices, f) => vertices
					.map((_, i, arr) => [0, 1].map(n => arr[(i + n) % arr.length]))
					.map(pair => pair.join(" "))
					.map(key => verticesToEdge[key])
					.map((edge, j) => (faces_edges[f][j] !== edge
						? [f, j, edge, faces_edges[f][j]]
						: undefined)))
				.filter(a => a !== undefined)
				.map(([a, b, e1, e2]) => `windings of faces_vertices and faces_edges at [${a}][${b}] do not match (${e1} ${e2})`);
			errors.push(...vAndE);
		}

		if (faces_vertices && faces_faces && verticesToFace) {
			const vAndF = faces_vertices
				.flatMap((vertices, i) => vertices
					.map((_, index, arr) => [1, 0].map(n => arr[(index + n) % arr.length]))
					.map(pair => pair.join(" "))
					.map(key => verticesToFace[key])
					// single not-equals to be able to compare null == undefined as true
					.map((face, j) => (faces_faces[i][j] != face
						? [i, j, face, faces_faces[i][j]]
						: undefined)))
				.filter(a => a !== undefined)
				.map(([a, b, f1, f2]) => `windings of faces_vertices and faces_faces at [${a}][${b}] do not match (${f1} ${f2})`);
			errors.push(...vAndF);
		}

		if (faces_edges && faces_faces && edges_faces) {
			const eAndF = faces_edges
				.flatMap((edges, i) => edges
					.map(edge => edges_faces[edge].filter(f => f !== i).shift())
					// single not-equals to be able to compare null == undefined as true
					.map((face, j) => (faces_faces[i][j] != face
						? [i, j, face, faces_faces[i][j]]
						: undefined)))
				.filter(a => a !== undefined)
				.map(([a, b, f1, f2]) => `windings of faces_edges and faces_faces at [${a}][${b}] do not match (${f1} ${f2})`);
			errors.push(...eAndF);
		}
	} catch (error) {
		errors.push("faces winding validation failed due to bad index access");
	}
	return errors;
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
	let referenceErrors = [];
	try {
		referenceErrors = intersectionOfStrings(allPrefixes, allSuffixes)
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
	} catch (error) {
		referenceErrors.push("reference validation failed due to bad index access");
	}

	// test 3: test reflexive component relationships.
	const reflexiveErrors = [];
	if (graph.faces_vertices && graph.vertices_faces) {
		reflexiveErrors.push(...pairwiseReferenceTest(
			graph.faces_vertices,
			graph.vertices_faces,
			"faces",
			"vertices",
		));
	}
	if (graph.edges_vertices && graph.vertices_edges) {
		reflexiveErrors.push(...pairwiseReferenceTest(
			graph.edges_vertices,
			graph.vertices_edges,
			"edges",
			"vertices",
		));
	}
	if (graph.faces_edges && graph.edges_faces) {
		reflexiveErrors.push(...pairwiseReferenceTest(
			graph.faces_edges,
			graph.edges_faces,
			"faces",
			"edges",
		));
	}

	if (graph.vertices_vertices) {
		reflexiveErrors.push(...reflexiveTest(graph.vertices_vertices, "vertices"));
	}
	if (graph.faces_faces) {
		reflexiveErrors.push(...reflexiveTest(graph.faces_faces, "faces"));
	}

	const verticesWindingErrors = validateVerticesWinding(graph);
	const facesWindingErrors = validateFacesWinding(graph);

	return basicErrors
		.concat(prefixTestErrors)
		.concat(referenceErrors)
		.concat(reflexiveErrors)
		.concat(verticesWindingErrors)
		.concat(facesWindingErrors);
};
