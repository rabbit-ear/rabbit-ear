import cssColors from "./cssColors.json";
import hexToRGB from "./hexToRGB";

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
	// if (string.substring(0, 4) === "hsla") {
	// }
	// if (string.substring(0, 3) === "hsl") {
	// }
	return [0, 0, 0];
};

export default parseCSSColor;
