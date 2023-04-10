import { EPSILON } from "../math/general/constant.js";
import { vecLineToUniqueLine } from "../math/general/convert.js";
import { flip } from "../math/algebra/vector.js";
import {
	multiplyMatrix2Line2,
	makeMatrix2Reflect,
} from "../math/algebra/matrix2.js";
import {
	clusterScalars,
	clusterParallelVectors,
} from "../general/arrays.js";
import { getEdgesLine } from "./lines.js";

const fixLineDirection = ({ normal, distance }) => (distance < 0
	? ({ normal: flip(normal), distance: -distance })
	: ({ normal, distance }));
/**
 * @description Discover a line of symmetry in a FOLD graph.
 * This uses edges in the graph to find a line, if an edge doesn't exist
 * along the line of symmetry, the line will not be found.
 * @param {FOLD} graph a FOLD object with 2D vertices
 * @returns {VecLine[]} array of symmetry lines
 */
export const findSymmetryLines = (graph, epsilon = EPSILON) => {
	const { lines } = getEdgesLine(graph, epsilon);
	const uniqueLines = lines.map(vecLineToUniqueLine).map(fixLineDirection);
	const linesMatrices = lines
		.map(({ vector, origin }) => makeMatrix2Reflect(vector, origin));
	const reflectionsLines = linesMatrices
		.map(matrix => lines
			.map(({ vector, origin }) => multiplyMatrix2Line2(matrix, vector, origin)));
	const reflectionsUniqueLines = reflectionsLines
		.map(group => group.map(line => (line.vector[0] < 0
			? ({ vector: flip(line.vector), origin: line.origin })
			: line)))
		.map(group => group.map(vecLineToUniqueLine).map(fixLineDirection))
		.map(group => group.concat(uniqueLines));
	const groupsClusters = reflectionsUniqueLines
		.map(group => clusterScalars(group.map(el => el.distance)));
	const groupsClusterClustersUnindexed = groupsClusters
		.map((clusters, g) => clusters
			.map(cluster => cluster.map(i => reflectionsUniqueLines[g][i].normal))
			.map(cluster => clusterParallelVectors(cluster, epsilon)));
	const groupsClusterClusters = groupsClusterClustersUnindexed
		.map((group, g) => group
			.flatMap((clusters, c) => clusters
				.map(cluster => cluster
					.map(index => groupsClusters[g][c][index]))));
	const groupsError = groupsClusterClusters
		.map(group => (group.length - lines.length) / lines.length);
	return groupsError
		.map((error, i) => ({ error, i }))
		.map(el => ({ line: lines[el.i], error: el.error }))
		.sort((a, b) => a.error - b.error);
};

export const findSymmetryLine = (graph, epsilon = EPSILON) => (
	findSymmetryLines(graph, epsilon)[0]
);

// const bucketVertices = ({ vertices_coords }) => {
// 	const size = boundingBox({ vertices_coords }).span;
// 	const bucketID = point => point
// 		.map((p, i) => Math.floor((p / size[i]) * 100));
// 	const buckets = [];
// 	vertices_coords
// 		.map(coord => bucketID(coord))
// 		.forEach((id, i) => {
// 			// get a pointer to the inner-most array inside "buckets"
// 			let bucket = buckets;
// 			id.forEach(index => {
// 				if (!bucket[index]) { bucket[index] = []; }
// 				bucket = bucket[index];
// 			});
// 			bucket.push(i);
// 		});
// 	return buckets;
// };
//
// export const findSymmetryLines = (graph, epsilon = EPSILON) => {
// 	const { lines, edges_line } = getEdgesLine(graph, epsilon);
// 	const linesMatrices = lines
// 		.map(({ vector, origin }) => makeMatrix2Reflect(vector, origin));
// 	const linesCoordsSide = lines
// 		.map(line => graph.vertices_coords
// 			.map(coord => cross2(subtract2(coord, line.origin), line.vector) < 0));
// 	// for each line, a copy of the vertices_coords only on one side of the line
// 	const linesReflections = lines
// 		.map((_, i) => graph.vertices_coords
// 			.map((coord, j) => (linesCoordsSide[i][j]
// 				? coord
// 				: multiplyMatrix2Vector2(linesMatrices[i], coord))));
// 	const linesReflBuckets = linesReflections
// 		.map((coords, i) => coords
// 			.filter(point => !overlapLinePoint(lines[i], point)))
// 		.map(vertices_coords => bucketVertices({ vertices_coords }));
// 	const lengths = linesReflBuckets
// 		.map(group => group.flatMap(buckets => buckets.map(bucket => bucket.length)))
// 		.map(group => group.map(len => len % 2));
// 	// values between 0 and 1. lower is better.
// 	// 0 means every vertex aligns with another after reflection
// 	const groupRating = lengths
// 		.map(group => (group.length === 0 ? Infinity : group.reduce((a, b) => a + b, 0)))
// 		.map((sum, i) => sum / linesReflections[i].length)
// 		.map(n => (Number.isNaN(n) ? 1 : n));
// 	const validLines = groupRating
// 		.map((rating, i) => ({ rating, i }))
// 		.filter(el => el.rating < 0.8)
// 		.sort((a, b) => a.rating - b.rating)
// 		.map(el => el.i);
// 	// console.log("linesReflBuckets", linesReflBuckets);
// 	// console.log("lengths", lengths);
// 	// console.log("groupRating", groupRating);
// 	// console.log("validLines", validLines);
// 	return validLines.map(i => lines[i]);
// };
