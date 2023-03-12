/**
 * Rabbit Ear (c) Kraft
 */
import { pointsStringToArray } from "./attributes.js";

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
