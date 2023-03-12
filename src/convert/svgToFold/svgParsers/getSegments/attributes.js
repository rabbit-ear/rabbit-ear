/**
 * Rabbit Ear (c) Kraft
 */
export const pointsStringToArray = str => {
	const list = str
		.split(/[\s,]+/)
		.map(n => parseFloat(n));
	return Array
		.from(Array(Math.floor(list.length / 2)))
		.map((_, i) => [list[i * 2 + 0], list[i * 2 + 1]]);
};

// export const pointStringToArray = function (str) {
// 	return str.split(/[\s,]+/)
// 		.filter(s => s !== "")
// 		.map(p => p.split(",")
// 			.map(n => parseFloat(n)));
// };

// SVG will occasionally remove x1="0", attribute absense is an implied 0.
export const getAttributesFloatValue = (element, attributes) => attributes
	.map(attr => element.getAttribute(attr))
	.map(str => (str == null ? "0" : str))
	.map(parseFloat);
