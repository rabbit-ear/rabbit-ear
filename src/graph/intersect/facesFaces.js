/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/general/constant.js";
import { boundingBox } from "../../math/geometry/polygon.js";
import {
	overlapBoundingBoxes,
	overlapConvexPolygons,
} from "../../math/intersect/overlap.js";
import { makeFacesPolygon } from "../make.js";
import { sweepFaces } from "../sweep.js";
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
	// faces have no collinear vertices
	const facesPolygon = makeFacesPolygon({ vertices_coords, faces_vertices });
	const facesBounds = facesPolygon.map(polygon => boundingBox(polygon));
	const intersections = [];
	// as we progress through the line sweep, maintain a list (hash table)
	// of the set of faces which are currently overlapping this sweep line.
	const setOfFaces = [];
	sweepFaces({ vertices_coords, faces_vertices }, 0, epsilon)
		.forEach(event => {
			event.start.forEach(e => { setOfFaces[e] = true; });
			setOfFaces
				.forEach((_, f1) => event.start
					.forEach(f2 => {
						if (f1 === f2) { return; }
						// first, faster bounding box overlap. then actual overlap function
						if (!overlapBoundingBoxes(facesBounds[f1], facesBounds[f2])
							|| !overlapConvexPolygons(facesPolygon[f1], facesPolygon[f2], epsilon)) {
							return;
						}
						if (!intersections[f1]) { intersections[f1] = []; }
						if (!intersections[f2]) { intersections[f2] = []; }
						intersections[f1][f2] = true;
						intersections[f2][f1] = true;
					}));
			event.end.forEach(e => delete setOfFaces[e]);
		});
	return intersections.map(faces => Object.keys(faces).map(n => parseInt(n, 10)));
};
