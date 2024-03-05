import {
	EPSILON,
} from "../../math/constant.js";
import {
	epsilonEqualVectors,
} from "../../math/compare.js";
import {
	pointsToLine,
} from "../../math/convert.js";
import {
	magnitude,
	normalize,
	subtract,
	dot,
} from "../../math/vector.js";
import {
	clampLine,
} from "../../math/line.js";
import {
	projectPointOnPlane,
} from "../../math/plane.js";
import {
	nearestPointOnLine,
} from "../../math/nearest.js";
import {
	uniqueElements,
	arrayMinimumIndex,
	arrayMaximumIndex,
} from "../../general/array.js";
import {
	clusterScalars,
	clusterSortedGeneric,
	clusterParallelVectors,
} from "../../general/cluster.js";
import {
	radialSortVectors3,
} from "../../general/sort.js";
import {
	makeEdgesCoords,
} from "../make.js";
import {
	invertArrayToFlatMap,
} from "../maps.js";

/**
 * @description convert an edge to a vector-origin line.
 * @param {FOLD} graph a FOLD object
 * @param {number} edge the index of the edge
 * @returns {VecLine} a line form of the edge
 */
export const edgeToLine = ({ vertices_coords, edges_vertices }, edge) => (
	pointsToLine(
		vertices_coords[edges_vertices[edge][0]],
		vertices_coords[edges_vertices[edge][1]],
	));

