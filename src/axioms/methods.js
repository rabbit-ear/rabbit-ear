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
		default: return [solutions];
	}
};
