/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/general/constant.js";
import {
	boundingBox,
	makePolygonNonCollinear,
} from "../../math/geometry/polygon.js";
import {
	overlapBoundingBoxes,
	overlapConvexPolygons,
} from "../../math/intersect/overlap.js";
import {
	normalize2,
	dot2,
	cross2,
	subtract2,
} from "../../math/algebra/vector.js";
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
const facesLineOverlap = (
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
	// faces that overlap are those that have an overlap in both axes.
	return faces_vertices.map((_, i) => crossSideOverlap[i] && dotSideOverlap[i]);
};
/**
 * @description Given a line, does each face inclusively overlap the line?
 * This includes faces that only touch the line with a collinear vertex.
 * This assumes that the faces of the graph are convex.
 * @param {FOLD} graph a FOLD graph
 * @param {VecLine} line a line with a "vector" and "origin"
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean[]} for every face, true if the face overlaps
 * @linkcode
 */
export const getFacesLineOverlap = (graph, { vector, origin }, epsilon = EPSILON) => (
	facesLineOverlap(graph, { vector, origin }, signLine, epsilon)
);
/**
 * @description Given a ray, does each face inclusively overlap the ray?
 * This includes faces that only touch the line with a collinear vertex.
 * This assumes that the faces of the graph are convex.
 * @param {FOLD} graph a FOLD graph
 * @param {VecLine} line a line with a "vector" and "origin"
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean[]} for every face, true if the face overlaps
 * @linkcode
 */
export const getFacesRayOverlap = (graph, { vector, origin }, epsilon = EPSILON) => (
	facesLineOverlap(graph, { vector, origin }, signRay, epsilon)
);
/**
 * @description Given a segment, does each face inclusively overlap the segment?
 * This includes faces that only touch the line with a collinear vertex.
 * This assumes that the faces of the graph are convex.
 * @param {FOLD} graph a FOLD graph
 * @param {VecLine} line a line with a "vector" and "origin"
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean[]} for every face, true if the face overlaps
 * @linkcode
 */
export const getFacesSegmentOverlap = (graph, segment, epsilon = EPSILON) => {
	const vector = subtract2(segment[1], segment[0]);
	const origin = segment[0];
	return facesLineOverlap(graph, { vector, origin }, signSegment, epsilon);
};
/**
 * @description Compare every face to every face to answer: do the two faces overlap?
 * Return the result in the form of a matrix, an array of arrays of booleans,
 * where both halves of the matrix are filled, matrix[i][j] === matrix[j][i].
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean[][]} face-face matrix answering: do they overlap?
 * @linkcode Origami ./src/graph/overlap.js 177
 */
export const getFacesFacesOverlap = ({
	vertices_coords, faces_vertices,
}, epsilon = EPSILON) => {
	const matrix = Array.from(Array(faces_vertices.length))
		.map(() => Array.from(Array(faces_vertices.length)));
	const faces_coords = faces_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	const faces_bounds = faces_coords
		.map(polygon => boundingBox(polygon));

	for (let i = 0; i < faces_bounds.length - 1; i += 1) {
		for (let j = i + 1; j < faces_bounds.length; j += 1) {
			if (!overlapBoundingBoxes(faces_bounds[i], faces_bounds[j])) {
				matrix[i][j] = false;
				matrix[j][i] = false;
			}
		}
	}

	const faces_polygon = faces_coords
		.map(polygon => makePolygonNonCollinear(polygon, epsilon));
	for (let i = 0; i < faces_vertices.length - 1; i += 1) {
		for (let j = i + 1; j < faces_vertices.length; j += 1) {
			if (matrix[i][j] === false) { continue; }
			const overlap = overlapConvexPolygons(
				faces_polygon[i],
				faces_polygon[j],
				epsilon,
			);
			matrix[i][j] = overlap;
			matrix[j][i] = overlap;
		}
	}
	return matrix;
};

// const makeFacesFacesOverlap = ({ vertices_coords, faces_vertices }, epsilon = EPSILON) => {
//   const matrix = Array.from(Array(faces_vertices.length))
//     .map(() => Array.from(Array(faces_vertices.length)));
//   const faces_polygon = makeFacesPolygon({ vertices_coords, faces_vertices }, epsilon);
//   for (let i = 0; i < faces_vertices.length - 1; i++) {
//     for (let j = i + 1; j < faces_vertices.length; j++) {
//       const intersection = intersect_polygon_polygon(
//         faces_polygon[i],
//         faces_polygon[j],
//         // exclude,
//         epsilon);
//       console.log("testing", faces_polygon[i], faces_polygon[j], intersection, epsilon);
//       const overlap = intersection.length !== 0;
//       matrix[i][j] = overlap;
//       matrix[j][i] = overlap;
//     }
//   }
//   return matrix;
// };
