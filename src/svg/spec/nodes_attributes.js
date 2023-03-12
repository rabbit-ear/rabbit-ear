/* svg (c) Kraft, MIT License */
import classes_attributes from './classes_attributes.js';
import classes_nodes from './classes_nodes.js';
import { str_viewBox, str_points, str_id, str_svg } from '../environment/strings.js';

const nodes_attributes = {
	svg: [str_viewBox],
	line: ["x1", "y1", "x2", "y2"],
	rect: ["x", "y", "width", "height"],
	circle: ["cx", "cy", "r"],
	ellipse: ["cx", "cy", "rx", "ry"],
	polygon: [str_points],
	polyline: [str_points],
	path: ["d"],
	text: ["x", "y"],
	mask: [str_id],
	symbol: [str_id],
	clipPath: [str_id, "clip-rule"],
	marker: [
		str_id,
		"markerHeight",
		"markerUnits",
		"markerWidth",
		"orient",
		"refX",
		"refY",
	],
	linearGradient: ["x1", "x2", "y1", "y2"],
	radialGradient: ["cx", "cy", "r", "fr", "fx", "fy"],
	stop: ["offset", "stop-color", "stop-opacity"],
	pattern: ["patternContentUnits", "patternTransform", "patternUnits"],
};
const additionalNodeAttributes = [{
	nodes: [str_svg, "defs", "g"].concat(classes_nodes.visible, classes_nodes.text),
	attr: classes_attributes.presentation,
}, {
	nodes: ["filter"],
	attr: classes_attributes.effects,
}, {
	nodes: classes_nodes.childrenOfText.concat("text"),
	attr: classes_attributes.text,
}, {
	nodes: classes_nodes.filter,
	attr: classes_attributes.effects,
}, {
	nodes: classes_nodes.gradients,
	attr: classes_attributes.gradient,
}];
additionalNodeAttributes
	.forEach(el => el.nodes
		.forEach(nodeName => {
			if (!nodes_attributes[nodeName]) { nodes_attributes[nodeName] = []; }
			nodes_attributes[nodeName].push(...el.attr);
		}));

export { nodes_attributes as default };
