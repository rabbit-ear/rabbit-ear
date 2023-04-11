/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/general/constant.js";
import { excludeS } from "../../math/general/function.js";
import { overlapLineLine } from "../../math/intersect/overlap.js";
import { makeEdgesVector } from "../make.js";
import {
	normalize,
	dot,
} from "../../math/algebra/vector.js";
import { sweepEdges } from "../sweep.js";
import { intersectLineLine } from "../../math/intersect/intersect.js";
/**
 *
 */
export const getEdgesEdgesIntersection = ({
	vertices_coords, edges_vertices, vertices_edges, edges_vector, edges_origin,
}, epsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	if (!edges_origin) {
		edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
	}
	const intersections = [];
	// as we progress through the line sweep, maintain a list (hash table)
	// of the set of edges which are currently overlapping this sweep line.
	const setOfEdges = {};
	sweepEdges({ vertices_coords, edges_vertices, vertices_edges }, epsilon)
		.forEach(event => {
			Object.keys(setOfEdges)
				.map(n => parseInt(n, 10))
				.forEach(e1 => event.edgesStart
					.forEach(e2 => {
						const intersection = intersectLineLine(
							{ vector: edges_vector[e1], origin: edges_origin[e1] },
							{ vector: edges_vector[e2], origin: edges_origin[e2] },
							excludeS,
							excludeS,
							epsilon,
						);
						if (intersection) {
							if (!intersections[e1]) { intersections[e1] = []; }
							if (!intersections[e2]) { intersections[e2] = []; }
							intersections[e1][e2] = intersection;
							intersections[e2][e1] = intersection;
						}
					}));
			event.edgesStart.forEach(e => { setOfEdges[e] = true; });
			event.edgesEnd.forEach(e => delete setOfEdges[e]);
		});
	return intersections;
};
/**
 *
 */
const makeEdgesEdgesNotParallel = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const normalized = edges_vector.map(vec => normalize(vec));
	return normalized
		.map((vec1, i) => normalized
			.map((vec2, j) => (i === j
				? undefined
				: (1 - Math.abs(dot(normalized[i], normalized[j])) < epsilon)))
			.map((parallel, j) => (parallel ? undefined : j))
			.filter(a => a !== undefined));
};

/**
 * @description A subroutine for the two methods below.
 * given a matrix which was already worked on, consider only the true values,
 * compute the overlapLineLine method for each edge-pairs.
 * provide a comparison function (func) to specify inclusive/exclusivity.
 */
const overwriteEdgesOverlaps = (edges_edges, vectors, origins, func, epsilon) => {
	const edges_edgesOverlap = edges_edges.map(() => []);
	edges_edges
		.forEach((arr, i) => arr
			.forEach(j => {
				if (i >= j) { return; }
				if (overlapLineLine(
					{ vector: vectors[i], origin: origins[i] },
					{ vector: vectors[j], origin: origins[j] },
					func,
					func,
					epsilon,
				)) {
					edges_edgesOverlap[i].push(j);
					edges_edgesOverlap[j].push(i);
				}
			}));
	return edges_edgesOverlap;
};
// const overwriteEdgesOverlaps = (matrix, vectors, origins, func, epsilon) => {
// 	// relationship between i and j is non-directional.
// 	for (let i = 0; i < matrix.length - 1; i += 1) {
// 		for (let j = i + 1; j < matrix.length; j += 1) {
// 			// if value is are already false, skip.
// 			if (!matrix[i][j]) { continue; }
// 			matrix[i][j] = math.overlapLineLine(
// 				{ vector: vectors[i], origin: origins[i] },
// 				{ vector: vectors[j], origin: origins[j] },
// 				func,
// 				func,
// 				epsilon,
// 			);
// 			matrix[j][i] = matrix[i][j];
// 		}
// 	}
// };
/**
 * @description Find all edges which cross other edges, "cross" meaning
 * the segment overlaps the other segment in a non-parallel way. This also
 * excludes the epsilon space around the endpoints so that adjacent edges
 * are automatically considered not crossing. All parallel line pairs,
 * even if overlapping, are marked false.
 * @param {object} fold a FOLD graph.
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean[][]} a boolean matrix, do two edges cross each other?
 */
export const makeEdgesEdgesCrossing = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	// use graph vertices_coords for edges vertices
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	// convert parallel into NOT parallel.
	const edge_edgesNotParallel = makeEdgesEdgesNotParallel({
		vertices_coords, edges_vertices, edges_vector,
	}, epsilon);
	// if edges are parallel (not this value), skip.
	return overwriteEdgesOverlaps(
		edge_edgesNotParallel,
		edges_vector,
		edges_origin,
		excludeS,
		epsilon,
	);
};
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
/**
 * @description folds the graph then groups edges into categories if edges
 * overlap and are parallel. groups are only formed for groups of 2 or more.
 * any edges which is isolated in the folded form will be ignored.
 */
