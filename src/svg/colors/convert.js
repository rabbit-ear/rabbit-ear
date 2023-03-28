/* svg (c) Kraft, MIT License */
const hslToRgb = (hue, saturation, lightness) => {
	const s = saturation / 100;
	const l = lightness / 100;
	const k = n => (n + hue / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = n => (
		l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
	);
	return [f(0), f(8), f(4)];
};
const hexToRgb = (string) => {
	const numbersOnly = string.replace(/#(?=\S)/g, "");
	const chars = Array.from(Array(6))
		.map((_, i) => numbersOnly[i] || "0");
	const hexString = numbersOnly.length <= 4
		? [0, 0, 1, 1, 2, 2].map(i => chars[i]).join("")
		: chars.join("");
	const c = parseInt(hexString, 16);
	return [(c >> 16) & 255, (c >> 8) & 255, c & 255]
		.map(n => n / 255);
};

export { hexToRgb, hslToRgb };
