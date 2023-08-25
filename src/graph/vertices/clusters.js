/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/general/constant.js";
import { getDimension } from "../../fold/spec.js";
/**
 * @description Find all clusters of vertices which lie within an epsilon of each other.
 * Each cluster is an array of vertex indices. If no clusters exist, the method returns
 * N-number of arrays, each with a single vertex entry. This is an implementation of a
 * density-based spatial clustering of applications with noise (DBSCAN).
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} array of arrays of vertex indices.
 * @example
 * no clusters: [ [0], [1], [2], [3], [4], ... ]
 * clusters: [ [0, 5], [1], [3], [2, 4]]
 * @linkcode Origami ./src/graph/verticesClusters.js 16
 */
export const getVerticesClusters = ({ vertices_coords }, epsilon = EPSILON) => {
	if (!vertices_coords) { return []; }
	const dimensions = getDimension({ vertices_coords });
	const dimensionArray = Array.from(Array(dimensions));
	// the return value, the clusters
	const clusters = [];
	// add to this as we go. once length === vertices_coords.length, we are done.
	const finished = [];
	// as we add points to clusters, they will be removed from here.
	// sort vertices (any dimension) along the X-axis. store their indices
	const vertices = vertices_coords
		.map((point, i) => ({ i, d: point[0] }))
		.sort((a, b) => a.d - b.d)
		.map(a => a.i);
	let rangeStart = 0;
	// let xRange = [0, 0];
	// let yRange = [0, 0];
	const ranges = dimensionArray.map(() => [0, 0]);
	/**
	 * @description Test if a vertex is inside the current cluster's bounding box
	 * @param {number} index an index in vertices_coords
	 */
	// const isInsideCluster = (index) => (
	// 	vertices_coords[index][0] > xRange[0]
	// 	&& vertices_coords[index][0] < xRange[1]
	// 	&& vertices_coords[index][1] > yRange[0]
	// 	&& vertices_coords[index][1] < yRange[1]
	// );
	const isInsideCluster = (index) => dimensionArray
		.map((_, d) => vertices_coords[index][d] > ranges[d][0]
			&& vertices_coords[index][d] < ranges[d][1])
		.reduce((a, b) => a && b, true);
	/**
	 * @description Each time we add a point to the current cluster,
	 * form a bounding box NOT by all points in the cluster, but all
	 * points that are within epsilon range along the X-axis of the most
	 * recently added point, as points are sorted left to right.
	 * "rangeStart" is the index of the cluster which is still within epsilon
	 * range of the most recently added point, every update to cluster will
	 * refresh the bounding box as rect range of indices (rangeStart...length).
	 */
	const updateRange = (cluster) => {
		const newVertex = cluster[cluster.length - 1];
		// update rangeStart
		// while (!isInsideCluster(cluster[rangeStart]) && rangeStart < cluster.length - 1) {
		// 	rangeStart += 1;
		// }
		// bug here: cannot subtract point
		// while (vertices_coords[newVertex] - vertices_coords[cluster[rangeStart]] > epsilon) {
		while (vertices_coords[newVertex][0] - vertices_coords[cluster[rangeStart]][0] > epsilon) {
			rangeStart += 1;
		}
		// update bounding box
		const points = cluster.slice(rangeStart, cluster.length)
			.map(v => vertices_coords[v]);
		// xRange = [points[0][0] - epsilon, points[points.length - 1][0] + epsilon];
		ranges[0] = [
			points[0][0] - epsilon,
			points[points.length - 1][0] + epsilon,
		];
		for (let d = 1; d < dimensions; d += 1) {
			const scalars = points.map(p => p[d]);
			ranges[d] = [
				Math.min(...scalars) - epsilon,
				Math.max(...scalars) + epsilon,
			];
		}
		// const ys = points.map(p => p[1]);
		// yRange = [Math.min(...ys) - epsilon, Math.max(...ys) + epsilon];
	};
	// loop until all points have been added to "finished"
	while (finished.length !== vertices_coords.length) {
		// start a new cluster, add the first vertex furthest to the left
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
		// this boolean check tests whether or not the vertex is still inside
		// the bounding box ONLY according to the X axis. it's possible a
		// vertex is too far away in the Y (and rejected from the cluster), but
		// the next few vertices to its right are still within the cluster.
		// however, if we move too far away in the X direction from the cluster,
		// we know this cluster is finished and we can start a new one.
		while (walk < vertices.length && vertices_coords[vertices[walk]][0] < ranges[0][1]) {
			// if the point is inside the bounding box of the cluster, add it.
			if (isInsideCluster(vertices[walk])) {
				const newVertex = vertices.splice(walk, 1).shift();
				cluster.push(newVertex);
				finished.push(newVertex);
				// update new bounding box, walk x-start pointer forward
				updateRange(cluster);
				// don't increment walk. the vertices array got smaller instead
			} else {
				// skip over this vertex. even though our vertices are sorted
				// left to right, it's possible that this one is too far away in the
				// Y axis, but the next few points will still be inside the cluster
				walk += 1;
			}
		}
		// cluster is done, no more possible points can be added.
		// start a new cluster next round, unless all vertices are finished.
		clusters.push(cluster);
	}
	return clusters;
	// .map(arr => arr.sort((a, b) => a - b))
	// .sort((a, b) => a[0] - b[0]);
};
