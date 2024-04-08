/* svg (c) Kraft, MIT License */
import { svgSemiFlattenArrays } from '../../arguments/semiFlattenArrays.js';
import makeCoordinates from '../../arguments/makeCoordinates.js';
import nodes_attributes from '../../spec/nodes_attributes.js';
import TransformMethods from './shared/transforms.js';
import methods from './shared/urls.js';
import * as dom from './shared/dom.js';

/**
 * SVG (c) Kraft
 */

const Args = (...args) => makeCoordinates(...svgSemiFlattenArrays(...args)).slice(0, 4);

const setPoints = (element, ...args) => {
	Args(...args).forEach((value, i) => element.setAttribute(nodes_attributes.line[i], value));
	return element;
};
/**
 * @name line
 * @description SVG Line element
 * @memberof SVG
 */
const lineDef = {
	line: {
		args: Args,
		methods: {
			setPoints,
			...TransformMethods,
			...methods,
			...dom,
		},
	},
};

export { lineDef as default };
