/* Math (c) Kraft, MIT License */
/**
 * Math (c) Kraft
 */
const isIterable = (obj) => obj != null
	&& typeof obj[Symbol.iterator] === "function";
/**
 * @description flatten only until the point of comma separated entities. recursive
 * @param {Array} args any array, intended to contain arrays of arrays.
 * @returns always an array
 * @linkcode
 */
const semiFlattenArrays = function () {
	switch (arguments.length) {
	case undefined:
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
 * @description totally flatten, recursive
 * @param {Array} args any array, intended to contain arrays of arrays.
 * @returns an array, always.
 * @linkcode
 */
const flattenArrays = function () {
	switch (arguments.length) {
	case undefined:
	case 0: return Array.from(arguments);
	// only if its an array (is iterable) and NOT a string
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? flattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...flattenArrays(a)]
			: a)).reduce((a, b) => a.concat(b), []);
	}
};

export { flattenArrays, semiFlattenArrays };
