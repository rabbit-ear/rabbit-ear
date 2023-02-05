/**
 * Rabbit Ear (c) Kraft
 */
import math from "../../../math.js";
import parseCSSColor from "./parseCSSColor.js";

const assignmentColors = {
	M: [1, 0, 0], // red
	V: [0, 0, 1], // blue
	F: [1, 1, 0], // yellow
	U: [1, 0, 1], // magenta
	C: [0, 1, 0], // green
};

const colorToAssignment = (string) => {
	if (string == null || typeof string !== "string") {
		return "U";
	}
	const color = parseCSSColor(string);
	// remove alpha value if it exists
	const color3 = color.slice(0, 3);
	const grayscale = color3.reduce((a, b) => a + b, 0) / 3;
	const gray = [grayscale, grayscale, grayscale];
	const grayDistance = {
		key: "F",
		distance: math.core.distance3(color3, gray),
	};
	const colorDistance = Object.keys(assignmentColors)
		.map(key => ({
			key,
			distance: math.core.distance3(color3, assignmentColors[key]),
		}))
		.sort((a, b) => a.distance - b.distance)
		.shift();
	return grayDistance.distance < colorDistance.distance
		? grayDistance.key
		: colorDistance.key;
	// cannot discern between flat and boundary
	// boundary will be decided later by planar analysis
};

export default colorToAssignment;
