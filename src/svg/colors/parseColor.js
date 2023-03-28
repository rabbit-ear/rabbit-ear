/* svg (c) Kraft, MIT License */
import cssColors from './cssColors.js';
import { hexToRgb, hslToRgb } from './convert.js';

const getParenNumbers = str => {
	const match = str.match(/\(([^\)]+)\)/g);
	if (match == null || !match.length) { return undefined; }
	return match[0]
		.substring(1, match[0].length - 1)
		.split(/[\s,]+/)
		.map(parseFloat);
};
const parseColor = (string) => {
	if (cssColors[string]) { return hexToRgb(cssColors[string]); }
	if (string[0] === "#") { return hexToRgb(string); }
	if (string.substring(0, 4) === "rgba"
		|| string.substring(0, 3) === "rgb") {
		const colors = getParenNumbers(string);
		[0, 1, 2].forEach((_, i) => { colors[i] /= 255; });
		return colors;
	}
	if (string.substring(0, 4) === "hsla"
		|| string.substring(0, 3) === "hsl") {
		return hslToRgb(...getParenNumbers(string));
	}
	return [0, 0, 0];
};

export { parseColor as default };
