/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/constant.js";
import {
	includeL,
	excludeS,
} from "../../math/compare.js";
import { overlapLinePoint } from "../../math/overlap.js";
import { intersectLineLine } from "../../math/intersect.js";
import {
	normalize2,
	dot2,
	cross2,
	subtract2,
} from "../../math/vector.js";
/**
 *
 */
const signLine = () => 0;
const signRay = (n, epsilon) => (n < -epsilon ? -1 : 0);
const signSegment = (n, epsilon) => (n < -epsilon ? -1 : (n > 1 + epsilon ? 1 : 0));
/**
 * @description Given a line, does each face inclusively overlap the line?
 * This takes a signFunc which will treat the line as a line/ray/segment.
 * The algorithm establishes a coordinate system aligned with the line's
 * vector, every vertex is filtered into three states per axis: -1, 0, 1,
 * indicating -1/+1 on either side, and 0 meaning an overlap.
 * Faces which overlap the line will include vertices which cross over
 * sections, or lie inside the overlap area.
 * This assumes that the faces of the graph are convex.
 *
 * behind left    |  overlap left   |  infront left
 * --------------------------------------------------
 * behind overlap | overlap overlap | infront overlap
 * --------------------------------------------------
 * behind right   |  overlap right  |  infront right
 *
 * where the line/segment/ray is inside the middle section:
 *
 *                |                 |
 * --------------------------------------------------
 *                |----the line---->|
 * --------------------------------------------------
 *                |                 |
 */
export const facesLineTypeOverlap = (
	{ vertices_coords, faces_vertices },
	{ vector, origin },
	signFunc = signLine,
	epsilon = EPSILON,
) => {
	const magSq = dot2(vector, vector);
	const unitVector = normalize2(vector);
	// for every vertex, which side (+1/-1) of the segment is the point?
	// if the point lies along the line within an epsilon it will be 0.
	const verticesCrossSide = vertices_coords
		.map(coord => subtract2(coord, origin))
		.map(vec => normalize2(vec))
		.map(vec => cross2(unitVector, vec))
		.map(s => (Math.abs(s) < epsilon ? 0 : Math.sign(s)));
	// for every vertex, project the point onto the line, scaled between 0 and 1
	// in relation to the line's vector. Then, convert this number into -1, 0, 1
	// where 0 means the projection lies between the endpoints, inclusive, and
	// -1 or +1 mean it's on either side of one of the endpoints.
	// this is irrelevant for infinite lines, all faces will be 0 (between endpoints).
	const verticesDotSide = vertices_coords
		.map(coord => subtract2(coord, origin))
		.map(vec => dot2(vec, vector))
		.map(dot => dot / magSq)
		.map(s => signFunc(s, epsilon));
	// for each face, if all of its vertices are on the same side,
	// then the face is considered "not overlapping" and will be "false".
	const crossSideOverlap = faces_vertices
		.map(fv => fv
			.map(v => verticesCrossSide[v])
			// are all vertices on the same side?
			.map((side, _, arr) => side === arr[0])
			.reduce((a, b) => a && b, true))
		// invert: are some vertices on different sides?
		.map(b => !b);
	// for each face, if all of its vertices are on the same side,
	// then the face is considered "not overlapping" and will be "false".
	const dotSideOverlap = faces_vertices
		.map(fv => fv
			.map(v => verticesDotSide[v])
			// are all vertices on the same side?
			.map((side, _, arr) => side === arr[0])
			.reduce((a, b) => a && b, true))
		// invert: are some vertices on different sides?
		.map(b => !b)
		// invert: are some vertices on different sides, OR, are all of them 0?
		.map((b, i) => b || verticesDotSide[faces_vertices[i][0]] === 0);
	// faces that might overlap are those that have an overlap in both axes.
	return faces_vertices
		.map((_, i) => i)
		.filter(i => crossSideOverlap[i] && dotSideOverlap[i]);
};
/**
 * @description Given a line, does each face inclusively overlap the line?
 * Note, this works by overlapping bounding boxes (line-aligned, not axis),
 * so it will turn up some false positives, however the faces which are
 * determined to not overlap definitely do not overlap.
 * This includes faces that only touch the line with a collinear vertex.
 * This assumes that the faces of the graph are convex.
 * @param {FOLD} graph a FOLD object
 * @param {VecLine} line a line with a "vector" and "origin"
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[]} indices of the overlapping faces
 * @linkcode
 */
export const getFacesLineOverlap = (graph, { vector, origin }, epsilon = EPSILON) => (
	facesLineTypeOverlap(graph, { vector, origin }, signLine, epsilon)
);
/**
 * @description Given a ray, does each face inclusively overlap the ray?
 * Note, this works by overlapping bounding boxes (line-aligned, not axis),
 * so it will turn up some false positives, however the faces which are
 * determined to not overlap definitely do not overlap.
 * This includes faces that only touch the line with a collinear vertex.
 * This assumes that the faces of the graph are convex.
 * @param {FOLD} graph a FOLD object
 * @param {VecLine} line a line with a "vector" and "origin"
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[]} indices of the overlapping faces
 * @linkcode
 */
export const getFacesRayOverlap = (graph, { vector, origin }, epsilon = EPSILON) => (
	facesLineTypeOverlap(graph, { vector, origin }, signRay, epsilon)
);
/**
 * @description Given a segment, does each face inclusively overlap the segment?
 * Note, this works by overlapping bounding boxes (line-aligned, not axis),
 * so it will turn up some false positives, however the faces which are
 * determined to not overlap definitely do not overlap.
 * This includes faces that only touch the line with a collinear vertex.
 * This assumes that the faces of the graph are convex.
 * @param {FOLD} graph a FOLD object
 * @param {VecLine} line a line with a "vector" and "origin"
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[]} indices of the overlapping faces
 * @linkcode
 */
export const getFacesSegmentOverlap = (graph, segment, epsilon = EPSILON) => {
	const vector = subtract2(segment[1], segment[0]);
	const origin = segment[0];
	return facesLineTypeOverlap(graph, { vector, origin }, signSegment, epsilon);
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
			{ vector: subtract2(seg[1], seg[0]), origin: seg[0] },
			includeL,
			excludeS,
			epsilon,
		).point).map((coords, face_edge_index) => ({
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