/**
 * @description Most origami models have many edges which lie along
 * the same infinite line. This method finds all lines which cover all edges,
 * returning a list of lines, and a mapping of each edge to each line.
 * @param {FOLD} graph a FOLD object, can be 2D or 3D.
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

	// a vector-origin line representation of every edge. we will apply
	// clustering operations to this list to group edges with similar lines.
	const edgesLine = edgesVector
		.map((vector, i) => ({ vector, origin: edgesCoords[i][0] }));

	// this is the distance from the origin to the nearest point along the line
	// no epsilon is needed in nearestPointOnLine, because there is no clamp.
	const edgesOriginDistances = edgesLine
		.map(line => nearestPointOnLine(line, [0, 0, 0], clampLine))
		.map(point => magnitude(point));

	// begin clustering, we will cluster into 3 parts:
	// 1. cluster lines with similar distance-to-origin scalars.
	// 2. sub-cluster those which have parallel-vectors.
	// 3. sub-cluster those which are actually collinear, because
	//    a similar distance/vector can still be rotationally anywhere
	//    around the origin in 3D, or on opposite sides of the origin in 2D.
	// cluster edge indices based on a shared distance-to-origin
	const distanceClusters = clusterScalars(edgesOriginDistances, epsilon);

	// further subcluster the previous clusters based on whether the
	// line's vectors are parallel (these inner clusters share the same line)
	// we use a fixed epsilon here, the comparison is testing parallel-ness
	// with dot(v, u) with normalized vectors. so anything similar within
	// 1e-3 should suffice. We can't feed in the user epsilon, because an
	// epsilon of something like 5 would be meaningless here.
	const parallelDistanceClusters = distanceClusters
		.map(cluster => cluster.map(i => edgesVector[i]))
		.map(cluster => clusterParallelVectors(cluster, 1e-3))
		.map((clusters, i) => clusters
			.map(cluster => cluster
				.map(index => distanceClusters[i][index])));

	// one final time, cluster each subcluster once more. because we only
	// measured the distance to the origin, and the vector, we could be on equal
	// but opposite sides of the origin (unless it passes through the origin).
	const collinearParallelDistanceClusters = parallelDistanceClusters
		.map(clusters => clusters.map(cluster => {
			// values in "cluster" are edge indices.
			// if the cluster passes through the origin, all edges are collinear.
			if (Math.abs(edgesOriginDistances[cluster[0]]) < epsilon) {
				return [cluster];
			}

			// establish a shared vector for all lines in the cluster
			const clusterVector = edgesLine[cluster[0]].vector;

			// edges run orthogonal to the plane and will be
			// collapsed into one coplanar point
			const clusterPoints = cluster
				.map(e => vertices_coords[edges_vertices[e][0]])
				.map(point => projectPointOnPlane(point, clusterVector));

			// these points are all the same distance away from the origin,
			// radially sort them around the origin, using the line's vector
			// as the plane's normal.
			const sortedIndices = radialSortVectors3(clusterPoints, clusterVector);

			// values in "sortedIndices" now relate to indices of "cluster"
			// this comparison function will be used if two or more points satisfy
			// both #1 and #2 conditions, and need to be radially sorted in their plane.
			const compareFn = (i, j) => (
				epsilonEqualVectors(clusterPoints[i], clusterPoints[j], epsilon)
			);

			// indices are multi-layered related to indices of other arrays.
			// when all is done, this maps back to the original edge indices.
			const remap = cl => cl.map(i => sortedIndices[i]).map(i => cluster[i]);

			// now that the list is sorted, cluster any neighboring points
			// that are within an epsilon distance away from each other.
			const clusterResult = clusterSortedGeneric(sortedIndices, compareFn);

			// values in "clusterResult" now relate to indices of "sortedIndices"
			// one special case, since these are radially sorted, if the
			// first and last cluster are equivalent, merge them together
			if (clusterResult.length === 1) { return clusterResult.map(remap); }

			// get the first from cluster[0] and the last from cluster[n - 1]
			const firstFirst = clusterResult[0][0];
			const last = clusterResult[clusterResult.length - 1];
			const lastLast = last[last.length - 1];

			// map these back to relate to indices of "cluster".
			const endIndices = [firstFirst, lastLast].map(i => sortedIndices[i]);

			// if two points from either end clusters are similar,
			// merge the 0 and n-1 clusters into the 0 index.
			if (compareFn(...endIndices)) {
				const lastCluster = clusterResult.pop();
				clusterResult[0] = lastCluster.concat(clusterResult[0]);
			}
			return clusterResult.map(remap);
		}));

	// now we have all edges clustered according to which line they lie along.
	// here are the clusters, all edges inside of each cluster.
	const lines_edges = collinearParallelDistanceClusters
		.flatMap(clusterOfClusters => clusterOfClusters
			.flatMap(clusters => clusters));
	const edges_line = invertArrayToFlatMap(lines_edges);

	// get the most precise form of a line possible, this means,
	// for all segments which lie on this line, build a vector
	// from the furthest two points possible.
	// for each line/cluster, get a list of all vertices involved
	const lines_vertices = lines_edges
		.map(edges => edges.flatMap(e => edges_vertices[e]))
		.map(uniqueElements);

	// for each line/cluster, find the two vertices furthest on either end.
	// use one vector from the line, it doesn't matter which one.
	const lines_firstVector = lines_edges.map(edges => edgesVector[edges[0]]);

	// project each vertex onto the line, get the dot product
	// find the minimum and maximum vertices along the line's vector.
	const lines_vertProjects = lines_vertices
		.map((vertices, i) => vertices
			.map(v => dot(lines_firstVector[i], vertices_coords[v])));
	const lines_vertProjectsMin = lines_vertProjects
		.map((projections, i) => lines_vertices[i][arrayMinimumIndex(projections)]);
	const lines_vertProjectsMax = lines_vertProjects
		.map((projections, i) => lines_vertices[i][arrayMaximumIndex(projections)]);

	// for each line/cluster, create a vector from the furthest two vertices
	const lines_vector = lines_vertices.map((_, i) => subtract(
		vertices_coords[lines_vertProjectsMax[i]],
		vertices_coords[lines_vertProjectsMin[i]],
	));

	// for each line's origin, we want to use an existing vertex.
	const lines_origin = lines_vertProjectsMin.map(v => vertices_coords[v]);
	const lines = lines_vector
		.map((vector, i) => ({ vector, origin: lines_origin[i] }));
	return {
		lines,
		edges_line,
	};
};
