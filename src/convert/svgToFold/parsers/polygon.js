/**
 * Rabbit Ear (c) Kraft
 */

const pointsStringToArray = str => {
	const list = str.split(/[\s,]+/).map(parseFloat);
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

const PolygonToSegments = (poly) => (
	pointsStringToArray(poly.getAttribute("points") || "")
		.map((_, i, arr) => [
			arr[i][0],
			arr[i][1],
			arr[(i + 1) % arr.length][0],
			arr[(i + 1) % arr.length][1],
		])
);

export default PolygonToSegments;
