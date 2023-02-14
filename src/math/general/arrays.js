/* Math (c) Kraft, MIT License */
const isIterable = (obj) => obj != null
	&& typeof obj[Symbol.iterator] === "function";
const semiFlattenArrays = function () {
	switch (arguments.length) {
	case undefined:
	case 0: return Array.from(arguments);
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? semiFlattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...semiFlattenArrays(a)]
			: a));
	}
};
const flattenArrays = function () {
	switch (arguments.length) {
	case undefined:
	case 0: return Array.from(arguments);
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
