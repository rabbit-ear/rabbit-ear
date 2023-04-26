/* svg (c) Kraft, MIT License */
import NS from '../../spec/namespace.js';
import SVGWindow from '../../environment/window.js';
import makeCoordinates from '../../arguments/makeCoordinates.js';
import { str_string } from '../../environment/strings.js';
import TransformMethods from './shared/transforms.js';
import methods from './shared/urls.js';
import { appendTo, setAttributes } from './shared/dom.js';

const textDef = {
	text: {
		args: (a, b, c) => makeCoordinates(...[a, b, c].flat()).slice(0, 2),
		init: (a, b, c, d) => {
			const element = SVGWindow().document.createElementNS(NS, "text");
			const text = [a, b, c, d].filter(el => typeof el === str_string).shift();
			element.appendChild(SVGWindow().document.createTextNode(text || ""));
			return element;
		},
		methods: {
			...TransformMethods,
			...methods,
			appendTo,
			setAttributes,
		},
	},
};

export { textDef as default };