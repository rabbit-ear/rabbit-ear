/* svg (c) Kraft, MIT License */
import parabolaPathString from './arguments.js';
import { str_points } from '../../../environment/strings.js';
import TransformMethods from '../shared/transforms.js';

const parabolaDef = {
	parabola: {
		nodeName: "polyline",
		attributes: [str_points],
		args: parabolaPathString,
		methods: {
			...TransformMethods,
		},
	},
};

export { parabolaDef as default };
