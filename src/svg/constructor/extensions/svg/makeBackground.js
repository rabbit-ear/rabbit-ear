/* svg (c) Kraft, MIT License */
import SVGWindow from '../../../environment/window.js';
import { str_class, str_stroke, str_none, str_fill } from '../../../environment/strings.js';
import NS from '../../../spec/namespace.js';
import nodes_attributes from '../../../spec/nodes_attributes.js';
import getSVGFrame from './getSVGFrame.js';

const bgClass = "svg-background-rectangle";
const makeBackground = function (element, color) {
	let backRect = Array.from(element.childNodes)
		.filter(child => child.getAttribute(str_class) === bgClass)
		.shift();
	if (backRect == null) {
		backRect = SVGWindow().document.createElementNS(NS, "rect");
		getSVGFrame(element).forEach((n, i) => backRect.setAttribute(nodes_attributes.rect[i], n));
		backRect.setAttribute(str_class, bgClass);
		backRect.setAttribute(str_stroke, str_none);
		element.insertBefore(backRect, element.firstChild);
	}
	backRect.setAttribute(str_fill, color);
	return element;
};

export { makeBackground as default };
