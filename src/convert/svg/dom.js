/**
 * Rabbit Ear (c) Kraft
 */
import window from "../../environment/window.js";
/**
 * @param {string} input an SVG as a string
 * @param {string} mimeType default to XML, for SVG use "image/svg+xml".
 */
export const xmlStringToDOM = (input, mimeType = "text/xml") => (
	new (window().DOMParser)()
).parseFromString(input, mimeType).documentElement;
/**
 * @description Recurse through a DOM element and flatten all elements
 * into one array.
 * @todo when doing this on an SVG, <g> group elements can contain
 * upper level transforms and styles, doing this will loose
 * track of any of these attributes on all of its children.
 */
export const flattenDomTree = (el) => (el.children == null || !el.children.length
	? [el]
	: Array.from(el.children)
		.flatMap(child => flattenDomTree(child)));
/**
 * @description Get the furthest root parent up the DOM tree
 */
export const getRootParent = (el) => {
	let parent = el;
	while (parent.parentNode != null) {
		parent = parent.parentNode;
	}
	return parent;
};
