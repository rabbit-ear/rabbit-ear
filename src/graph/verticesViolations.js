/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math.js";
import verticesClusters from "./verticesClusters.js";
import * as S from "../general/strings.js";
import remove from "./remove.js";
import replace from "./replace.js";
/**
 * @description Get the indices of all vertices which lie close to other vertices.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} arrays of clusters of similar vertices. todo check this
 * @linkcode Origami ./src/graph/verticesViolations.js 14
 */
export const duplicateVertices = (graph, epsilon) => (
	verticesClusters(graph, epsilon)
		.filter(arr => arr.length > 1)
);
/**
 * @description Get the indices of all vertices which make no appearance in any edge.
 * @param {FOLD} graph a FOLD graph
 * @returns {number[]} the indices of the isolated vertices
 * @linkcode Origami ./src/graph/verticesViolations.js 24
 */
export const edgeIsolatedVertices = ({ vertices_coords, edges_vertices }) => {
	if (!vertices_coords || !edges_vertices) { return []; }
	let count = vertices_coords.length;
	const seen = Array(count).fill(false);
	edges_vertices.forEach((ev) => {
		ev.filter(v => !seen[v]).forEach((v) => {
			seen[v] = true;
			count -= 1;
		});
	});
	return seen
		.map((s, i) => (s ? undefined : i))
		.filter(a => a !== undefined);
};
/**
 * @description Get the indices of all vertices which make no appearance in any face.
 * @param {FOLD} graph a FOLD graph
 * @returns {number[]} the indices of the isolated vertices
 * @linkcode Origami ./src/graph/verticesViolations.js 44
 */
export const faceIsolatedVertices = ({ vertices_coords, faces_vertices }) => {
	if (!vertices_coords || !faces_vertices) { return []; }
	let count = vertices_coords.length;
	const seen = Array(count).fill(false);
	faces_vertices.forEach((fv) => {
		fv.filter(v => !seen[v]).forEach((v) => {
			seen[v] = true;
			count -= 1;
		});
	});
	return seen
		.map((s, i) => (s ? undefined : i))
		.filter(a => a !== undefined);
};

// todo this could be improved. for loop instead of forEach + filter.
// break the loop early.
/**
 * @description Get the indices of all vertices which make no appearance in any edge or face.
 * @param {FOLD} graph a FOLD graph
 * @returns {number[]} the indices of the isolated vertices
 * @linkcode Origami ./src/graph/verticesViolations.js 67
 */
export const isolatedVertices = ({ vertices_coords, edges_vertices, faces_vertices }) => {
	if (!vertices_coords) { return []; }
	let count = vertices_coords.length;
	const seen = Array(count).fill(false);
	if (edges_vertices) {
		edges_vertices.forEach((ev) => {
			ev.filter(v => !seen[v]).forEach((v) => {
				seen[v] = true;
				count -= 1;
			});
		});
	}
	if (faces_vertices) {
		faces_vertices.forEach((fv) => {
			fv.filter(v => !seen[v]).forEach((v) => {
				seen[v] = true;
				count -= 1;
			});
		});
	}
	return seen
		.map((s, i) => (s ? undefined : i))
		.filter(a => a !== undefined);
};
/**
 * @description Remove any vertices which are not a part of any edge or
 * face. This will shift up the remaining vertices indices so that the
 * vertices arrays will not have any holes, and, additionally it searches
 * through all _vertices reference arrays and updates the index
 * references for the shifted vertices.
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} [remove_indices] Leave this empty. Otherwise, if
 * isolatedVertices() has already been called, provide the result here to speed
 * up the algorithm.
 * @returns {object} summary of changes
 * @linkcode Origami ./src/graph/verticesViolations.js 104
 */
export const removeIsolatedVertices = (graph, remove_indices) => {
	if (!remove_indices) {
		remove_indices = isolatedVertices(graph);
	}
	return {
		map: remove(graph, S._vertices, remove_indices),
		remove: remove_indices,
	};
};

// todo
// export const remove_collinear_vertices = (graph, epsilon = math.EPSILON) => {
// };

/**
 * @description This will shrink the number of vertices in the graph,
 * if vertices are close within an epsilon, it will keep the first one,
 * find the average of close points, and assign it to the remaining vertex.
 * **this has the potential to create circular and duplicate edges**.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} summary of changes
 * @linkcode Origami ./src/graph/verticesViolations.js 128
 */
export const removeDuplicateVertices = (graph, epsilon = math.EPSILON) => {
	// replaces array will be [index:value] index is the element to delete,
	// value is the index this element will be replaced by.
	const replace_indices = [];
	// "remove" is only needed for the return value summary.
	const remove_indices = [];
	// clusters is array of indices, for example: [ [4, 13, 7], [0, 9] ]
	const clusters = verticesClusters(graph, epsilon)
		.filter(arr => arr.length > 1);
	// for each cluster of n, all indices from [1...n] will be replaced with [0]
	clusters.forEach(cluster => {
		// replace() must maintain index > value, ensure index[0] is the
		// smallest of the set (most of the time it is)
		if (Math.min(...cluster) !== cluster[0]) {
			cluster.sort((a, b) => a - b);
		}
		for (let i = 1; i < cluster.length; i += 1) {
			replace_indices[cluster[i]] = cluster[0];
			remove_indices.push(cluster[i]);
		}
	});
	// for each cluster, average all vertices-to-merge to get their new point.
	// set the vertex at the index[0] (the index to keep) to the new point.
	clusters
		.map(arr => arr.map(i => graph.vertices_coords[i]))
		.map(arr => math.average(...arr))
		.forEach((point, i) => { graph.vertices_coords[clusters[i][0]] = point; });
	return {
		map: replace(graph, S._vertices, replace_indices),
		remove: remove_indices,
	};
};
