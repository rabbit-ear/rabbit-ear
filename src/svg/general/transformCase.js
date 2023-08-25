/* svg (c) Kraft, MIT License */
/**
 * SVG (c) Kraft
 */
/**
 * @param {string} s
 * @returns {string}
 */
const toCamel = (s) => s
	.replace(/([-_][a-z])/ig, $1 => $1
		.toUpperCase()
		.replace("-", "")
		.replace("_", ""));
/**
 * @param {string} s
 * @returns {string}
 */
const toKebab = (s) => s
	.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
	.replace(/([A-Z])([A-Z])(?=[a-z])/g, "$1-$2")
	.toLowerCase();
/**
 * @param {string} s
 * @returns {string}
 */
const capitalized = (s) => s
	.charAt(0).toUpperCase() + s.slice(1);

export { capitalized, toCamel, toKebab };
