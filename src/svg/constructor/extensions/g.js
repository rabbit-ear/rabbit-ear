/* svg (c) Kraft, MIT License */
import '../../environment/window.js';
import TransformMethods from './shared/transforms.js';
import methods from './shared/urls.js';
import * as dom from './shared/dom.js';

const gDef = {
	g: {
		methods: {
			...TransformMethods,
			...methods,
			...dom,
		},
	},
};

export { gDef as default };
