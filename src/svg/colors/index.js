/* svg (c) Kraft, MIT License */
import * as convert from './convert.js';
import cssColors from './cssColors.js';
import parseColor from './parseColor.js';

const colors = {
	...convert,
	cssColors,
	parseColor,
};

export { colors as default };
