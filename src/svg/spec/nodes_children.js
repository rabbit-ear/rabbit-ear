/* svg (c) Kraft, MIT License */
import classes_nodes from './classes_nodes.js';

const headerStuff = [
	classes_nodes.header,
	classes_nodes.invisible,
	classes_nodes.patterns,
].flat();
const drawingShapes = [
	classes_nodes.group,
	classes_nodes.visible,
	classes_nodes.text,
].flat();
const nodes_children = {
	svg: [["svg", "defs"], headerStuff, drawingShapes].flat(),
	defs: headerStuff,
	filter: classes_nodes.filter,
	g: drawingShapes,
	text: classes_nodes.childrenOfText,
	marker: drawingShapes,
	symbol: drawingShapes,
	clipPath: drawingShapes,
	mask: drawingShapes,
	linearGradient: classes_nodes.gradients,
	radialGradient: classes_nodes.gradients,
};

export { nodes_children as default };
