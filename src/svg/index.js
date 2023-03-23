/* svg (c) Kraft, MIT License */
import { str_svg, str_function } from './environment/strings.js';
import SVGWindow, { setSVGWindow } from './environment/window.js';
import NS from './spec/namespace.js';
import nodes_attributes from './spec/nodes_attributes.js';
import nodes_children from './spec/nodes_children.js';
import nodeNames from './spec/nodes.js';
import methods from './methods/index.js';
import extensions from './constructor/extensions/index.js';
import Constructor from './constructor/index.js';

const SVG = (...args) => {
	const svg = Constructor(str_svg, null, ...args);
	const initialize = () => args
		.filter(arg => typeof arg === str_function)
		.forEach(func => func.call(svg, svg));
	if (SVGWindow().document.readyState === "loading") {
		SVGWindow().document.addEventListener("DOMContentLoaded", initialize);
	} else {
		initialize();
	}
	return svg;
};
Object.assign(SVG, {
	NS,
	nodes_attributes,
	nodes_children,
	extensions,
	...methods,
});
nodeNames.forEach(nodeName => {
	SVG[nodeName] = (...args) => Constructor(nodeName, null, ...args);
});
Object.defineProperty(SVG, "window", {
	enumerable: false,
	set: setSVGWindow,
});

export { SVG as default };
