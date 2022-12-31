/**
 * @description Convert a hex-style color string into 3 RGB values
 * @param {string} value a hex color code as a string
 * @returns {number[]} three values between 0 and 1
 */
const hexToRGB = (value) => {
	const numbersOnly = value.replace(/#(?=\S)/g, "");
	const hexString = numbersOnly.length === 3
		? [0, 0, 1, 1, 2, 2].map(i => numbersOnly[i]).join("")
		: numbersOnly;
	const c = parseInt(hexString, 16);
	return [(c >> 16) & 255, (c >> 8) & 255, c & 255]
		.map(n => n / 255);
};

export default hexToRGB;
