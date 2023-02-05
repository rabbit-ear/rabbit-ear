/**
 * Rabbit Ear (c) Kraft
 */
import math from "../../math.js";
import validateTacoTortillaStrip from "./validateTacoTortillaStrip.js";
import validateTacoTacoFacePairs from "./validateTacoTacoFacePairs.js";
/**
 * @description given a layers_face (ensure that it is flat/only numbers)
 * convert a stack of taco_faces in the form of [[f1,f2], [f3,f4]]
 * into a flat array of the layers_face where each face is now an index
 * to the location of the pair the face is inside of in taco_faces.
 * @linkcode Origami ./src/layer/singleVertexSolver/validateLayerSolver.js 12
 */
const build_layers = (layers_face, faces_pair) => layers_face
	.map(f => faces_pair[f])
	.filter(a => a !== undefined);

const validateLayerSolver = (
	faces_folded,
	layers_face,
	taco_face_pairs,
	circ_and_done,
	epsilon,
) => {
	// if the strip contains "F" assignments, layers_face will contain
	// a mix of numbers and arrays of numbers, like: [1, 0, 5, [3, 4], 2]
	// as [3,4] are on the same "layer".
	// flatten this array so all numbers get pushed onto the top level, like:
	// [1, 0, 5, [3, 4], 2] into [1, 0, 5, 3, 4, 2].
	// now, this does create a layer preference between (3 and 4 in this example),
	// but in this specific use case we can be guaranteed that only one of those
	// will be used in the build_layers, as only one of a set of flat-
	// strip faces can exist in one taco stack location.
	const flat_layers_face = math.core.flattenArrays(layers_face);
	// taco-tortilla intersections
	if (!validateTacoTortillaStrip(
		faces_folded,
		layers_face,
		circ_and_done,
		epsilon,
	)) { return false; }
	// taco-taco intersections
	for (let i = 0; i < taco_face_pairs.length; i += 1) {
		const pair_stack = build_layers(flat_layers_face, taco_face_pairs[i]);
		if (!validateTacoTacoFacePairs(pair_stack)) { return false; }
	}
	return true;
};

export default validateLayerSolver;
