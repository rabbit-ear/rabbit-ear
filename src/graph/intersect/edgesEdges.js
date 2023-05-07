/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/general/constant.js";
import { excludeS } from "../../math/general/function.js";
import { overlapLineLine } from "../../math/intersect/overlap.js";
import {
	normalize,
	dot,
} from "../../math/algebra/vector.js";
import { intersectLineLine } from "../../math/intersect/intersect.js";
import { makeEdgesVector } from "../make.js";
import { sweepEdges } from "../sweep.js";
/**
 * @description get all intersections between edges in a 2D graph.
 * Edge endpoints are excluded.
 * @param {FOLD} graph a FOLD graph with 2D vertices
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns maybe this should be refactored
 */
export const getEdgesEdgesIntersection = ({
	vertices_coords, edges_vertices, vertices_edges, edges_vector, edges_origin,
}, epsilon = EPSILON, segmentFunc = excludeS) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	if (!edges_origin) {
		edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
	}
	const intersections = [];
	// as we progress through the line sweep, maintain a list (hash table)
	// of the set of edges which are currently overlapping this sweep line.
	const setOfEdges = [];
	sweepEdges({ vertices_coords, edges_vertices, vertices_edges }, epsilon)
		.forEach(event => {
			event.start.forEach(e => { setOfEdges[e] = true; });
			setOfEdges
				.forEach((_, e1) => event.start
					.forEach(e2 => {
						if (e1 === e2) { return; }
						const intersection = intersectLineLine(
							{ vector: edges_vector[e1], origin: edges_origin[e1] },
							{ vector: edges_vector[e2], origin: edges_origin[e2] },
							segmentFunc,
							segmentFunc,
							epsilon,
						);
						if (intersection) {
							if (!intersections[e1]) { intersections[e1] = []; }
							if (!intersections[e2]) { intersections[e2] = []; }
							intersections[e1][e2] = intersection;
							intersections[e2][e1] = intersection;
						}
					}));
			event.end.forEach(e => delete setOfEdges[e]);
		});
	return intersections;
};
/**
 * @description Create an NxN matrix (N number of edges) that relates edges to each other,
 * inside each entry is true/false, true if the two edges are parallel within an epsilon.
 * Both sides of the matrix are filled, the diagonal is left undefined.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean[][]} a boolean matrix, are two edges parallel?
 * @todo wait, no, this is not setting the main diagonal undefined now. what is up?
 * @linkcode Origami ./src/graph/edgesEdges.js 82
 */
const makeEdgesEdgesParallel = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const normalized = edges_vector.map(vec => normalize(vec));
	const edgesEdgesParallel = edges_vertices.map(() => []);
	normalized.forEach((_, i) => {
		normalized.forEach((__, j) => {
			if (j >= i) { return; }
			if ((1 - Math.abs(dot(normalized[i], normalized[j])) < epsilon)) {
				edgesEdgesParallel[i].push(j);
				edgesEdgesParallel[j].push(i);
			}
		});
	});
	return edgesEdgesParallel;
};
/**
 * @description Find all edges which are parallel to each other AND they overlap.
 * The epsilon space around vertices is not considered, so, edges must be
 * overlapping beyond just their endpoints for them to be considered.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean[][]} a boolean matrix, do two edges cross each other?
 */
export const makeEdgesEdgesParallelOverlap = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	const edges_line = edges_vector
		.map((vector, i) => ({ vector, origin: edges_origin[i] }));
	// start with edges-edges parallel matrix
	// only if lines are parallel, then run the more expensive overlap method
	return makeEdgesEdgesParallel({
		vertices_coords, edges_vertices, edges_vector,
	}, epsilon).map((arr, i) => arr.filter(j => overlapLineLine(
		edges_line[i],
		edges_line[j],
		excludeS,
		excludeS,
		epsilon,
	)));
};

