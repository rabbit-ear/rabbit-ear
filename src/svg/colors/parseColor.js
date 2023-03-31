/* svg (c) Kraft, MIT License */
import cssColors from './cssColors.js';
import { hexToRgb, hslToRgb, rgbToHex } from './convert.js';

const getParenNumbers = str => {
	const match = str.match(/\(([^\)]+)\)/g);
	if (match == null || !match.length) { return []; }
	return match[0]
		.substring(1, match[0].length - 1)
		.split(/[\s,]+/)
		.map(parseFloat);
};
const parseColorToRgb = (string) => {
	if (cssColors[string]) { return hexToRgb(cssColors[string]); }
	if (string[0] === "#") { return hexToRgb(string); }
	if (string.substring(0, 4) === "rgba"
		|| string.substring(0, 3) === "rgb") {
		const values = getParenNumbers(string);
		[0, 1, 2]
			.filter(i => values[i] === undefined)
			.forEach(i => { values[i] = 0; });
		return values;
	}
	if (string.substring(0, 4) === "hsla"
		|| string.substring(0, 3) === "hsl") {
		const values = getParenNumbers(string);
		[0, 1, 2]
			.filter(i => values[i] === undefined)
			.forEach(i => { values[i] = 0; });
		const rgb = hslToRgb(...values);
		if (values.length === 4) { rgb.push(values[3]); }
		return rgb;
	}
	return undefined;
};
const parseColorToHex = (string) => {
	if (cssColors[string]) { return cssColors[string].toUpperCase(); }
	if (string[0] === "#") { return rgbToHex(...hexToRgb(string)); }
	if (string.substring(0, 4) === "rgba"
		|| string.substring(0, 3) === "rgb") {
		return rgbToHex(...getParenNumbers(string));
	}
	if (string.substring(0, 4) === "hsla"
		|| string.substring(0, 3) === "hsl") {
		const values = getParenNumbers(string);
		[0, 1, 2]
			.filter(i => values[i] === undefined)
			.forEach(i => { values[i] = 0; });
		const rgb = hslToRgb(...values);
		if (values.length === 4) { rgb.push(values[3]); }
		[0, 1, 2].forEach(i => { rgb[i] *= 255; });
		rgbToHex(...rgb);
	}
	return undefined;
};

export { parseColorToHex, parseColorToRgb };
