/* svg (c) Kraft, MIT License */
const COUNT = 128;
const parabolaArguments = (x = -1, y = 0, width = 2, height = 1) => Array
	.from(Array(COUNT + 1))
	.map((_, i) => ((i - (COUNT)) / COUNT) * 2 + 1)
	.map(i => [
		x + (i + 1) * width * 0.5,
		y + (i ** 2) * height,
	]);
const parabolaPathString = (a, b, c, d) => [
	parabolaArguments(a, b, c, d).map(n => `${n[0]},${n[1]}`).join(" "),
];

export { parabolaPathString as default };
