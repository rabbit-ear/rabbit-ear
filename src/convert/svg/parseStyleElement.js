import window from "../../environment/window";
import {
	getRootParent,
} from "./dom";
/**
 * @description Convert a style element, CSSStyleSheet, into a nested
 * object with selectors as keys, then attributes as 2nd layer keys.
 * @param {CSSStyleSheet} sheet the "sheet" property on a style element
 * @returns {object} dictionary representation of a style element
 */
const parseCSSStyleSheet = (sheet) => {
	if (!sheet.cssRules) { return {}; }
	const stylesheets = {};
	// convert the array of type {CSSRule[]} to an object
	// with the key:value being the key and the contents of that rule.
	for (let i = 0; i < sheet.cssRules.length; i += 1) {
		const cssRules = sheet.cssRules[i];
		if (cssRules.type !== 1) { continue; }
		const selectorList = cssRules.selectorText
			.split(/,/gm)
			.filter(Boolean)
			.map(str => str.trim());
		const style = {};
		Object.values(cssRules.style)
			.forEach(key => { style[key] = cssRules.style[key]; });
		selectorList.forEach(selector => {
			stylesheets[selector] = style;
		});
	}
	return stylesheets;
};
/**
 * @description This is a very strange function, and it's all because
 * of a very strange quirk that CSSStyleSheet property does not exist
 * on a node *which is not bound to the window.document*
 * (ie: converted from XML string), but it does exist if it is.
 * So, we detect if this is the case, quickly append it to the body,
 * process the style sheets, then remove it from the DOM.
 * @param {Element} svg the SVG DOM element
 * @param {Element[]} elements the result of calling flattenDomTree.
 * @returns {object[]} style sheets as objects, with CSS selectors as
 * keys, for example: { ".redline": { "stroke-width": "0.5" } }.
 */
const parseStyleElement = (style) => {
	if (style.sheet) { return parseCSSStyleSheet(style.sheet); }
	const rootParent = getRootParent(style);
	const isHTMLBound = rootParent.constructor === window().HTMLDocument;
	if (!isHTMLBound) {
		// remove style from parent. append to document.body
		const prevParent = style.parentNode;
		if (prevParent != null) {
			prevParent.removeChild(style);
		}
		const body = window().document.body != null
			? window().document.body
			: window().document.createElement("body");
		body.appendChild(style);
		// parse style sheet.
		const parsedStyle = parseCSSStyleSheet(style.sheet);
		// remove style from document.body. append to previous parent
		body.removeChild(style);
		if (prevParent != null) {
			prevParent.appendChild(style);
		}
		return parsedStyle;
	}
	return {};
};

export default parseStyleElement;
