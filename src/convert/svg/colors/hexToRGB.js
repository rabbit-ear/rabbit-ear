/**
 * @description Convert a hex string into an array of
 * three numbers, the rgb values (between 0 and 1).
 * This ignores any alpha values.
 */
const hexToRGB = (string) => {
	const numbersOnly = string.replace(/#(?=\S)/g, "");
	// ensure a minimum number of characters (fill 0 if needed)
	const chars = Array.from(Array(6))
		.map((_, i) => numbersOnly[i] || "0");
	// handle abbreviated hex codes: #fb4 or #fb48 (with alpha)
	const hexString = numbersOnly.length <= 4
		? [0, 0, 1, 1, 2, 2].map(i => chars[i]).join("")
		: chars.join("");
	const c = parseInt(hexString, 16);
	return [(c >> 16) & 255, (c >> 8) & 255, c & 255]
		.map(n => n / 255);
};

export default hexToRGB;
