/**
 * Rabbit Ear (c) Kraft
 */
import cssColors from "./cssColors.js";
import hexToRGB from "./hexToRGB.js";

const HSLToRGB = (h, s, l) => {
	s /= 100;
	l /= 100;
	const k = n => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = n =>
		l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
	return [f(0), f(8), f(4)];
};

const getParenNumbers = str => {
	const match = str.match(/\(([^\)]+)\)/g);
	if (match == null || !match.length) { return undefined; }
	return match[0]
		.substring(1, match[0].length - 1)
		.split(/[\s,]+/)
		.map(parseFloat);
};
/**
 * @description input a css or svg color string, get out the
 * rgb value as three numbers in an array
 * @todo this currently ignores any alpha values
 */
const parseCSSColor = (string) => {
	if (cssColors[string]) { return hexToRGB(cssColors[string]); }
	if (string[0] === "#") { return hexToRGB(string); }
	if (string.substring(0, 4) === "rgba"
		|| string.substring(0, 3) === "rgb") {
		const colors = getParenNumbers(string);
		[0, 1, 2].forEach((_, i) => { colors[i] /= 255; });
		return colors;
	}
	if (string.substring(0, 4) === "hsla"
		|| string.substring(0, 3) === "hsl") {
		return HSLToRGB(...getParenNumbers(string));
	}
	return [0, 0, 0];
};

export default parseCSSColor;
