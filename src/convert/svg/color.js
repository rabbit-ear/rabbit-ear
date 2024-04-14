/**
 * Rabbit Ear (c) Kraft
 */
import window from "../../environment/window.js";
import {
	rgbToAssignment,
} from "../../fold/colors.js";
import {
	parseColorToHex,
	parseColorToRgb,
} from "../../svg/colors/parseColor.js";

/**
 *
 */
export const colorToAssignment = (color, customAssignments) => {
	const hex = parseColorToHex(color).toUpperCase();
	return customAssignments && customAssignments[hex]
		? customAssignments[hex]
		: rgbToAssignment(...parseColorToRgb(color));
};

/**
 *
 */
export const opacityToFoldAngle = (opacity, assignment) => {
	switch (assignment) {
	case "M": case "m": return -180 * opacity;
	case "V": case "v": return 180 * opacity;
	// "F", "B", "U", "C", opacity value doesn't matter.
	default: return 0;
	}
};

/**
 * @returns {string|undefined}
 */
export const getEdgeStroke = (element, attributes) => {
	const computedStroke = window().getComputedStyle != null
		? window().getComputedStyle(element).stroke
		: "";
	if (computedStroke !== "" && computedStroke !== "none") {
		return computedStroke;
	}
	if (attributes.stroke !== undefined) {
		return attributes.stroke;
	}
	return undefined;
};

/**
 *
 */
export const getEdgeOpacity = (element, attributes) => {
	const computedOpacity = window().getComputedStyle != null
		? window().getComputedStyle(element).opacity
		: "";
	if (computedOpacity !== "") {
		const floatOpacity = parseFloat(computedOpacity);
		if (!Number.isNaN(floatOpacity)) { return floatOpacity; }
	}
	if (attributes.opacity !== undefined) {
		const floatOpacity = parseFloat(attributes.opacity);
		if (!Number.isNaN(floatOpacity)) { return floatOpacity; }
	}
	return undefined;
};
