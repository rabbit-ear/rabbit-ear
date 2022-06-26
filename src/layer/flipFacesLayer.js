/**
 * Rabbit Ear (c) Kraft
 */
import { invertMap } from "../graph/maps";
/**
 * @description flip a model over by reversing the order of the faces
 * @param {object} faces_layer a faces_layer array
 * @returns {object} a new faces_layer array
 */
const flipFacesLayer = faces_layer => invertMap(
	invertMap(faces_layer).reverse()
);

export default flipFacesLayer;
