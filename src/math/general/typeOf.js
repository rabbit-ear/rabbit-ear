/* Math (c) Kraft, MIT License */
/**
 * Math (c) Kraft
 */
/**
 * @description Infer the type of an object.
 * @param {any} any object
 * @returns {string} the type name
 * @linkcode Math ./src/types/typeof.js 17
 */
const typeOf = (obj) => {
	if (typeof obj !== "object") { return typeof obj; }
	if (obj.radius !== undefined) { return "circle"; }
	if (obj.width !== undefined) { return "rect"; }
	if (typeof obj[0] === "number") { return "vector"; }
	if (obj.vector !== undefined && obj.origin !== undefined) { return "line"; }
	if (obj[0] !== undefined && obj[0].length && typeof obj[0][0] === "number") {
		return obj.length === 2 ? "segment" : "polygon";
	}
	return "object";
};

export { typeOf as default };