// export const makeEdgesEdgesParallel = ({
// 	vertices_coords, edges_vertices, edges_vector,
// }, epsilon) => { // = EPSILON) => {
// 	if (!edges_vector) {
// 		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
// 	}
// 	// let lastTime = new Date();
// 	const edge_count = edges_vector.length;
// 	const normalized = edges_vector.map(vec => normalize(vec));
// 	// ///////////////////////////////////////
// 	// idk why this isn't working. it's leaving out some indices. something with
// 	// the group building - indices.slice(), something there.
// 	// const dots = normalized
// 	// 	.map(vec => math.dot(vec, [1, 0]));
// 	// const indices = Array.from(Array(edge_count))
// 	// 	.map((_, i) => i)
// 	// 	.sort((a, b) => dots[a] - dots[b]);
// 	// let start = 0;
// 	// const groups = [];
// 	// for (let i = 1; i < indices.length; i += 1) {
// 	// 	if (!epsilonEqual(dots[indices[start]], dots[indices[i]], epsilon)) {
// 	// 		groups.push(indices.slice(start, i));
// 	// 		start = i;
// 	// 	}
// 	// }
// 	// if (groups.length > 2) {
// 	// 	if (epsilonEqual(groups[0][0], -1, epsilon)
// 	// 		&& epsilonEqual(groups[groups.length - 1][0], 1, epsilon)) {
// 	// 		const lastGroup = groups.pop();
// 	// 		groups[0] = groups[0].concat(lastGroup);
// 	// 	}
// 	// }
// 	// const edges_edges_parallel = Array
// 	// 	.from(Array(edge_count))
// 	// 	.map(() => Array(edge_count).fill(false));
// 	// for (let g = 0; g < groups.length; g += 1) {
// 	// 	for (let i = 0; i < groups[g].length - 1; i += 1) {
// 	// 		for (let j = i + 1; j < groups[g].length; j += 1) {
// 	// 			edges_edges_parallel[groups[g][i]][groups[g][j]] = true;
// 	// 			edges_edges_parallel[groups[g][j]][groups[g][i]] = true;
// 	// 		}
// 	// 	}
// 	// }
// 	// console.log("groups", groups);
// 	// for (let i = 0; i < edge_count; i += 1) {
// 	// 	edges_edges_parallel[i][i] = undefined;
// 	// }
// 	const edges_edges_parallel = Array
// 		.from(Array(edge_count))
// 		.map(() => Array.from(Array(edge_count)));
// 	for (let i = 0; i < edge_count - 1; i += 1) {
// 		for (let j = i + 1; j < edge_count; j += 1) {
// 			const p = (1 - Math.abs(dot(normalized[i], normalized[j])) < epsilon);
// 			edges_edges_parallel[i][j] = p;
// 			edges_edges_parallel[j][i] = p;
// 		}
// 	}
// 	return edges_edges_parallel;
// };

/**
 * @description A subroutine for the two methods below.
 * given a matrix which was already worked on, consider only the true values,
 * compute the overlapLineLine method for each edge-pairs.
 * provide a comparison function (func) to specify inclusive/exclusivity.
 */
// const overwriteEdgesOverlaps = (edges_edges, vectors, origins, func, epsilon) => {
// 	const edges_edgesOverlap = edges_edges.map(() => []);
// 	edges_edges
// 		.forEach((arr, i) => arr
// 			.forEach(j => {
// 				if (i >= j) { return; }
// 				if (overlapLineLine(
// 					{ vector: vectors[i], origin: origins[i] },
// 					{ vector: vectors[j], origin: origins[j] },
// 					func,
// 					func,
// 					epsilon,
// 				)) {
// 					edges_edgesOverlap[i].push(j);
// 					edges_edgesOverlap[j].push(i);
// 				}
// 			}));
// 	return edges_edgesOverlap;
// };

// todo, improvement suggestion:
// first grouping edges into categories with edges which share parallel-ness.
// then, express every edge's endpoints in terms of the length along
// the vector. converting it into 2 numbers, and now all you have to do is
// test if these two numbers overlap other edges' two numbers.

/**
 * we want to include this case, where one edge may not overlap another
 * but it still gets included because both are overlapped by a common edge.
 *
 *  |----a-----|    |-------c------|
 *          |-----b----|
 *
 * "a" and "c" are included together because b causes them to be so.
 */
// const edges_radians = edges_vector
//   .map(v => Math.atan2(v[1], v[0]));
// const sorted = edges_radians
//   .map(rad => rad > 0 ? rad : rad + Math.PI)
//   .map((radians, i) => ({ radians, i }))
//   .sort((a, b) => a.radians - b.radians);

// const similar_num = (a, b, epsilon = 0.001) => Math
//   .abs(a - b) < epsilon;

// const parallel_groups = [
//   []
// ];
// let group_i = 0;

// const edges_parallel = Array
//   .from(Array(edge_count))
//   .map(() => []);
// let walk = 0;
// for (let i = 1; i < edge_count; i++) {
//   while (!similar_num(sorted[walk].radians, sorted[i].radians) && walk < i) {
//     walk++;
//   }
//   for (let j = walk; j < i; j++) {
//     edges_parallel[j].push(i);
//   }
// }
