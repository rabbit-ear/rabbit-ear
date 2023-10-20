/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/constant.js";
import {
	includeL,
	includeS,
} from "../../math/compare.js";
import { subtract2 } from "../../math/vector.js";
import { boundingBox } from "../../math/polygon.js";
import { intersectLineLine } from "../../math/intersect.js";
import {
	makeVerticesEdgesUnsorted,
	makeEdgesCoords,
} from "../make.js";
import { getVerticesCollinearToLine } from "./vertices.js";
/**
 * @description Find all edges in a graph which lie parallel
 * and on top of a line (infinite line). Can be 2D or 3D.
 * @param {FOLD} graph a FOLD object
 * @param {VecLine} line a line with a vector and origin component
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[]} array of edge indices which are collinear to the line
 * @linkcode Origami ./src/graph/intersect.js 39
 * @bigO O(n) where n=edges
 */
export const getEdgesCollinearToLine = (
	{ vertices_coords, edges_vertices, vertices_edges },
	{ vector, origin },
	epsilon = EPSILON,
) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const verticesCollinear = getVerticesCollinearToLine(
		{ vertices_coords },
		{ vector, origin },
		epsilon,
	);
	const edgesCollinearCount = edges_vertices.map(() => 0);
	verticesCollinear
		.forEach(vertex => vertices_edges[vertex]
			.forEach(edge => { edgesCollinearCount[edge] += 1; }));
	return edgesCollinearCount
		.map((count, i) => ({ count, i }))
		.filter(el => el.count === 2)
		.map(el => el.i);
};
/**
 * @description Given an axis-aligned bounding box, get a list of all
 * edge indices which overlap this bounding box in 2D. This can be used
 * before computing an intersection of some geometry against all edges.
 */
export const getEdgesRectOverlap = (
	{ vertices_coords, edges_vertices },
	{ min, max },
	epsilon = EPSILON,
) => {
	const coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	const boxMin = min.map(n => n - epsilon);
	const boxMax = max.map(n => n + epsilon);
	return edges_vertices
		.map((_, i) => i)
		.filter(e => !(coords[e][0][0] < boxMin[0] && coords[e][1][0] < boxMin[0]))
		.filter(e => !(coords[e][0][0] > boxMax[0] && coords[e][1][0] > boxMax[0]))
		.filter(e => !(coords[e][0][1] < boxMin[1] && coords[e][1][1] < boxMin[1]))
		.filter(e => !(coords[e][0][1] > boxMax[1] && coords[e][1][1] > boxMax[1]));
};
/**
 * @description Find all intersections between a segment and all edges
 * of a 2D graph. The method is hard-coded to be inclusive, include both
 * the endpoints of the segment, and the endpoints of each edge.
 * @param {object} a FOLD graph
 * @param {number[]} point1, the first point of the segment
 * @param {number[]} point2, the second point of the segment
 * @returns {number[]} array with holes where the
 * index is the edge number and the value is the intersection point
 * @linkcode Origami ./src/graph/intersect.js 73
 */
export const getEdgesSegmentIntersection = ({
	vertices_coords, edges_vertices,
}, point1, point2, epsilon = EPSILON) => {
	const segmentBox = boundingBox([point1, point2]);
	const segmentVector = subtract2(point2, point1);
	const segmentLine = { vector: segmentVector, origin: point1 };
	// possible edges which overlap (based on axis aligned bounding box overlap)
	const edges = getEdgesRectOverlap({ vertices_coords, edges_vertices }, segmentBox, epsilon);
	const intersections = [];
	// for the remaining edges, convert each into line parameterization,
	// run the intersection method and in the case of a result, set the array.
	edges.forEach(e => {
		const edgeCoords = edges_vertices[e].map(v => vertices_coords[v]);
		const edgeVector = subtract2(edgeCoords[1], edgeCoords[0]);
		const edgeLine = { vector: edgeVector, origin: edgeCoords[0] };
		const intersect = intersectLineLine(segmentLine, edgeLine, includeS, includeS, epsilon).point;
		if (!intersect) { return; }
		intersections[e] = intersect;
	});
	return intersections;
};
/**
 * @description Find all intersections between a segment and all edges
 * of a 2D graph. The method is hard-coded to be inclusive, include both
 * the endpoints of the segment, and the endpoints of each edge.
 * @param {object} a FOLD graph
 * @param {number[]} point1, the first point of the segment
 * @param {number[]} point2, the second point of the segment
 * @returns {number[]} array with holes where the
 * index is the edge number and the value is the intersection point
 * @linkcode Origami ./src/graph/intersect.js 73
 */
export const getEdgesLineIntersection = ({
	vertices_coords, edges_vertices,
}, { vector, origin }, epsilon = EPSILON, segmentFunc = includeS) => edges_vertices
	.map(vertices => {
		const edgeCoords = vertices.map(v => vertices_coords[v]);
		const edgeVector = subtract2(edgeCoords[1], edgeCoords[0]);
		const edgeLine = { vector: edgeVector, origin: edgeCoords[0] };
		return intersectLineLine({ vector, origin }, edgeLine, includeL, segmentFunc, epsilon).point;
	});
