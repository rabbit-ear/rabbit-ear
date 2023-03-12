/* svg (c) Kraft, MIT License */
const roundRectArguments = (x, y, width, height, cornerRadius = 0) => {
	if (cornerRadius > width / 2) { cornerRadius = width / 2; }
	if (cornerRadius > height / 2) { cornerRadius = height / 2; }
	const w = width - cornerRadius * 2;
	const h = height - cornerRadius * 2;
	const s = `A${cornerRadius} ${cornerRadius} 0 0 1`;
	return [[`M${x + (width - w) / 2},${y}`, `h${w}`, s, `${x + width},${y + (height - h) / 2}`, `v${h}`, s, `${x + width - cornerRadius},${y + height}`, `h${-w}`, s, `${x},${y + height - cornerRadius}`, `v${-h}`, s, `${x + cornerRadius},${y}`].join(" ")];
};

export { roundRectArguments as default };
