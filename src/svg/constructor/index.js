/* svg (c) Kraft, MIT License */
import SVGWindow from '../environment/window.js';
import NS from '../spec/namespace.js';
import nodes_children from '../spec/nodes_children.js';
import nodes_attributes from '../spec/nodes_attributes.js';
import { toCamel } from '../methods/transformCase.js';
import extensions from './extensions/index.js';

const passthroughArgs = (...args) => args;
const Constructor = (name, parent, ...initArgs) => {
	const nodeName = extensions[name] && extensions[name].nodeName
		? extensions[name].nodeName
		: name;
	const { init, args, methods } = extensions[name] || {};
	const attributes = nodes_attributes[nodeName] || [];
	const children = nodes_children[nodeName] || [];
	const element = init
		?	init(...initArgs)
		: SVGWindow().document.createElementNS(NS, nodeName);
	if (parent) { parent.appendChild(element); }
	const processArgs = args || passthroughArgs;
	processArgs(...initArgs).forEach((v, i) => {
		element.setAttribute(nodes_attributes[nodeName][i], v);
	});
	if (methods) {
		Object.keys(methods)
			.forEach(methodName => Object.defineProperty(element, methodName, {
				value: function () {
					return methods[methodName](element, ...arguments);
				},
			}));
	}
	attributes.forEach((attribute) => {
		const attrNameCamel = toCamel(attribute);
		if (element[attrNameCamel]) { return; }
		Object.defineProperty(element, attrNameCamel, {
			value: function () {
				element.setAttribute(attribute, ...arguments);
				return element;
			},
		});
	});
	children.forEach((childNode) => {
		if (element[childNode]) { return; }
		const value = function () { return Constructor(childNode, element, ...arguments); };
		Object.defineProperty(element, childNode, { value });
	});
	return element;
};

export { Constructor as default };
