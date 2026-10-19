/**
 * Rabbit Ear (c) Kraft
 */
import { boundingBox as BoundingBox } from "../../math/polygon.js";

/**
 * @description Make an axis-aligned bounding box that encloses the vertices of
 * a FOLD object. the optional padding is used to make the bounding box
 * inclusive / exclusive by adding padding on all sides, or inset in the case
 * of negative number. (positive=inclusive boundary, negative=exclusive boundary)
 * @param {FOLD} graph a FOLD object
 * @param {number} [padding] an optional padding around the vertices
 * to be included in the bounding box.
 * @returns {Box?} dimensions stored as "span" "min" and "max".
 * "undefined" if no vertices exist in the graph.
 */
export const boundingBox = ({ vertices_coords }, padding) =>
	BoundingBox(vertices_coords, padding);
