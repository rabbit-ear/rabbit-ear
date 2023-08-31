/**
 * Math (c) Kraft
 */
const isIterable = (obj) => obj != null
	&& typeof obj[Symbol.iterator] === "function";
/**
 * @description flatten only until the point of comma separated entities.
 * This will preserve vectors (number[]) in an array of array of vectors.
 * @param {any[][]} args any array, intended to contain arrays of arrays.
 * @returns {array[]} a flattened copy, flattened up until the point before
 * combining arrays of elements.
 * @linkcode Math ./src/general/arrays.js 10
 */
export const semiFlattenArrays = function () {
	switch (arguments.length) {
	case 0: return Array.from(arguments);
	// only if its an array (is iterable) and NOT a string
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? semiFlattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...semiFlattenArrays(a)]
			: a));
	}
};
/**
 * @description Totally flatten, recursive
 * @param {array[][]} args any array, intended to contain arrays of arrays.
 * @returns {array[]} fully, recursively flattened array
 * @linkcode Math ./src/general/arrays.js 30
 */
export const flattenArrays = function () {
	switch (arguments.length) {
	case 0: return Array.from(arguments);
	// only if its an array (is iterable) and NOT a string
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? flattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...flattenArrays(a)]
			: a)).flat();
	}
};
