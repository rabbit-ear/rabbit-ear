/**
 * Rabbit Ear (c) Kraft
 */
import { getAttributesFloatValue } from "./attributes.js";

const RectToSegments = function (rect) {
	const [x, y, w, h] = getAttributesFloatValue(
		rect,
		["x", "y", "width", "height"],
	);
	return [
		[x, y, x + w, y],
		[x + w, y, x + w, y + h],
		[x + w, y + h, x, y + h],
		[x, y + h, x, y],
	];
};

export default RectToSegments;
