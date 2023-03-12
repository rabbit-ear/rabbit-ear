/* svg (c) Kraft, MIT License */
import makeCoordinates from '../../arguments/makeCoordinates.js';
import nodes_attributes from '../../spec/nodes_attributes.js';
import TransformMethods from './shared/transforms.js';
import methods from './shared/urls.js';
import * as dom from './shared/dom.js';

const setRectSize = (el, rx, ry) => {
	[, , rx, ry]
		.forEach((value, i) => el.setAttribute(nodes_attributes.rect[i], value));
	return el;
};
const setRectOrigin = (el, a, b) => {
	[...makeCoordinates(...[a, b].flat()).slice(0, 2)]
		.forEach((value, i) => el.setAttribute(nodes_attributes.rect[i], value));
	return el;
};
const fixNegatives = function (arr) {
	[0, 1].forEach(i => {
		if (arr[2 + i] < 0) {
			if (arr[0 + i] === undefined) { arr[0 + i] = 0; }
			arr[0 + i] += arr[2 + i];
			arr[2 + i] = -arr[2 + i];
		}
	});
	return arr;
};
const rectDef = {
	rect: {
		args: (a, b, c, d) => {
			const coords = makeCoordinates(...[a, b, c, d].flat()).slice(0, 4);
			switch (coords.length) {
			case 0: case 1: case 2: case 3: return fixNegatives([, , ...coords]);
			default: return fixNegatives(coords);
			}
		},
		methods: {
			origin: setRectOrigin,
			setOrigin: setRectOrigin,
			center: setRectOrigin,
			setCenter: setRectOrigin,
			size: setRectSize,
			setSize: setRectSize,
			...TransformMethods,
			...methods,
			...dom,
		},
	},
};

export { rectDef as default };
