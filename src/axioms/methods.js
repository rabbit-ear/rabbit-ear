/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description The core axiom methods return arrays for *some* of the axioms.
 * Standardize the output so that all of them are inside arrays.
 * @param {number} the axiom number
 * @param {Line|Line[]} the solutions from having run the axiom method
 * @returns {Line[]} the solution lines, now consistently inside an array.
 */
export const arrayify = (axiomNumber, solutions) => {
	switch (axiomNumber) {
	case 3: case "3":
	case 5: case "5":
	case 6: case "6": return solutions;
	// 7 is the only axiom which can return a single undefined (not in an array)
	case 7: case "7": return solutions === undefined ? [] : [solutions];
	default: return [solutions];
	}
};
/**
 * @description convert an array of solutions into the original state,
 * which means for axiom 3, 5, 6 it remains an array,
 * and for 1, 2, 4, 7 the first (only) element is returned.
 */
export const unarrayify = (axiomNumber, solutions) => {
	switch (axiomNumber) {
	case 3: case "3":
	case 5: case "5":
	case 6: case "6": return solutions;
	default: return solutions ? solutions[0] : undefined;
	}
};
