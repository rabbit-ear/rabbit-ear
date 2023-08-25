/* svg (c) Kraft, MIT License */
import ArrowMethods from './methods.js';
import init from './init.js';

/**
 * SVG (c) Kraft
 */

const arrowDef = {
	arrow: {
		nodeName: "g",
		attributes: [],
		args: () => [], // one function
		methods: ArrowMethods, // object of functions
		init,
	},
};

export { arrowDef as default };
