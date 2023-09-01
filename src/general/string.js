/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @param {string} s
 * @returns {string}
 */
export const toCamel = (s) => s
	.replace(/([-_][a-z])/ig, $1 => $1
		.toUpperCase()
		.replace("-", "")
		.replace("_", ""));
/**
 * @param {string} s
 * @returns {string}
 */
export const toKebab = (s) => s
	.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
	.replace(/([A-Z])([A-Z])(?=[a-z])/g, "$1-$2")
	.toLowerCase();
/**
 * @param {string} s
 * @returns {string}
 */
export const capitalized = (s) => s
	.charAt(0).toUpperCase() + s.slice(1);
