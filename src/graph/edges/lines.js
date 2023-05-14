import { EPSILON } from "../../math/general/constant.js";
import {
	clampLine,
	epsilonEqualVectors,
} from "../../math/general/function.js";
import {
	magnitude,
	normalize,
	subtract,
} from "../../math/algebra/vector.js";
import { radialSortPointIndices3 } from "../../math/general/sort.js";
import { nearestPointOnLine } from "../../math/geometry/nearest.js";
import { makeEdgesCoords } from "../make.js";
import {
	clusterScalars,
	clusterSortedGeneric,
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
	// this comparison function will be used if two or more points satisfy
	// both #1 and #2 conditions, and need to be radially sorted in their plane.
	const compareFn = (i, j) => (
		epsilonEqualVectors(vertices_coords[i], vertices_coords[j], epsilon)
	);
	// one final time, cluster each subcluster once more. because we only
	// measured the distance to the origin, and the vector, we could be on
	// equal but opposite sides of the origin.
	// (unless it passes through the origin)
	const clusterClusterClusters = clusterClusters
		.map(clusters => clusters.map(cluster => {
			// if the cluster passes through the origin, return one sub-cluster.
			if (Math.abs(edgesOriginDistances[cluster[0]]) < epsilon) {
				return [cluster];
			}
			// establish a shared vector for all lines in the cluster
			const clusterVector = edgesLine[cluster[0]].vector;
			// these points are all the same distance away from the origin,
			// radially sort them around the origin, using the line's vector
			// as the plane's normal.
			const sortedIndices = radialSortPointIndices3(
				cluster.map(v => vertices_coords[v]),
				clusterVector,
			).map(i => cluster[i]);
			// now that the list is sorted, cluster any neighboring points
			// that are within an epsilon distance away from each other.
			const clusterResult = clusterSortedGeneric(sortedIndices, compareFn)
				.map(cl => cl.map(j => sortedIndices[j]));
			// one special case, since these are radially sorted, if the
			// first and last cluster are equivalent, merge them together
			if (clusterResult.length === 1) { return clusterResult; }
			// get the first from cluster[0] and the last from cluster[n - 1]
			const firstFirst = clusterResult[0][0];
			const last = clusterResult[clusterResult.length - 1];
			const lastLast = last[last.length - 1];
			// if two points from either end clusters are similar,
			// merge the 0 and n-1 clusters into the 0 index.
			if (compareFn(firstFirst, lastLast)) {
				const lastCluster = clusterResult.pop();
				clusterResult[0] = lastCluster.concat(clusterResult[0]);
			}
			return clusterResult;
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
