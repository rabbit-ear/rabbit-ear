/**
 * Rabbit Ear (c) Kraft
 */
import { bounding_rect } from "../core/boundary";
// import { line, arrow } from "../../include/svg";
import root from "../root";
// import SVG from "../../include/svg";
const SVG = root.svg;
const { line, arrow } = SVG;

const DIAGRAMS = "re:diagrams";
const DIAGRAM_LINES = "re:diagram_lines";
const DIAGRAM_LINE_CLASSES = "re:diagram_line_classes";
const DIAGRAM_LINE_COORDS = "re:diagram_line_coords";
const DIAGRAM_ARROWS = "re:diagram_arrows";
const DIAGRAM_ARROW_CLASSES = "re:diagram_arrow_classes";
const DIAGRAM_ARROW_COORDS = "re:diagram_arrow_coords";

export const lines = function (graph, options) {
	if (graph[DIAGRAMS] === undefined) { return; }
	if (graph[DIAGRAMS].length === 0) { return; }
	return Array.from(graph[DIAGRAMS])
		.filter(instruction => DIAGRAM_LINES in instruction)
		.map(instruction => instruction[DIAGRAM_LINES]
			.map((crease) => {
				const pts = crease[DIAGRAM_LINE_COORDS];
				if (pts != null) {
					const classes = (DIAGRAM_LINE_CLASSES in crease)
						? crease[DIAGRAM_LINE_CLASSES].join(" ")
						: "valley"; // unspecified should throw error really
					const l = line(pts[0][0], pts[0][1], pts[1][0], pts[1][1]);
					l.setAttribute("class", classes);
					return l;
				}
			})).filter(a => a !== undefined);
}

export const arrows = function (graph, options) {
	if (graph[DIAGRAMS] === undefined) { return; }
	if (graph[DIAGRAMS].length === 0) { return; }
	const r = bounding_rect(graph);
	const vmin = r[2] > r[3] ? r[3] : r[2];
	return Array.from(graph[DIAGRAMS])
		.filter(instruction => DIAGRAM_ARROWS in instruction)
		.map(instruction => instruction[DIAGRAM_ARROWS]
			.filter(arrowObject => arrowObject[DIAGRAM_ARROW_COORDS].length === 2)
			.map((arrowObject) => {
				// start is [0], end is [1]
				const p = arrowObject[DIAGRAM_ARROW_COORDS];
				let side = p[0][0] < p[1][0];
				if (Math.abs(p[0][0] - p[1][0]) < 0.1) { // xs are ~ the same
					side = p[0][1] < p[1][1] ? p[0][0] < 0.5 : p[0][0] > 0.5;
				}
				if (Math.abs(p[0][1] - p[1][1]) < 0.1) { // if ys are the same
					side = p[0][0] < p[1][0] ? p[0][1] > 0.5 : p[0][1] < 0.5;
				}
				// if (preferences.arrowColor) { prefs.color = preferences.arrowColor;}

				const arrowStroke = (typeof options === "object"
					&& typeof options.attributes === "object"
					&& typeof options.attributes.diagrams === "object"
					&& typeof options.attributes.diagrams.arrows === "object"
					&& typeof options.attributes.diagrams.arrows.stroke === "string")
					? options.attributes.diagrams.arrows.stroke : "black";

				const arrowFill = (typeof options === "object"
					&& typeof options.attributes === "object"
					&& typeof options.attributes.diagrams === "object"
					&& typeof options.attributes.diagrams.arrows === "object"
					&& typeof options.attributes.diagrams.arrows.fill === "string")
					? options.attributes.diagrams.arrows.fill : "black";

				const arrowPadding = (typeof options === "object"
					&& typeof options.attributes === "object"
					&& typeof options.attributes.diagrams === "object"
					&& typeof options.attributes.diagrams.arrows === "object"
					&& typeof options.attributes.diagrams.arrows.padding === "number")
					? options.attributes.diagrams.arrows.padding : 0;

				const a = arrow(p[0], p[1])
					.stroke(arrowStroke)
					.fill(arrowFill)
					// .padding(arrowPadding)
					.strokeWidth(vmin * 0.02)
					.head({ width: vmin * 0.035, height: vmin * 0.09, padding: arrowPadding })
					.curve(side ? 0.3 : -0.3);
				const arrowClasses = (DIAGRAM_ARROW_CLASSES in arrowObject)
					? ["arrow"].concat(arrowObject[DIAGRAM_ARROW_CLASSES]).join(" ")
					: "arrow"; // unspecified should throw error really
				a.setAttribute("class", arrowClasses);
				return a;
			})).filter(a => a !== undefined);
}

export default function (graph, options) {
	return lines(graph, options).concat(arrows.graph.options);
};
