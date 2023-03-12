/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../math/general/constant.js";
import { makeEdgesBoundingBox } from "./make.js";
/**
 * @description This returns a matrix relating every edge to every vertex,
 * answering the question "does the vertex sit inside the edge's bounding box?"
 * It doesn't solve if a vertex lies on an edge, only that it *might* lie along an edge.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon to be added as padding to the bounding boxes
 * @returns {boolean[][]} array matching edges_ length where each value is
 * an array matching vertices_ length, containing true/false.
 * @linkcode Origami ./src/graph/span.js 14
 */
export const getEdgesVerticesOverlappingSpan = (graph, epsilon = EPSILON) => (
	makeEdgesBoundingBox(graph, epsilon)
		.map(min_max => graph.vertices_coords
			.map(vert => (
				vert[0] > min_max.min[0]
				&& vert[1] > min_max.min[1]
				&& vert[0] < min_max.max[0]
				&& vert[1] < min_max.max[1])))
);
/**
 * @description Calculate every edge's rectangular bounding box and compare every box to
 * every box to determine if boxes overlap. This doesn't claim edges overlap, only that
 * their bounding boxes do, and that two edges *might* overlap.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon to be added as padding to the bounding boxes
 * @returns {boolean[][]} NxN 2D array filled with true/false answering
 * "do edges's bounding boxes overlap?"
 * Both triangles of the matrix are filled and the main diagonal contains true.
 * ```text
 *     0  1  2  3
 * 0 [ t,  ,  ,  ]
 * 1 [  , t,  ,  ]
 * 2 [  ,  , t,  ]
 * 3 [  ,  ,  , t]
 * ```
 * @linkcode Origami ./src/graph/span.js 41
 */
export const getEdgesEdgesOverlapingSpans = ({
	vertices_coords, edges_vertices, edges_coords,
}, epsilon = EPSILON) => {
	const min_max = makeEdgesBoundingBox({ vertices_coords, edges_vertices, edges_coords }, epsilon);
	const span_overlaps = edges_vertices.map(() => []);
	// span_overlaps will be false if no overlap possible, true if overlap is possible.
	for (let e0 = 0; e0 < edges_vertices.length - 1; e0 += 1) {
		for (let e1 = e0 + 1; e1 < edges_vertices.length; e1 += 1) {
			// if first max is less than second min, or second max is less than first min,
			// for both X and Y
			const outside_of = (
				(min_max[e0].max[0] < min_max[e1].min[0] || min_max[e1].max[0] < min_max[e0].min[0])
				&& (min_max[e0].max[1] < min_max[e1].min[1] || min_max[e1].max[1] < min_max[e0].min[1]));
			// true if the spans are not touching. flip for overlap
			span_overlaps[e0][e1] = !outside_of;
			span_overlaps[e1][e0] = !outside_of;
		}
	}
	for (let i = 0; i < edges_vertices.length; i += 1) {
		span_overlaps[i][i] = true;
	}
	return span_overlaps;
};
