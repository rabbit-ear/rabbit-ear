/* svg (c) Kraft, MIT License */
import init from './init.js';
import methods from './methods.js';

const origamiDef = {
	origami: {
		nodeName: "g",
		init,
		methods,
	},
};

export { origamiDef as default };
