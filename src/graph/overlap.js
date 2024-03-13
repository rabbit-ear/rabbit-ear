/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	boundingBox,
} from "../math/polygon.js";
import {
	overlapBoundingBoxes,
	overlapConvexPolygons,
} from "../math/overlap.js";
import {
	makeFacesPolygon,
} from "./make.js";
import {
	sweepFaces,
} from "./sweep.js";

/**
 * @description For every face, get a list of all other faces
 * that geometrically overlap this face.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} for every face, a list of overlapping face indices
 * @linkcode
 */
export const getFacesFacesOverlap = ({
	vertices_coords, faces_vertices,
}, epsilon = EPSILON) => {
	// these polygons have no collinear vertices
	const facesPolygon = makeFacesPolygon({ vertices_coords, faces_vertices });
	const facesBounds = facesPolygon.map(polygon => boundingBox(polygon));

	// the result will go here, in a index-based sparse array.
	const overlapMatrix = faces_vertices.map(() => []);

	// store here string-separated face pair keys "a b" where a < b
	// to avoid doing duplicate work
	const history = {};

	// as we progress through the line sweep, maintain a list (hash table)
	// of the set of faces which are currently overlapping this sweep line.
	// at the beginning of an event, add new faces, at the end, remove faces.
	const setOfFaces = [];
	sweepFaces({ vertices_coords, faces_vertices }, 0, epsilon)
		.forEach(({ start, end }) => {
			// these are new faces to the sweep line, add them to the set
			start.forEach(e => { setOfFaces[e] = true; });

			// iterate through the set of all current faces crossed by the line,
			// but compare them only to the list of new faces which just joined.
			setOfFaces.forEach((_, f1) => start
				.filter(f2 => f2 !== f1)
				.forEach(f2 => {
					// prevent ourselves from doing duplicate work
					const key = f1 < f2 ? `${f1} ${f2}` : `${f2} ${f1}`;
					if (history[key]) { return; }
					history[key] = true;

					// computing the bounding box overlap first will remove all cases
					// where the pair of faces are far away in the cross-axis.
					if (!overlapBoundingBoxes(facesBounds[f1], facesBounds[f2], epsilon)
						|| !overlapConvexPolygons(facesPolygon[f1], facesPolygon[f2], epsilon)) {
						return;
					}

					// faces overlap. mark both entries in the matrix
					overlapMatrix[f1][f2] = true;
					overlapMatrix[f2][f1] = true;
				}));

			// these are faces which are leaving the sweep line, remove them from the set
			end.forEach(e => delete setOfFaces[e]);
		});
	return overlapMatrix.map(faces => Object.keys(faces).map(n => parseInt(n, 10)));
};
