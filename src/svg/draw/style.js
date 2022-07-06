/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../../general/strings";

// in each of these style functions, options has already been shortcut to the
// specific geometry entry of the global options object, like:
// "options" referrs to "options.attributes.edges" or "options.attributes.faces"

const component_classes = {
	vertices: [],
	edges: [S._unassigned, S._flat, S._valley, S._mountain, S._boundary],
	faces: [S._front, S._back, S._foldedForm],
	boundaries: [],
};
/**
 * @param {<g>} svg group element containing the children
 * @param {object} options object
 * @param {string} component name: "vertices", "edges", "faces", etc..
 */
const style_component = (group, { attributes }, component) => {
	// console.log("child nodes array", Array.from(group.childNodes).forEach);
	const classes = component_classes[component] || [];
	// element specific (<circle>, <polygon>, etc..)
	Array.from(group.childNodes)
		.filter(child => attributes[child.nodeName])
		.forEach(child => Object.keys(attributes[child.nodeName])
			.forEach(attr => child.setAttributeNS(null, attr, attributes[child.nodeName][attr])));
	// filter out className specific, attributes can be applied directly.
	Object.keys(attributes[component])
		.filter(key => !classes.includes(key))
		.forEach(key => group.setAttributeNS(null, key, attributes[component][key]));
	// class specific needs to visit each element individually, check its classes.
	if (classes.length === 0) { return; } // done if there are no classes (vertices)
	Array.from(group.childNodes)
		// for each element, for each class, apply attribute if class exists on element
		.forEach(child => Object.keys(attributes[component][child.getAttribute(S._class)] || {})
			.forEach(key => child.setAttributeNS(null, key, attributes[component][child.getAttribute(S._class)][key])));
};

export default style_component;
