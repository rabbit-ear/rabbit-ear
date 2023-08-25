/* svg (c) Kraft, MIT License */
import SVGWindow from '../environment/window.js';
import { transformStringToMatrix } from './transforms.js';
import { svg_multiplyMatrices2 } from './algebra.js';

/**
 * SVG (c) Kraft
 */
/**
 * @param {string} input an SVG as a string
 * @param {string} mimeType default to XML, for SVG use "image/svg+xml".
 */
const xmlStringToElement = (input, mimeType = "text/xml") => {
	const result = (new (SVGWindow().DOMParser)()).parseFromString(input, mimeType);
	return result ? result.documentElement : null;
};
/**
 * @description Get the furthest root parent up the DOM tree
 */
const getRootParent = (el) => {
	let parent = el;
	while (parent.parentNode != null) {
		parent = parent.parentNode;
	}
	return parent;
};
/**
 * @description search up the parent-chain until we find the first
 * <Element> with the nodeName matching the parameter,
 * return undefined if none exists.
 * Note: there is no protection against a dependency cycle.
 * @param {Element} element a DOM element
 * @param {string} nodeName the name of the element, like "svg" or "div"
 * @returns {Element|undefined} the element if it exists
 */
const findElementTypeInParents = (element, nodeName) => {
	if ((element.nodeName || "") === nodeName) {
		return element;
	}
	return element.parentNode
		? findElementTypeInParents(element.parentNode, nodeName)
		: undefined;
};

const polyfillClassListAdd = (el, ...classes) => {
	const hash = {};
	const getClass = el.getAttribute("class");
	const classArray = getClass ? getClass.split(" ") : [];
	classArray.push(...classes);
	classArray.forEach(str => { hash[str] = true; });
	const classString = Object.keys(hash).join(" ");
	el.setAttribute("class", classString);
};
/**
 * @description Add classes to an Element, essentially classList.add(), but
 * it will call a polyfill if classList doesn't exist (as in @xmldom/xmldom)
 * @param {Element} element a DOM element
 * @param {...string} classes a list of class strings to be added to the element
 */
const addClass = (el, ...classes) => {
	if (!el || !classes.length) { return undefined; }
	return el.classList
		? el.classList.add(...classes)
		: polyfillClassListAdd(el, ...classes);
};
/**
 * @description Recurse through a DOM element and flatten all elements
 * into one array. This ignores all style attributes, including
 * "transform" which by its absense really makes this function useful
 * for treating all elements on an individual bases, and not a reliable
 * reflection of where the element will end up, globally speaking.
 */
const flattenDomTree = (el) => (
	el.childNodes == null || !el.childNodes.length
		? [el]
		: Array.from(el.childNodes).flatMap(child => flattenDomTree(child))
);

const nodeSpecificAttrs = {
	svg: ["viewBox", "xmlns", "version"],
	line: ["x1", "y1", "x2", "y2"],
	rect: ["x", "y", "width", "height"],
	circle: ["cx", "cy", "r"],
	ellipse: ["cx", "cy", "rx", "ry"],
	polygon: ["points"],
	polyline: ["points"],
	path: ["d"],
};

const getAttributes = element => {
	const attributeValue = element.attributes;
	if (attributeValue == null) { return []; }
	const attributes = Array.from(attributeValue);
	return nodeSpecificAttrs[element.nodeName]
		? attributes
			.filter(a => !nodeSpecificAttrs[element.nodeName].includes(a.name))
		: attributes;
};

const objectifyAttributes = (list) => {
	const obj = {};
	list.forEach((a) => { obj[a.nodeName] = a.value; });
	return obj;
};
/**
 * @param {object} the parent element's attribute object
 * @param {Element} the current element
 */
const attrAssign = (parentAttrs, element) => {
	const attrs = objectifyAttributes(getAttributes(element));
	if (!attrs.transform && !parentAttrs.transform) {
		return { ...parentAttrs, ...attrs };
	}
	const elemTransform = attrs.transform || "";
	const parentTransform = parentAttrs.transform || "";
	const elemMatrix = transformStringToMatrix(elemTransform);
	const parentMatrix = transformStringToMatrix(parentTransform);
	const matrix = svg_multiplyMatrices2(parentMatrix, elemMatrix);
	const transform = `matrix(${matrix.join(", ")})`;
	return { ...parentAttrs, ...attrs, transform };
};
/**
 * @description Recurse through a DOM element and flatten all elements
 * into one array, where each element also has a style object which
 * contains a flat object of all attributes from the parents down
 * to the element itself, the closer to the element gets priority, and
 * the parent attributes will be overwritten, except in the case of
 * "transform", where the parent-child values are computed and merged.
 */
const flattenDomTreeWithStyle = (element, attributes = {}) => (
	element.childNodes == null || !element.childNodes.length
		? [{ element, attributes }]
		: Array.from(element.childNodes)
			.flatMap(child => flattenDomTreeWithStyle(child, attrAssign(attributes, child)))
);

export { addClass, findElementTypeInParents, flattenDomTree, flattenDomTreeWithStyle, getRootParent, xmlStringToElement };
