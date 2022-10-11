/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
/**
 * density-based spatial clustering of applications with noise (DBSCAN)
 * cluster vertices near each other with an epsilon
 */
/**
 * because epsilons are usually very tiny, this uses a square bounding box
 */
const are_vertices_equivalent = (a, b, epsilon = math.core.EPSILON) => {
	const degree = a.length;
	for (let i = 0; i < degree; i += 1) {
		if (Math.abs(a[i] - b[i]) > epsilon) {
			return false;
		}
	}
	return true;
};
/**
 * @description Find all clusters of vertices which lie within an epsilon of each other.
 * Each cluster is an array of vertex indices. If no clusters exist, the method returns
 * N-number of arrays, each with a single vertex entry.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} array of arrays of vertex indices.
 * @example
 * no clusters: [ [0], [1], [2], [3], [4], ... ]
 * clusters: [ [0, 5], [1], [3], [2, 4]]
 * @linkcode Origami ./src/graph/verticesClusters.js 31
 */
const getVerticesClusters = ({ vertices_coords }, epsilon = math.core.EPSILON) => {
	if (!vertices_coords) { return []; }
	// equivalent_matrix is an NxN matrix storing (T/F) equivalency between vertices
	// only top triangle is used
	//             j  j  j
	//          0  1  2  3
	//   i  0 [ x,  ,  ,  ]
	//   i  1 [ x, x,  ,  ]
	//   i  2 [ x, x, x,  ]
	//      3 [ x, x, x, x]
	const equivalent_matrix = vertices_coords.map(() => []);
	for (let i = 0; i < vertices_coords.length - 1; i += 1) {
		for (let j = i + 1; j < vertices_coords.length; j += 1) {
			equivalent_matrix[i][j] = are_vertices_equivalent(
				vertices_coords[i],
				vertices_coords[j],
				epsilon,
			);
		}
	}
	// vertices_equivalent is an array for every vertex. each array contains a list
	// of indices that this vertex is equivalent to. there is redundant data,
	// for example, equivalent vertices 4 and 9 both store each other in their arrays.
	const vertices_equivalent = equivalent_matrix
		.map(equiv => equiv
			.map((el, j) => (el ? j : undefined))
			.filter(a => a !== undefined));
	// clusters is an array of arrays of numbers
	// each entry in clusters is an array of vertex indices
	// now we will recurse
	const clusters = [];
	const visited = Array(vertices_coords.length).fill(false);
	let visitedCount = 0;
	const recurse = (cluster_index, i) => {
		if (visited[i] || visitedCount === vertices_coords.length) { return; }
		visited[i] = true;
		visitedCount += 1;
		if (!clusters[cluster_index]) { clusters[cluster_index] = []; }
		clusters[cluster_index].push(i);
		while (vertices_equivalent[i].length > 0) {
			// instead of recursing depth first here, first push the array on to the vertex
			// after filtering out the already seen vertices..
			recurse(cluster_index, vertices_equivalent[i][0]);
			vertices_equivalent[i].splice(0, 1);
		}
	};
	// every vertex will be recusively visited, depth first.
	// begin with the first vertex, follow
	for (let i = 0; i < vertices_coords.length; i += 1) {
		recurse(i, i);
		if (visitedCount === vertices_coords.length) { break; }
	}
	return clusters.filter(a => a.length);
};

export default getVerticesClusters;
