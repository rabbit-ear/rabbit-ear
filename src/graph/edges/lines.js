import { EPSILON } from "../../math/general/constant.js";
import { clampLine } from "../../math/general/function.js";
import {
	magnitude,
	normalize,
} from "../../math/algebra/vector.js";
import { nearestPointOnLine } from "../../math/geometry/nearest.js";
import {
	makeEdgesCoords,
	makeEdgesVector,
} from "../make.js";
import {
	clusterScalars,
	clusterParallelVectors,
} from "../../general/arrays.js";
/**
 * @description Convert the edges of a graph into (infinite) lines, and
 * prevent duplicate lines, only generate one line for all collinear edges.
 * "lines" is an array of lines, in no particular order, and "edges_line"
 * maps each edge (index) to the index in the "lines" array (value).
 * @param {FOLD} graph a FOLD graph, can be 2D or 3D.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {{ lines: VecLine[], edges_line: number[] }}
 */
export const getEdgesLine = (graph, epsilon = EPSILON) => {
	if (!graph.vertices_coords
		|| !graph.edges_vertices
		|| !graph.edges_vertices.length) {
		return { edges_line: [], lines: [] };
	}
	const edgesCoords = makeEdgesCoords(graph);
	const edgesVector = makeEdgesVector(graph).map(normalize);
	const edgesLine = edgesVector
		.map((vector, i) => ({ vector, origin: edgesCoords[i][0] }));
	// the point on the line that is nearest to the origin.
	// when we return the list of lines, these will be used for the origins.
	const edgesNearestToOrigin = edgesLine
		.map(line => nearestPointOnLine(line, [0, 0, 0], clampLine, epsilon));
	// shortest distance from each edge's line to the origin.
	const edgesOriginDistances = edgesNearestToOrigin
		.map(point => magnitude(point));
	// cluster edge indices based on a shared distance-to-origin
	const distanceClusters = clusterScalars(edgesOriginDistances, epsilon);
	// further subcluster the previous clusters based on whether the
	// line's vectors are parallel (these inner clusters share the same line)
	const clusterClustersUnindexed = distanceClusters
		.map(cluster => cluster.map(i => edgesVector[i]))
		.map(cluster => clusterParallelVectors(cluster, epsilon));
	// clusterParallelVectors results in zero-indexed indices relating to
	// their inner cluster arrays. remap these back to the global indices.
	const clusterClusters = clusterClustersUnindexed
		.map((clusters, i) => clusters
			.map(cluster => cluster
				.map(index => distanceClusters[i][index])));
	// get a flat array of all unique lines (one per cluster) found.
	const lines = clusterClusters
		.flatMap(clusters => clusters
			.map(cluster => cluster[0])
			.map(i => ({ vector: edgesVector[i], origin: edgesNearestToOrigin[i] })));
	// for each edge, set the index of its line in the "lines" array.
	const edges_line = [];
	let lineIndex = 0;
	clusterClusters.forEach(clusters => clusters.forEach(cluster => {
		cluster.forEach(i => { edges_line[i] = lineIndex; });
		lineIndex += 1;
	}));
	return {
		lines,
		edges_line,
	};
};