// /**
//  * Rabbit Ear (c) Kraft
//  */
// import {
// 	EPSILON,
// } from "../math/constant.js";
// import {
// 	includeL,
// 	includeR,
// 	includeS,
// } from "../math/compare.js";
// import {
// 	pointsToLine,
// } from "../math/convert.js";
// import {
// 	intersectLineMakeEdges,
// } from "./fold.js";

// /**
//  * @description Given a 2D line and a graph with vertices in 2D, split
//  * the line at every vertex/edge, resulting in a graph containing only
//  * the new line, prepared as a list of vertices and edges. The indices
//  * of the resulting graph are made into arrays with a large hole
//  * at the start making sure there is no overlap with the existing graph's
//  * indices. This allows the two graphs to very simply be able to be merged.
//  * The edge indices will make use of existing vertices when possible, so,
//  * edges_vertices may reference vertex indices from the source graph.
//  * @param {FOLD} graph a fold graph in creasePattern or foldedForm
//  * @param {VecLine} line a line in vector origin form
//  * @param {number} [epsilon=1e-6] an optional epsilon
//  * @returns {FOLD} graph a FOLD graph containing only the line's
//  * geometry, as a list of vertices and edges, but with some additional data:
//  * - vertices_overlapInfo: for each vertex, this is the result of the
//  *   intersection algorithm which made the vertex. useful for re-calculating
//  *   the coordinate in another graph's space (transfer foldedForm to CP)
//  * - edges_collinear: a list of edge indices from the original graph that
//  *   lie collinear to this line. You may want to use this to change the
//  *   edge assignment of these edges.
//  */
// export const splitLineWithGraph = (graph, line, epsilon = EPSILON) => (
// 	intersectLineMakeEdges(graph, line, includeL, [], epsilon)
// );

// /**
//  * @description Given a 2D ray and a graph with vertices in 2D, split
//  * the ray at every vertex/edge, resulting in a graph containing only
//  * the new ray, prepared as a list of vertices and edges. The indices
//  * of the resulting graph are made into arrays with a large hole
//  * at the start making sure there is no overlap with the existing graph's
//  * indices. This allows the two graphs to very simply be able to be merged.
//  * The edge indices will make use of existing vertices when possible, so,
//  * edges_vertices may reference vertex indices from the source graph.
//  * @param {FOLD} graph a fold graph in creasePattern or foldedForm
//  * @param {VecLine} ray a ray in vector origin form
//  * @param {number} [epsilon=1e-6] an optional epsilon
//  * @returns {FOLD} graph a FOLD graph containing only the ray's
//  * geometry, as a list of vertices and edges, but with some additional data:
//  * - vertices_overlapInfo: for each vertex, this is the result of the
//  *   intersection algorithm which made the vertex. useful for re-calculating
//  *   the coordinate in another graph's space (transfer foldedForm to CP)
//  * - edges_collinear: a list of edge indices from the original graph that
//  *   lie collinear to this ray. You may want to use this to change the
//  *   edge assignment of these edges.
//  */
// export const splitRayWithGraph = (graph, ray, epsilon = EPSILON) => (
// 	intersectLineMakeEdges(graph, ray, includeR, [ray.origin], epsilon)
// );

// /**
//  * @description Given a 2D segment and a graph with vertices in 2D, split
//  * the segment at every vertex/edge, resulting in a graph containing only
//  * the new segment, prepared as a list of vertices and edges. The indices
//  * of the resulting graph are made into arrays with a large hole
//  * at the start making sure there is no overlap with the existing graph's
//  * indices. This allows the two graphs to very simply be able to be merged.
//  * The edge indices will make use of existing vertices when possible, so,
//  * edges_vertices may reference vertex indices from the source graph.
//  * @param {FOLD} graph a fold graph in creasePattern or foldedForm
//  * @param {number[][]} segment a segment in vector origin form
//  * @param {number} [epsilon=1e-6] an optional epsilon
//  * @returns {FOLD} graph a FOLD graph containing only the segment's
//  * geometry, as a list of vertices and edges, but with some additional data:
//  * - vertices_overlapInfo: for each vertex, this is the result of the
//  *   intersection algorithm which made the vertex. useful for re-calculating
//  *   the coordinate in another graph's space (transfer foldedForm to CP)
//  * - edges_collinear: a list of edge indices from the original graph that
//  *   lie collinear to this segment. You may want to use this to change the
//  *   edge assignment of these edges.
//  */
// export const splitSegmentWithGraph = (graph, segment, epsilon = EPSILON) => (
// 	intersectLineMakeEdges(
// 		graph,
// 		pointsToLine(...segment),
// 		includeS,
// 		segment,
// 		epsilon,
// 	)
// );
