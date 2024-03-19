/**
 * Rabbit Ear (c) Kraft
 */

/**
  * @description Make an object which answers the question: "which edge
  * connects these two vertices?". This is accomplished by building an
  * object with keys containing vertex pairs (space separated string),
  * and the value is the edge index. This is not bidirectional, so "7 15"
  * can exist while "15 7" does not. This is useful for example
  * for looking up the edge's vector, which is direction specific.
  * @param {FOLD} graph a FOLD object, containing edges_vertices
  * @returns {{[key: string]: number}} object mapping a space-separated
  * vertex pair to an edge index
  * @linkcode Origami ./src/graph/make.js 356
  */
export const makeVerticesToEdge = ({ edges_vertices }) => {
	const map = {};
	edges_vertices
		.map(vertices => vertices.join(" "))
		.forEach((key, e) => { map[key] = e; });
	return map;
};

/**
 * @description Consider an array of arrays of indices to each be cyclical,
 * convert each inner array into pairs [i, (i+1) % length], and build map
 * that relates these pairs as a space-separated string to the index in the
 * top level array in which this pair resides.
 * @param {number[][]} array
 * @returns {{[key: string]: number}}
 */
const makePairsMap = (array, subsetIndices) => {
	const map = {};
	const indices = !subsetIndices
		? array.map((_, i) => i)
		: subsetIndices;
	indices
		.forEach(i => array[i]
			.map((_, j, arr) => [0, 1]
				.map(offset => (j + offset) % arr.length)
				.map(n => arr[n])
				.join(" "))
			.forEach(key => { map[key] = i; }));
	return map;
};

// const makePairsMap = (array) => {
// 	const map = {};
// 	array
// 		.forEach((indices, i) => indices
// 			.map((_, j, arr) => [0, 1]
// 				.map(offset => (j + offset) % arr.length)
// 				.map(n => arr[n])
// 				.join(" "))
// 			.forEach(key => { map[key] = i; }));
// 	return map;
// };

/**
 * @description Make an object which answers the question: "which edge
 * connects these two vertices?". This is accomplished by building an
 * object with keys containing vertex pairs (space separated string),
 * and the value is the edge index. This is bidirectional, so "7 15"
 * and "15 7" are both keys that point to the same edge.
 * @param {FOLD} graph a FOLD object, containing edges_vertices
 * @returns {{[key: string]: number}} object mapping a space-separated
 * vertex pair to an edge index
 * @linkcode Origami ./src/graph/make.js 336
 */
export const makeVerticesToEdgeBidirectional = ({ edges_vertices }, edges) => (
	makePairsMap(edges_vertices, edges)
);

/**
 * @description Make an object which answers the question: "which face
 * contains these two vertices in this exact order?". This is accomplished
 * by building an object with keys containing vertex pairs
 * (space separated string), and the value is the face index.
 * This will not work with non-manifold graphs.
 * @param {FOLD} graph a FOLD object, containing faces_vertices
 * @returns {{[key: string]: number}} object mapping a space-separated
 * vertex pair to a face index
 * @linkcode Origami ./src/graph/make.js 336
 */
export const makeVerticesToFace = ({ faces_vertices }, faces) => (
	makePairsMap(faces_vertices, faces)
);

/**
  * @description Make an object which answers the question: "which face
  * contains these two edges in this exact order?". This is accomplished
  * by building an object with keys containing edge pairs
  * (space separated string), and the value is the face index.
  * This will not work with non-manifold graphs.
  * @param {FOLD} graph a FOLD object, containing faces_edges
  * @returns {{[key: string]: number}} object mapping a space-separated
  * edge pair to a face index
  * @linkcode
  */
export const makeEdgesToFace = ({ faces_edges }, faces) => (
	makePairsMap(faces_edges, faces)
);
