/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/constant.js";
import { excludeS } from "../../math/compare.js";
import { overlapLineLine } from "../../math/overlap.js";
import {
	normalize,
	dot,
} from "../../math/vector.js";
import { makeEdgesVector } from "../make.js";

/**
 * @description Create an NxN matrix (N number of edges) that relates edges to each other,
 * inside each entry is true/false, true if the two edges are parallel within an epsilon.
 * Both sides of the matrix are filled, the diagonal is left undefined.
 * @param {FOLD} graph a FOLD object
 * @param {number} [normalizedEpsilon=1e-6] an optional epsilon used in dot()
 * for normalized vectors. this epsilon should be small.
 * @returns {boolean[][]} a boolean matrix, are two edges parallel?
 * @todo wait, no, this is not setting the main diagonal undefined now. what is up?
 * @linkcode Origami ./src/graph/edgesEdges.js 82
 */
const makeEdgesEdgesParallel = ({
	vertices_coords, edges_vertices, edges_vector,
}, normalizedEpsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const normalized = edges_vector.map(vec => normalize(vec));
	const edgesEdgesParallel = edges_vertices.map(() => []);
	normalized.forEach((_, i) => {
		normalized.forEach((__, j) => {
			if (j >= i) { return; }
			if ((1 - Math.abs(dot(normalized[i], normalized[j])) < normalizedEpsilon)) {
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
	}, 1e-3).map((arr, i) => arr.filter(j => overlapLineLine(
		edges_line[i],
		edges_line[j],
		excludeS,
		excludeS,
		epsilon,
	)));
};
