/* svg (c) Kraft, MIT License */
import makeCoordinates from '../../arguments/makeCoordinates.js';
import nodes_attributes from '../../spec/nodes_attributes.js';
import { svg_distance2 } from '../../general/algebra.js';
import TransformMethods from './shared/transforms.js';
import methods from './shared/urls.js';
import * as dom from './shared/dom.js';

const setRadius = (el, r) => {
	el.setAttribute(nodes_attributes.circle[2], r);
	return el;
};
const setOrigin = (el, a, b) => {
	[...makeCoordinates(...[a, b].flat()).slice(0, 2)]
		.forEach((value, i) => el.setAttribute(nodes_attributes.circle[i], value));
	return el;
};
const fromPoints = (a, b, c, d) => [a, b, svg_distance2([a, b], [c, d])];
const circleDef = {
	circle: {
		args: (a, b, c, d) => {
			const coords = makeCoordinates(...[a, b, c, d].flat());
			switch (coords.length) {
			case 0: case 1: return [, , ...coords];
			case 2: case 3: return coords;
			default: return fromPoints(...coords);
			}
		},
		methods: {
			radius: setRadius,
			setRadius,
			origin: setOrigin,
			setOrigin,
			center: setOrigin,
			setCenter: setOrigin,
			position: setOrigin,
			setPosition: setOrigin,
			...TransformMethods,
			...methods,
			...dom,
		},
	},
};

export { circleDef as default };
