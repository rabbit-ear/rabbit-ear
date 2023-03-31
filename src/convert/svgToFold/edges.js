/**
 * Rabbit Ear (c) Kraft
 */
import window from "../../environment/window.js";
import parseColor from "../../svg/colors/parseColor.js";
import { rgbToAssignment } from "../../fold/colors.js";
/**
 *
 */
export const colorToAssignment = (color, options) => (
	options && options.assignments && options.assignments[color]
		? options.assignments[color]
		: rgbToAssignment(...parseColor(color))
);
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
 *
 */
const getEdgesAttribute = (segments, key) => segments
	.map(el => el.attributes)
	.map(attributes => attributes[key]);
/**
 *
 */
const getEdgeStroke = (element, attributes) => {
	const computedStroke = window().getComputedStyle(element).stroke;
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
const getEdgeOpacity = (element, attributes) => {
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
export const getEdgesStroke = (segments) => segments
	.map(el => getEdgeStroke(el.element, el.attributes));
/**
 *
 */
export const getEdgesOpacity = (segments) => segments
	.map(el => getEdgeOpacity(el.element, el.attributes));
/**
 *
 */
const getEdgeAssignment = (dataAssignment, stroke = "#f0f", options = undefined) => {
	if (dataAssignment) { return dataAssignment; }
	return colorToAssignment(stroke, options);
};
/**
 *
 */
const getEdgeFoldAngle = (dataFoldAngle, opacity = 1, assignment = undefined) => {
	if (dataFoldAngle) { return parseFloat(dataFoldAngle); }
	return opacityToFoldAngle(opacity, assignment);
};
/**
 *
 */
export const getEdgesAttributes = (segments, options) => {
	const edgesDataAssignment = getEdgesAttribute(segments, "data-assignment");
	const edgesDataFoldAngle = getEdgesAttribute(segments, "data-foldAngle");
	const edgesStroke = getEdgesStroke(segments);
	const edgesOpacity = getEdgesOpacity(segments);
	const edges_assignment = segments.map((_, i) => getEdgeAssignment(
		edgesDataAssignment[i],
		edgesStroke[i],
		options,
	));
	const edges_foldAngle = segments.map((_, i) => getEdgeFoldAngle(
		edgesDataFoldAngle[i],
		edgesOpacity[i],
		edges_assignment[i],
		options,
	));
	return { edges_assignment, edges_foldAngle };
};
