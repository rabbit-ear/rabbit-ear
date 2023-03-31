/* svg (c) Kraft, MIT License */
const hslToRgb = (hue, saturation, lightness) => {
	const s = saturation / 100;
	const l = lightness / 100;
	const k = n => (n + hue / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = n => (
		l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
	);
	return [f(0) * 255, f(8) * 255, f(4) * 255];
};
const mapHexNumbers = (numbers, map) => {
	const chars = Array.from(Array(map.length))
		.map((_, i) => numbers[i] || "0");
	return numbers.length <= 4
		? map.map(i => chars[i]).join("")
		: chars.join("");
};
const hexToRgb = (string) => {
	const numbers = string.replace(/#(?=\S)/g, "");
	const hasAlpha = numbers.length === 4 || numbers.length === 8;
	const hexString = hasAlpha
		? mapHexNumbers(numbers, [0, 0, 1, 1, 2, 2, 3, 3])
		: mapHexNumbers(numbers, [0, 0, 1, 1, 2, 2]);
	const c = parseInt(hexString, 16);
	return hasAlpha
		? [(c >> 24) & 255, (c >> 16) & 255, (c >> 8) & 255, c & 255]
		: [(c >> 16) & 255, (c >> 8) & 255, c & 255];
};
const rgbToHex = (red, green, blue, alpha) => {
	const to16 = n => `00${Math.max(0, Math.min(Math.round(n), 255)).toString(16)}`
		.slice(-2);
	const hex = `#${[red, green, blue].map(to16).join("")}`;
	return alpha === undefined
		? hex
		: `${hex}${to16(alpha * 255)}`;
};

export { hexToRgb, hslToRgb, rgbToHex };
