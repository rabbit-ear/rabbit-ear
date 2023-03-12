/* svg (c) Kraft, MIT License */
import SVGWindow from '../../../environment/window.js';
import { str_style } from '../../../environment/strings.js';
import NS from '../../../spec/namespace.js';
import makeCDATASection from '../../../methods/makeCDATASection.js';
import { setViewBox, getViewBox } from '../../../methods/viewBox.js';
import makeBackground from './makeBackground.js';
import getSVGFrame from './getSVGFrame.js';
import TransformMethods from '../shared/transforms.js';
import * as dom from '../shared/dom.js';
import { removeChildren } from '../shared/dom.js';

const setPadding = function (element, padding) {
	const viewBox = getViewBox(element);
	if (viewBox !== undefined) {
		setViewBox(element, ...[-padding, -padding, padding * 2, padding * 2]
			.map((nudge, i) => viewBox[i] + nudge));
	}
	return element;
};
const findOneElement = function (element, nodeName) {
	const styles = element.getElementsByTagName(nodeName);
	return styles.length ? styles[0] : null;
};
const stylesheet = function (element, textContent) {
	let styleSection = findOneElement(element, str_style);
	if (styleSection == null) {
		styleSection = SVGWindow().document.createElementNS(NS, str_style);
		styleSection.setTextContent = (text) => {
			styleSection.textContent = "";
			styleSection.appendChild(makeCDATASection(text));
			return styleSection;
		};
		element.insertBefore(styleSection, element.firstChild);
	}
	styleSection.textContent = "";
	styleSection.appendChild(makeCDATASection(textContent));
	return styleSection;
};
const clearSVG = (element) => {
	Array.from(element.attributes)
		.filter(attr => attr.name !== "xmlns" && attr.name !== "version")
		.forEach(attr => element.removeAttribute(attr.name));
	return removeChildren(element);
};
const methods = {
	clear: clearSVG,
	size: setViewBox,
	setViewBox,
	getViewBox,
	padding: setPadding,
	background: makeBackground,
	getWidth: el => getSVGFrame(el)[2],
	getHeight: el => getSVGFrame(el)[3],
	stylesheet: function (el, text) { return stylesheet.call(this, el, text); },
	...TransformMethods,
	...dom,
};

export { methods as default, findOneElement };
