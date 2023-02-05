/**
 * Rabbit Ear (c) Kraft
 */
import { nonUniqueElements } from "../../general/arrays.js";
/**
 * @description test a stack of tacos (all left or right) for self-intersection.
 * for a collection of tacos which all point in the same direction,
 * all pairs of faces in a taco-taco stack have a shared edge,
 * give each pair a unique identifier (simplest, a unique integer 0...n),
 * now we refer to each face simply by its pair identifier. so now a face
 * layer stack would appear like: [1, 1, 0, 5, 5, 0] (which is a valid stack).
 * a bad layer stack would be: [1, 5, 1, 5].
 * @param {number[]} stacking order of each face where each face is
 * encoded as its pair number identifier.
 * @returns {boolean} true if the taco stack passes this test. false if fails.
 * @linkcode Origami ./src/layer/singleVertexSolver/validateTacoTacoFacePairs.js 16
 */
const validateTacoTacoFacePairs = (face_pair_stack) => {
	// create a copy of "stack" that removes single faces currently missing
	// their other pair partner. this removes boundary faces (with no adj. face)
	// as well as stacks which are in the process of being constructed but not
	// yet final
	const pair_stack = nonUniqueElements(face_pair_stack);
	const pairs = {};
	let count = 0;
	for (let i = 0; i < pair_stack.length; i += 1) {
		if (pairs[pair_stack[i]] === undefined) {
			count += 1;
			pairs[pair_stack[i]] = count;
		} else if (pairs[pair_stack[i]] !== undefined) {
			// if we have seen this layer pair already, it MUST be appearing
			// in the correct order, that is, as it gets popped off the stack,
			// it must be the next-most-recently added pair to the stack.
			if (pairs[pair_stack[i]] !== count) { return false; }
			count -= 1;
			pairs[pair_stack[i]] = undefined;
		}
	}
	return true;
};

export default validateTacoTacoFacePairs;
