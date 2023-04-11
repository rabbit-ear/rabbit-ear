/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/general/constant.js";
import {
	includeS,
	epsilonEqualVectors,
} from "../../math/general/function.js";
import {
	normalize2,
	subtract2,
	parallel2,
	dot2,
} from "../../math/algebra/vector.js";
import { boundingBox } from "../../math/geometry/polygon.js";
import { overlapBoundingBoxes } from "../../math/intersect/overlap.js";
import { intersectLineLine } from "../../math/intersect/intersect.js";
import {
	makeEdgesCoords,
	makeEdgesBoundingBox,
} from "../make.js";
/**
 * @description Find all edges in a graph which lie parallel along a line (infinite line).
 * @param {FOLD} graph a FOLD object
 * @param {number[]} vector a line defined by a vector crossing a point
 * @param {number[]} point a line defined by a vector crossing a point
 * @returns {boolean[]} length matching number of edges, true if parallel and overlapping
 * @linkcode Origami ./src/graph/intersect.js 39
 */
export const makeEdgesLineParallelOverlap = ({
	vertices_coords, edges_vertices,
}, vector, point, epsilon = EPSILON) => {
	const normalized = normalize2(vector);
	const edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
	const edges_vector = edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]))
		.map(edge => subtract2(edge[1], edge[0]));
	// first, filter out edges which are not parallel
	const overlap = edges_vector
		.map(vec => parallel2(vec, vector, epsilon));
	// second, filter out edges which do not lie on top of the line
	for (let e = 0; e < edges_vertices.length; e += 1) {
		if (!overlap[e]) { continue; }
		if (epsilonEqualVectors(edges_origin[e], point)) {
			overlap[e] = true;
			continue;
		}
		const vec = normalize2(subtract2(edges_origin[e], point));
		const dot = Math.abs(dot2(vec, normalized));
		overlap[e] = Math.abs(1.0 - dot) < epsilon;
	}
	return overlap;
};
/**
 * @description Find all edges in a graph which lie parallel along a segment, the
 * endpoints of the segments and the edges are inclusive.
 * @param {object} a FOLD graph
 * @param {number[]} point1, the first point of the segment
 * @param {number[]} point2, the second point of the segment
 * @returns {number[]} array length matching number of edges containing a point
 * if there is an intersection, and undefined if no intersection.
 * @linkcode Origami ./src/graph/intersect.js 73
 */
export const makeEdgesSegmentIntersection = ({
	vertices_coords, edges_vertices, edges_coords,
}, point1, point2, epsilon = EPSILON) => {
	if (!edges_coords) {
		edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	}
	const segment_box = boundingBox([point1, point2], epsilon);
	const segment_vector = subtract2(point2, point1);
	// convert each edge into a bounding box, do bounding-box intersection
	// with the segment, filter these results, then run actual intersection
	// algorithm on this subset.
	return makeEdgesBoundingBox({ vertices_coords, edges_vertices, edges_coords }, epsilon)
		.map(box => overlapBoundingBoxes(segment_box, box))
		.map((overlap, i) => (overlap ? (intersectLineLine(
			{ vector: segment_vector, origin: point1 },
			{
				vector: subtract2(edges_coords[i][1], edges_coords[i][0]),
				origin: edges_coords[i][0],
			},
			includeS,
			includeS,
			epsilon,
		)) : undefined));
};
/**
 * @description This method compares every edge against every edge (n^2) to see if the
 * segments exclusively intersect each other (touching endpoints doesn't count)
 * @param {FOLD} graph a FOLD graph. only requires { edges_vector, edges_origin }
 * if they don't exist this will build them from { vertices_coords, edges_vertices }
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][][]} NxN matrix comparing indices, arrays will contain holes,
 * a point object in array form if yes, and this array is stored
 * in 2 PLACES! both [i][j] and [j][i], however it is stored by reference,
 * it is the same js object.
 *     0  1  2  3
 * 0 [  , x,  ,  ]
 * 1 [ x,  ,  , x]
 * 2 [  ,  ,  ,  ]
 * 3 [  , x,  ,  ]
 * @linkcode Origami ./src/graph/intersect.js 114
 */
// export const makeEdgesEdgesIntersection = function ({
// 	vertices_coords, edges_vertices, edges_vector, edges_origin,
// }, epsilon = EPSILON) {
// 	if (!edges_vector) {
// 		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
// 	}
// 	if (!edges_origin) {
// 		edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
// 	}
// 	const edges_intersections = edges_vector.map(() => []);
// 	const span = getEdgesEdgesOverlapingSpans({ vertices_coords, edges_vertices }, epsilon);
// 	for (let i = 0; i < edges_vector.length - 1; i += 1) {
// 		for (let j = i + 1; j < edges_vector.length; j += 1) {
// 			if (span[i][j] !== true) { continue; }
// 			const intersection = intersectLineLine(
// 				{ vector: edges_vector[i], origin: edges_origin[i] },
// 				{ vector: edges_vector[j], origin: edges_origin[j] },
// 				excludeS,
// 				excludeS,
// 				epsilon,
// 			);
// 			if (intersection !== undefined) {
// 				edges_intersections[i][j] = intersection;
// 				edges_intersections[j][i] = intersection;
// 			}
// 		}
// 	}
// 	return edges_intersections;
// };
