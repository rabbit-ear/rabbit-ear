/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @param {number[]} stacking order of each face where each face is
 * encoded as its pair number identifier.
 * @returns {boolean} true if the stack passes this test. false if fails.
 */
const validate_taco_tortilla_pairs = (pair_stack) => {
	if (pair_stack[0] === 0 && pair_stack[1] === 1 && pair_stack[2] === 0) {
		return false;
	}
	if (pair_stack[0] === 1 && pair_stack[1] === 0 && pair_stack[2] === 1) {
		return false;
	}
	// const seen = {};
	// let last_seen = undefined;
	// for (let i = 0; i < pair_stack.length; i++) {
	//   if (last_seen === undefined) {
	//     last_seen = pair_stack[i];
	//   } else {
	//     if (last_seen !== pair_stack[i]) { return false; }
	//     last_seen = undefined;
	//   }
	// }
	return true;
};

export default validate_taco_tortilla_pairs;
