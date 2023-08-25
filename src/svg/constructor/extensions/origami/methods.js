/* svg (c) Kraft, MIT License */
import TransformMethods from '../shared/transforms.js';
import methods$1 from '../shared/urls.js';
import * as dom from '../shared/dom.js';

/**
 * SVG (c) Kraft
 */

// const clearSVG = (element) => {
// 	Array.from(element.attributes)
// 		.filter(attr => attr.name !== "xmlns" && attr.name !== "version")
// 		.forEach(attr => element.removeAttribute(attr.name));
// 	return DOM.removeChildren(element);
// };

// const vertices = (...args) => {
// 	lib.ear.convert.foldToSvg.vertices(...args);
// 	const g = window().document.createElementNS(NS, "g");
// 	lib.ear.convert.foldToSvg.drawInto(g, ...args);
// 	return g;
// };

// const edges = (...args) => {
// 	console.log("edges");
// };

// const faces = (...args) => {
// 	console.log("faces");
// };

// these will end up as methods on the <svg> nodes
const methods = {
	// vertices,
	// edges,
	// faces,
	...TransformMethods,
	...methods$1,
	...dom,
};

export { methods as default };
