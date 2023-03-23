/* svg (c) Kraft, MIT License */
import init from './init.js';
import methods from './methods.js';

const origamiDef = {
	origami: {
		nodeName: "g",
		init,
		args: () => [],
		methods,
	},
};

export { origamiDef as default };
