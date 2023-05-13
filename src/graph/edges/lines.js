import { EPSILON } from "../../math/general/constant.js";
import { clampLine } from "../../math/general/function.js";
import {
	magnitude,
	normalize,
	subtract,
	cross2,
} from "../../math/algebra/vector.js";
import { nearestPointOnLine } from "../../math/geometry/nearest.js";
import { makeEdgesCoords } from "../make.js";
import {
	clusterScalars,
	clusterParallelVectors,
} from "../../general/arrays.js";
/**
 * @description Convert the edges of a graph into (infinite) lines, and
 * prevent duplicate lines, only generate one line for all collinear edges.
 * "lines" is an array of lines, in no particular order, and "edges_line"
 * maps each edge (index) to the index in the "lines" array (value).
 * todo: a bugfix has now rendered this method 2D only. we need to substitute
 * the 2d-cross product which determines sidedness for a 3d version
 * that uses a splitting-plane.
 * @param {FOLD} graph a FOLD graph, can be 2D or 3D.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {{ lines: VecLine[], edges_line: number[] }}
 */
export const getEdgesLine = ({ vertices_coords, edges_vertices }, epsilon = EPSILON) => {
	if (!vertices_coords
		|| !edges_vertices
		|| !edges_vertices.length) {
		return { edges_line: [], lines: [] };
	}
	const edgesCoords = makeEdgesCoords({ vertices_coords, edges_vertices });
	const edgesVector = edgesCoords
		.map(verts => subtract(verts[1], verts[0]))
		.map(normalize);
	const edgesLine = edgesVector
		.map((vector, i) => ({ vector, origin: edgesCoords[i][0] }));
	// the point on the line that is nearest to the origin.
	// when we return the list of lines, these will be used for the origins.
	const edgesNearestToOrigin = edgesLine
		.map(line => nearestPointOnLine(line, [0, 0, 0], clampLine, epsilon));
	// shortest distance from each edge's line to the origin.
	const edgesOriginDistances = edgesNearestToOrigin
		.map(point => magnitude(point));
	const edgesOriginUnitVectors = edgesNearestToOrigin
		.map(point => normalize(point));
	// begin clustering, we will cluster into 3 parts:
	// 1. cluster lines with similar distance-to-origin scalars
	// 2. sub-cluster those with parallel-vectors
	// 3. sub-cluster those which are on the same side of the origin
	// (3 is necessary to separate lines equal but opposite sides of the origin)
	// cluster edge indices based on a shared distance-to-origin
	const distanceClusters = clusterScalars(edgesOriginDistances, epsilon);
	// further subcluster the previous clusters based on whether the
	// line's vectors are parallel (these inner clusters share the same line)
	const clusterClusters = distanceClusters
		.map(cluster => cluster.map(i => edgesVector[i]))
		.map(cluster => clusterParallelVectors(cluster, epsilon))
		.map((clusters, i) => clusters
			.map(cluster => cluster
				.map(index => distanceClusters[i][index])));
	// one final time, cluster each subcluster once more. because we only
	// measured the distance to the origin, and the vector, we could be on
	// equal but opposite sides of the origin.
	// (unless it passes through the origin)

	//       (+y)
	//        |
	//  -d +c |  +d +c
	//        |
	// -------|------- (+x, [1, 0])
	//        |
	//  -d -c |  +d -c
	//        |
	//
	// 1 | 0
	// -----
	// 2 | 3
	// sort by: decreasing, decreasing, increasing, increasing dot products
	// const dots = vectors.map(vec => dot2([1, 0], vec));
	// const crosses = vectors.map(vec => cross2([1, 0], vec));
	// const vectors_quadrant = vectors.map((_, i) => {
	// 	if (dots[i] >= 0 && crosses[i] >= 0) { return 0; }
	// 	if (dots[i] < 0 && crosses[i] >= 0) { return 1; }
	// 	if (dots[i] < 0 && crosses[i] < 0) { return 2; }
	// 	if (dots[i] >= 0 && crosses[i] < 0) { return 3; }
	// 	return 0;
	// });
	// const quadrants_vectors = invertMap(vectors_quadrant)
	// 	.map(el => (el.constructor === Array ? el : [el]));
	// const funcs = [
	// 	(a, b) => dots[b] - dots[a],
	// 	(a, b) => dots[b] - dots[a],
	// 	(a, b) => dots[a] - dots[b],
	// 	(a, b) => dots[a] - dots[b],
	// ];
	// const sortedQuadrantsVectors = quadrants_vectors
	// 	.map((indices, i) => indices.sort(funcs[i]));

	// todo: oh no. this isn't sufficient for 3D. now it only works in 2D.
	const clusterClusterClusters = clusterClusters
		.map(clusters => clusters.map(cluster => {
			// if the cluster passes through the origin, return one sub-cluster.
			if (Math.abs(edgesOriginDistances[cluster[0]]) < epsilon) {
				return [cluster];
			}
			// establish a shared vector for all lines in the cluster
			const clusterVector = edgesLine[cluster[0]].vector;
			// which side of the vector is each edge's line's origin?
			const clusterCrosses = cluster.map(e => cross2(
				edgesLine[e].origin,
				clusterVector,
			));
			// convert the previous sidedness result into -1 or +1.
			const clusterCrossSigns = clusterCrosses.map(cross => Math.sign(cross));
			// cluster and map indices back to their original edge index.
			return clusterScalars(clusterCrossSigns, epsilon)
				.map(cl => cl.map(j => cluster[j]));
		}));
	// get a flat array of all unique lines (one per cluster) found.
	const lines = clusterClusterClusters
		.flatMap(clusterOfClusters => clusterOfClusters
			.flatMap(clusters => clusters
				.map(cluster => cluster[0])
				.map(i => ({ vector: edgesVector[i], origin: edgesNearestToOrigin[i] }))));
	const edges_line = [];
	let lineIndex = 0;
	clusterClusterClusters
		.forEach(clusterOfClusters => clusterOfClusters
			.forEach(clusters => clusters
				.forEach(cluster => {
					cluster.forEach(i => { edges_line[i] = lineIndex; });
					lineIndex += 1;
				})));
	return {
		lines,
		edges_line,
	};
};
