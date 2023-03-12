/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../../general/strings.js";
import {
	makeVerticesEdgesUnsorted,
	makeVerticesVertices,
	makeVerticesEdges,
	makeVerticesFaces,
} from "../make.js";
import replace from "../replace.js";
/**
 * @description Get the indices of all duplicate edges by marking the
 * second/third/... as duplicate (not the first of the duplicates).
 * The result is given as an array with holes, where:
 * - the indices are the indices of the duplicate edges.
 * - the values are the indices of the first occurence of the duplicate.
 * Under this system, many edges can be duplicates of the same edge.
 * Order is not important. [5,9] and [9,5] are still duplicate.
 * @param {FOLD} graph a FOLD object
 * @returns {number[]} an array where the redundant edges are the indices,
 * and the values are the indices of the first occurence of the duplicate.
 * @example
 * {number[]} array, [4:3, 7:5, 8:3, 12:3, 14:9] where indices
 * (3, 4, 8, 12) are all duplicates. (5,7), (9,14) are also duplicates.
 * @linkcode Origami ./src/graph/edgesViolations.js 47
 */
export const duplicateEdges = ({ edges_vertices }) => {
	if (!edges_vertices) { return []; }
	const duplicates = [];
	const map = {};
	for (let i = 0; i < edges_vertices.length; i += 1) {
		// we need to store both, but only need to test one
		const a = `${edges_vertices[i][0]} ${edges_vertices[i][1]}`;
		const b = `${edges_vertices[i][1]} ${edges_vertices[i][0]}`;
		if (map[a] !== undefined) { // instead of (map[a] || map[b])
			duplicates[i] = map[a];
		} else {
			// only update the map. if an edge exists as two vertices, it will only
			// be set once, this prevents chains of duplicate relationships where
			// A points to B points to C points to D...
			map[a] = i;
			map[b] = i;
		}
	}
	return duplicates;
};
/**
 * @description Find and remove all duplicate edges from a graph.
 * If an edge is removed, it will mess up the vertices data (vertices_vertices,
 * vertices_edges, vertices_faces) so if this method successfully found and
 * removed a duplicate edge, the vertices arrays will be rebuilt as well.
 * @param {FOLD} graph a FOLD object
 * @param {number[]} [replace_indices=undefined] Leave this empty. Otherwise, if
 * duplicateEdges() has already been called, provide the result here to speed
 * up the algorithm.
 * @returns {object} a summary of changes
 * @linkcode Origami ./src/graph/edgesViolations.js 129
 */
export const removeDuplicateEdges = (graph, replace_indices) => {
	// index: edge to remove, value: the edge which should replace it.
	if (!replace_indices) {
		replace_indices = duplicateEdges(graph);
	}
	const removeObject = Object.keys(replace_indices).map(n => parseInt(n, 10));
	const map = replace(graph, S._edges, replace_indices);
	// if edges were removed, we need to rebuild vertices_edges and then
	// vertices_vertices since that was built from vertices_edges, and then
	// vertices_faces since that was built from vertices_vertices.
	if (removeObject.length) {
		// currently we are rebuilding the entire arrays, if possible,
		// update these specific vertices directly:
		// const vertices = removeObject
		//   .map(edge => graph.edges_vertices[edge])
		//   .reduce((a, b) => a.concat(b), []);
		if (graph.vertices_edges || graph.vertices_vertices || graph.vertices_faces) {
			graph.vertices_edges = makeVerticesEdgesUnsorted(graph);
			graph.vertices_vertices = makeVerticesVertices(graph);
			graph.vertices_edges = makeVerticesEdges(graph);
			graph.vertices_faces = makeVerticesFaces(graph);
		}
	}
	return { map, remove: removeObject };
};
