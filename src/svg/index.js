/* svg (c) Kraft, MIT License */
import { str_svg, str_function } from './environment/strings.js';
import SVGWindow, { setSVGWindow } from './environment/window.js';
import NS from './spec/namespace.js';
import nodes_attributes from './spec/nodes_attributes.js';
import nodes_children from './spec/nodes_children.js';
import nodeNames from './spec/nodes.js';
import colors from './colors/index.js';
import general from './general/index.js';
import extensions from './constructor/extensions/index.js';
import Constructor from './constructor/index.js';

/**
 * SVG (c) Kraft
 */

// the top level container object is also an <svg> constructor
// const SVG = (...args) => Constructor("svg", null, ...args);
const SVG = (...args) => {
	const svg = Constructor(str_svg, null, ...args);
	const initialize = () => args
		.filter(arg => typeof arg === str_function)
		.forEach(func => func.call(svg, svg));
	// call initialize as soon as possible. check if page has loaded
	if (SVGWindow().document.readyState === "loading") {
		SVGWindow().document.addEventListener("DOMContentLoaded", initialize);
	} else {
		initialize();
	}
	return svg;
};

// constants and methods at the top level of the library
Object.assign(SVG, {
	NS,
	nodes_attributes,
	nodes_children,
	extensions,
	...colors,
	...general,
});

nodeNames.forEach(nodeName => {
	SVG[nodeName] = (...args) => Constructor(nodeName, null, ...args);
});

// the window object, from which the document is used to createElement.
// if using a browser, no need to interact with this,
// if using node.js, set this to the library @xmldom/xmldom.
Object.defineProperty(SVG, "window", {
	enumerable: false,
	set: setSVGWindow,
});

export { SVG as default };
