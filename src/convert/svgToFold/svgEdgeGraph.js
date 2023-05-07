/**
 * Rabbit Ear (c) Kraft
 */
import { cleanNumber } from "../../math/general/number.js";
import svgSegments from "./svgSegments.js";
import {
	parseColorToHex,
} from "../../svg/colors/parseColor.js";
import {
	colorToAssignment,
	opacityToFoldAngle,
} from "./edges.js";
/**
 *
 */
const getUserAssignmentOptions = (options) => {
	if (!options || !options.assignments) { return undefined; }
	const assignments = {};
	Object.keys(options.assignments).forEach(key => {
		const hex = parseColorToHex(key).toUpperCase();
		assignments[hex] = options.assignments[key];
	});
	return assignments;
};
/**
 *
 */
const getEdgeAssignment = (dataAssignment, stroke = "#f0f", customAssignments = undefined) => {
	if (dataAssignment) { return dataAssignment; }
	return colorToAssignment(stroke, customAssignments);
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
const makeAssignmentFoldAngle = (segments, options) => {
	// if the user provides a dictionary of custom stroke-assignment
	// matches, this takes precidence over the "data-" attribute
	// todo: this can be improved
	const customAssignments = getUserAssignmentOptions(options);
	// if user specified customAssignments, ignore the data- attributes
	// otherwise the user's assignments would be ignored.
	if (customAssignments) {
		segments.forEach(seg => {
			delete seg.data.assignment;
			delete seg.data.foldAngle;
		});
	}
	// convert SVG data into FOLD arrays
	const edges_assignment = segments.map(segment => getEdgeAssignment(
		segment.data.assignment,
		segment.stroke,
		customAssignments,
	));
	const edges_foldAngle = segments.map((segment, i) => getEdgeFoldAngle(
		segment.data.foldAngle,
		segment.opacity,
		edges_assignment[i],
	));
	return {
		edges_assignment,
		edges_foldAngle,
	};
};
/**
 * @description This method will handle all of the SVG parsing
 * and result in a very simple graph representation basically
 * only containing line segments and their assignment/foldAngle.
 * The graph will not be planar (edges will overlap), no faces
 * will exist, and duplicate vertices will exist and need to
 * be merged
 * @param {Element | string} svg an SVG image as a DOM element
 * or a string.
 * @returns {FOLD} a FOLD representation of the SVG image, not
 * yet a planar graph, no faces, and possible edge overlaps.
 */
const svgEdgeGraph = (svg, options) => {
	const segments = svgSegments(svg, options);
	const {
		edges_assignment,
		edges_foldAngle,
	} = makeAssignmentFoldAngle(segments, options);
	// by default the parser will change numbers like 15.000000000001 into 15.
	// to turn this off, options.fast = true
	const fixNumber = options && options.fast ? n => n : cleanNumber;
	const vertices_coords = segments
		.flatMap(el => el.segment)
		.map(coord => coord.map(n => fixNumber(n, 12)));
	const edges_vertices = segments.map((_, i) => [i * 2, i * 2 + 1]);
	return {
		vertices_coords,
		edges_vertices,
		edges_assignment,
		edges_foldAngle,
	};
};

export default svgEdgeGraph;
