/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../math/general/constant.js";
import {
	includeL,
	includeS,
	excludeS,
	epsilonEqualVectors,
} from "../math/general/function.js";
import {
	normalize2,
	subtract2,
	parallel2,
	dot2,
	subtract,
} from "../math/algebra/vector.js";
import {
	boundingBox,
} from "../math/geometry/polygon.js";
import {
	overlapLinePoint,
	overlapBoundingBoxes,
} from "../math/intersect/overlap.js";
import { intersectLineLine } from "../math/intersect/intersect.js";
import {
	makeEdgesVector,
	makeEdgesCoords,
	makeEdgesBoundingBox,
} from "./make.js";
import { sweepEdges } from "./sweep.js";
import { getEdgesEdgesOverlapingSpans } from "./span.js";

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
	const setOfEdges = {};
	sweepEdges({ vertices_coords, edges_vertices, vertices_edges }, epsilon)
		.forEach(event => {
			Object.keys(setOfEdges)
				.map(n => parseInt(n, 10))
				.forEach(e1 => event.add
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
			event.add.forEach(e => { setOfEdges[e] = true; });
			event.remove.forEach(e => delete setOfEdges[e]);
		});
	return intersections;
	// current set of edges
	// loop
	// for every new edge, perform intersection with it against every edge in the set
	// add new edges to the set
	// remove remove edges from the set.
};
/**
 * @description intersect a convex face with a line and return the location
 * of the intersections as components of the graph. this is an EXCLUSIVE
 * intersection. line collinear to the edge counts as no intersection.
 * there are 5 cases:
 * - no intersection (undefined)
 * - intersect one vertex (undefined)
 * - intersect two vertices (valid, or undefined if neighbors)
 * - intersect one vertex and one edge (valid)
 * - intersect two edges (valid)
 * @param {FOLD} graph a FOLD object
 * @param {number} face the index of the face
 * @param {number[]} vector the vector component describing the line
 * @param {number[]} origin a point that lies along the line
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object|undefined} "vertices" and "edges" keys, indices of the
 * components which intersect the line. or undefined if no intersection
 * @linkcode Origami ./src/graph/intersect.js 162
 */
export const intersectConvexFaceLine = ({
	vertices_coords, edges_vertices, faces_vertices, faces_edges,
}, face, { vector, origin }, epsilon = EPSILON) => {
	// give us back the indices in the faces_vertices[face] array
	// we can count on these being sorted (important later)
	const face_vertices_indices = faces_vertices[face]
		.map(v => vertices_coords[v])
		.map(coord => overlapLinePoint({ vector, origin }, coord, () => true, epsilon))
		.map((overlap, i) => (overlap ? i : undefined))
		.filter(i => i !== undefined);
	// o-----o---o  we have to test against cases like this, where more than two
	// |         |  vertices lie along one line.
	// o---------o
	const vertices = face_vertices_indices.map(i => faces_vertices[face][i]);
	// concat a duplication of the array where the second array's vertices'
	// indices' are all increased by the faces_vertices[face].length.
	// ask every neighbor pair if they are 1 away from each other, if so, the line
	// lies along an outside edge of the convex poly, return "no intersection".
	// the concat is needed to detect neighbors across the end-beginning loop.
	const vertices_are_neighbors = face_vertices_indices
		.concat(face_vertices_indices.map(i => i + faces_vertices[face].length))
		.map((n, i, arr) => arr[i + 1] - n === 1)
		.reduce((a, b) => a || b, false);
	// if vertices are neighbors
	// because convex polygon, if collinear vertices lie along an edge,
	// it must be an outside edge. this case returns no intersection.
	if (vertices_are_neighbors) { return undefined; }
	if (vertices.length > 1) { return { vertices, edges: [] }; }
	// run the line-segment intersection on every side of the face polygon
	const edges = faces_edges[face]
		.map(edge => edges_vertices[edge]
			.map(v => vertices_coords[v]))
		.map(seg => intersectLineLine(
			{ vector, origin },
			{ vector: subtract(seg[1], seg[0]), origin: seg[0] },
			includeL,
			excludeS,
			epsilon,
		)).map((coords, face_edge_index) => ({
			coords,
			edge: faces_edges[face][face_edge_index],
		}))
		// remove edges with no intersection
		.filter(el => el.coords !== undefined)
		// remove edges which share a vertex with a previously found vertex.
		// these edges are because the intersection is near a vertex but also
		// intersects the edge very close to the end.
		.filter(el => !(vertices
			.map(v => edges_vertices[el.edge].includes(v))
			.reduce((a, b) => a || b, false)));
	// only return the case with 2 intersections. for example, only 1 vertex
	// intersection implies outside the polygon, collinear with one vertex.
	return (edges.length + vertices.length === 2
		? { vertices, edges }
		: undefined);
};
