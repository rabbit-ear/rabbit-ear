/**
 * Rabbit Ear (c) Kraft
 */
import { invert_map } from "../graph/maps";
/**
 * @description flip a model over by reversing the order of the faces
 * @param {object} faces_layer a faces_layer array
 * @returns {object} a new faces_layer array
 */
const flip_faces_layer = faces_layer => invert_map(
	invert_map(faces_layer).reverse()
);

export default flip_faces_layer;
