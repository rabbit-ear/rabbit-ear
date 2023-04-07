/**
 * Rabbit Ear (c) Kraft
 */
import { magnitude3, distance3, scale3 } from "../math/algebra/vector.js";
/**
 * How desaturated can a color be but still be considered
 * a color instead of a grayscale value? please be: 0 < n < Inf.
 * 1 means nothing is changed. >1 is permissive
 * and between 0 and 1 is not permissive.
 */
const DESATURATION_RATIO = 4;

export const assignmentColor = {
	M: [1, 0, 0], // red
	V: [0, 0, 1], // blue
	J: [1, 1, 0], // yellow
	U: [1, 0, 1], // magenta
	C: [0, 1, 0], // green
	// and "boundary" and "flat" are black and gray
};
/**
 * @description The color scheme that was established in Origami Simulator.
 * @param {number} red the red channel from 0 to 255
 * @param {number} green the green channel from 0 to 255
 * @param {number} blue the blue channel from 0 to 255
 */
export const rgbToAssignment = (red = 0, green = 0, blue = 0) => {
	const color = scale3([red, green, blue], 1 / 255);
	// the distance to black (0, 0, 0)
	const blackDistance = magnitude3(color);
	// if the distance to black is too small, it's difficult
	// to infer any color information. the color implies "boundary".
	if (blackDistance < 0.05) { return "B"; }
	// the nearest grayscale value
	const grayscale = color.reduce((a, b) => a + b, 0) / 3;
	// the distance from the color to the nearest grayscale value
	const grayDistance = distance3(color, [grayscale, grayscale, grayscale]);
	// the nearest color from "assignmentColor" to this color
	const nearestColor = Object.keys(assignmentColor)
		.map(key => ({ key, dist: distance3(color, assignmentColor[key]) }))
		.sort((a, b) => a.dist - b.dist)
		.shift();
	// the color is allowed to be heavily desaturated, closer to the gray
	// version of itself, and still count as the color instead of the gray.
	if (nearestColor.dist < grayDistance * DESATURATION_RATIO) {
		return nearestColor.key;
	}
	// is it black or gray? more permissivly select gray over black.
	// boundary might also be decided later by planar walk.
	return blackDistance < 0.1 ? "B" : "F";
};