/*
const make_groups_edges = (graph, epsilon) => {
	// gather together all edges which lie on top of one another in the
	// folded state. take each edge's two adjacent faces,
	const overlap_matrix = makeEdgesEdgesParallelOverlap(graph, epsilon)
	const overlapping_edges = booleanMatrixToIndexedArray(overlap_matrix);
	// each index will be an edge, each value is a group, starting with 0,
	// incrementing upwards. for all unique edges, array will be [0, 1, 2, 3...]
	// if edges 0 and 3 share a group, array will be [0, 1, 2, 0, 3...]
	const edges_group = connectedComponentsArray(overlapping_edges);
	// gather groups, but remove groups with only one edge, and from the
	// remaining sets, remove any edges which lie on the boundary.
	// finally, remove sets with only one edge (after removing).
	return invertMap(edges_group)
		.filter(el => typeof el === "object")
		.map(edges => edges
			.filter(edge => graph.edges_faces[edge].length === 2))
		.filter(edges => edges.length > 1);
};
*/
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
export const makeEdgesEdgesParallel = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const normalized = edges_vector.map(vec => normalize(vec));
	return normalized
		.map((vec1, i) => normalized
			.map((vec2, j) => (i === j
				? undefined
				: (1 - Math.abs(dot(normalized[i], normalized[j])) < epsilon)))
			.map((parallel, j) => (parallel ? j : undefined))
			.filter(a => a !== undefined));
};
/**
 *
 */
export const makeEdgesEdges2DParallel = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const sorted = edges_vector
		.map(vec => Math.atan2(vec[1], vec[0]))
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a);
	let prev = -1;
	let found = -1;
	sorted.forEach((el, i) => {
		if (prev === -1) { return; }
		if (Math.abs(el.a - sorted[prev].a) < epsilon) { found = i; }
		prev = i;
	});
	if (found === -1) {
		// special case
	}
	const shifted = sorted
		.slice(found)
		.concat(sorted.slice(0, found))
		.filter(a => a);
	console.log("shifted", shifted);

	// todo

	// const normalized = edges_vector.map(vec => math.normalize(vec));
	// return normalized
	// 	.map((vec1, i) => normalized
	// 		.map((vec2, j) => (i === j
	// 			? undefined
	// 			: (1 - Math.abs(math.dot(normalized[i], normalized[j])) < epsilon)))
	// 		.map((parallel, j) => (parallel ? j : undefined))
	// 		.filter(a => a !== undefined));
};
// below is the first iteration which does not work with arrays with holes.
/*
export const makeEdgesEdgesParallel = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon) => { // = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	// let lastTime = new Date();
	const edge_count = edges_vector.length;
	const normalized = edges_vector
		.map(vec => math.normalize(vec));
	// ///////////////////////////////////////
	// idk why this isn't working. it's leaving out some indices. something with
	// the group building - indices.slice(), something there.
	// const dots = normalized
	// 	.map(vec => math.dot(vec, [1, 0]));
	// const indices = Array.from(Array(edge_count))
	// 	.map((_, i) => i)
	// 	.sort((a, b) => dots[a] - dots[b]);
	// let start = 0;
	// const groups = [];
	// for (let i = 1; i < indices.length; i += 1) {
	// 	if (!epsilonEqual(dots[indices[start]], dots[indices[i]], epsilon)) {
	// 		groups.push(indices.slice(start, i));
	// 		start = i;
	// 	}
	// }
	// if (groups.length > 2) {
	// 	if (epsilonEqual(groups[0][0], -1, epsilon)
	// 		&& epsilonEqual(groups[groups.length - 1][0], 1, epsilon)) {
	// 		const lastGroup = groups.pop();
	// 		groups[0] = groups[0].concat(lastGroup);
	// 	}
	// }
	// const edges_edges_parallel = Array
	// 	.from(Array(edge_count))
	// 	.map(() => Array(edge_count).fill(false));
	// for (let g = 0; g < groups.length; g += 1) {
	// 	for (let i = 0; i < groups[g].length - 1; i += 1) {
	// 		for (let j = i + 1; j < groups[g].length; j += 1) {
	// 			edges_edges_parallel[groups[g][i]][groups[g][j]] = true;
	// 			edges_edges_parallel[groups[g][j]][groups[g][i]] = true;
	// 		}
	// 	}
	// }
	// console.log("groups", groups);
	// for (let i = 0; i < edge_count; i += 1) {
	// 	edges_edges_parallel[i][i] = undefined;
	// }
	const edges_edges_parallel = Array
		.from(Array(edge_count))
		.map(() => Array.from(Array(edge_count)));
	for (let i = 0; i < edge_count - 1; i += 1) {
		for (let j = i + 1; j < edge_count; j += 1) {
			const p = (1 - Math.abs(math.dot(normalized[i], normalized[j])) < epsilon);
			edges_edges_parallel[i][j] = p;
			edges_edges_parallel[j][i] = p;
		}
	}
	return edges_edges_parallel;
};
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
/**
 * @description Find all edges which are parallel to each other AND they overlap.
 * The epsilon space around vertices is not considered, so, edges must be
 * truly overlapping for them to be true.
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
	// start with edges-edges parallel matrix
	const edges_edgesParallel = makeEdgesEdgesParallel({
		vertices_coords, edges_vertices, edges_vector,
	}, epsilon);
	// only if lines are parallel, then run the more expensive overlap method
	return overwriteEdgesOverlaps(
		edges_edgesParallel,
		edges_vector,
		edges_origin,
		excludeS,
		epsilon,
	);
};
