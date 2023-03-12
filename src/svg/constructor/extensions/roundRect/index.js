/* svg (c) Kraft, MIT License */
import roundRectArguments from './arguments.js';
import { str_path } from '../../../environment/strings.js';
import TransformMethods from '../shared/transforms.js';

const roundRectDef = {
	roundRect: {
		nodeName: str_path,
		attributes: ["d"],
		args: roundRectArguments,
		methods: {
			...TransformMethods,
		},
	},
};

export { roundRectDef as default };
