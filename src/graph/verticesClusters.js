/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
/**
 * density-based spatial clustering of applications with noise (DBSCAN)
 * cluster vertices near each other with an epsilon
 */
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
export const sortPointsAlongFirstAxis = (points) => points
	.map((point, i) => ({ i, d: point[0] }))
	.sort((a, b) => a.d - b.d)
	.map(a => a.i);

export const getVerticesClusters2 = ({ vertices_coords }, epsilon = math.core.EPSILON) => {
	if (!vertices_coords) { return []; }
	// the return value, the clusters
	const clusters = [];
	// add to this as we go. once length === vertices_coords.length, we are done.
	const finished = [];
	const vertices = sortPointsAlongFirstAxis(vertices_coords);
	// loop {
	// 	to begin:
	// 	take the first index in the sorted list, add it to a cluster,
	// 	form a bounding box NOT by all points in the cluster, but all
	// 	points that are within epsilon range of the most recently added point
	// 	rangeStart is the index of the cluster which is still within epsilon
	// 	range of the most recently added point, every update to cluster will
	// 	refresh the bounding box as rect range of indices (rangeStart...length)
	// 	then:
	// 	start checking the next indices forward on the +X axis,
	// 	if they are epsilon close to the current bounding box,
	// 	add them to the cluster, and set their "finished" state.
	// 	and if the rangeStart pointer is too far away, walk it forward
	// 	until it is within epsilon range and update the new bounding box
	// 	as we pass (and reject) any indices, add them to the missed array.
	// 	once we reach a state where we can no longer
	// }
	let rangeStart = 0;
	let yRange = [0, 0];
	let xRange = [0, 0];
	const isInside = (index) => (
		vertices_coords[index][0] > xRange[0]
		&& vertices_coords[index][0] < xRange[1]
		&& vertices_coords[index][1] > yRange[0]
		&& vertices_coords[index][1] < yRange[1]
	);
	/**
	 * @description Each time we add a point to the current cluster,
	 * we need to expand the current cluster bounding box. since we are
	 * only moving left to right, when we consider another point to be
	 * added or not, we only need to consider it against the right most
	 * side of the bounding box, this is the right most set of points
	 * that are within the epsilon range of the furthest point to the right.
	 */
	const updateRange = (cluster) => {
		const newVertex = cluster[cluster.length - 1];
		// update rangeStart
		// while (!isInside(cluster[rangeStart]) && rangeStart < cluster.length - 1) {
		// 	rangeStart += 1;
		// }
		while (vertices_coords[newVertex] - vertices_coords[cluster[rangeStart]] > epsilon) {
			rangeStart += 1;
		}
		// update bounding box
		const points = cluster.slice(rangeStart, cluster.length)
			.map(v => vertices_coords[v]);
		const ys = points.map(p => p[1]);
		yRange = [Math.min(...ys) - epsilon, Math.max(...ys) + epsilon];
		xRange = [points[0][0] - epsilon, points[points.length - 1][0] + epsilon];
	};
	const isNearInX = (index) => (vertices_coords[index][0] < xRange[1]);
	while (finished.length !== vertices_coords.length) {
		const cluster = [];
		const startVertex = vertices.shift();
		cluster.push(startVertex);
		finished.push(startVertex);
		// rangeStart is an index in the array "cluster"
		rangeStart = 0;
		// update new bounding box, walk x-start pointer forward
		updateRange(cluster);
		// walk is an index in the array "vertices"
		let walk = 0;
		while (walk < vertices.length && isNearInX(vertices[walk])) {
			if (isInside(vertices[walk])) {
				const newVertex = vertices.splice(walk, 1).shift();
				cluster.push(newVertex);
				finished.push(newVertex);
				// update new bounding box, walk x-start pointer forward
				updateRange(cluster);
				// don't increment walk. the vertices array got smaller instead
			} else {
				walk += 1;
			}
		}
		// cluster is done, no more possible points can be added.
		// start a new cluster next round, unless all vertices are finished.
		clusters.push(cluster);
	}
	return clusters;
};
