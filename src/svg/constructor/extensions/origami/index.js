/* svg (c) Kraft, MIT License */
import init from './init.js';
import methods from './methods.js';

/**
 * SVG (c) Kraft
 */

const origamiDef = {
	origami: {
		nodeName: "g",
		init,
		args: () => [],
		methods,
	},
};

export { origamiDef as default };
