/* svg (c) Kraft, MIT License */
import ArrowMethods from './methods.js';
import init from './init.js';

const arrowDef = {
	arrow: {
		nodeName: "g",
		attributes: [],
		args: () => [],
		methods: ArrowMethods,
		init,
	},
};

export { arrowDef as default };
