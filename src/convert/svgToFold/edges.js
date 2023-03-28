/**
 * Rabbit Ear (c) Kraft
 */
import window from "../../environment/window.js";
import parseColor from "../../svg/colors/parseColor.js";
import { rgbToAssignment } from "../../fold/colors.js";

// const getInlineStyle = (attributes, attributeKey) => {
// 	const inlineStyle = attributes.style
// 		? attributes.style.match(new RegExp(`${attributeKey}[\\s]*:[^;]*;`))
// 		: null;
// 	if (inlineStyle) {
// 		return inlineStyle[0].split(":")[1].replace(";", "");
// 	}
// };

const opacityToFoldAngle = (opacity, assignment) => {
	switch (assignment) {
	case "M": case "m": return -180 * opacity;
	case "V": case "v": return 180 * opacity;
	// "F", "B", "U", "C", opacity value doesn't matter.
	default: return 0;
	}
};
/**
 * @description get the value of the opacity as a parsed number,
 * or undefined if it does not exist.
 */
const getOpacity = (element, attributes) => {
	const computedOpacity = window().getComputedStyle(element).opacity;
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
/**
 *
 */
export const getEdgeAssignment = (element, attributes) => {
	if (attributes["data-assignment"] !== undefined) {
		return attributes["data-assignment"];
	}
	const computedStroke = window().getComputedStyle(element).stroke;
	if (computedStroke !== "" && computedStroke !== "none") {
		return rgbToAssignment(...parseColor(computedStroke));
	}
	if (attributes.stroke !== undefined) { return attributes.stroke; }
	return "U";
};
/**
 *
 */
export const getEdgeFoldAngle = (element, attributes, assignment) => {
	if (attributes["data-foldAngle"] !== undefined) {
		const floatFoldAngle = parseFloat(attributes["data-foldAngle"]);
		if (!Number.isNaN(floatFoldAngle)) { return floatFoldAngle; }
	}
	// from this point on, we are using opacity to tell foldAngle,
	// we also need the assignment to determine if it's + or -
	if (!assignment) { return 0; }
	const opacity = getOpacity(element, attributes) || 0;
	return opacityToFoldAngle(opacity, assignment);
};
