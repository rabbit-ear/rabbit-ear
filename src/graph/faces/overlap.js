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
/**
 * @description Compare every face to every face to answer: do the two faces overlap?
 * Return the result in the form of a matrix, an array of arrays of booleans,
 * where both halves of the matrix are filled, matrix[i][j] === matrix[j][i].
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean[][]} face-face matrix answering: do they overlap?
 * @linkcode Origami ./src/graph/overlap.js 177
 */
export const getFacesFaces2DOverlap = ({
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
