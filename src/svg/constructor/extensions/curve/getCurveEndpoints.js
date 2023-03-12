/* svg (c) Kraft, MIT License */
const getNumbersFromPathCommand = str => str
	.slice(1)
	.split(/[, ]+/)
	.map(s => parseFloat(s));
const getCurveTos = d => d
	.match(/[Cc][(0-9), .-]+/)
	.map(curve => getNumbersFromPathCommand(curve));
const getMoveTos = d => d
	.match(/[Mm][(0-9), .-]+/)
	.map(curve => getNumbersFromPathCommand(curve));
const getCurveEndpoints = (d) => {
	const move = getMoveTos(d).shift();
	const curve = getCurveTos(d).shift();
	const start = move
		? [move[move.length - 2], move[move.length - 1]]
		: [0, 0];
	const end = curve
		? [curve[curve.length - 2], curve[curve.length - 1]]
		: [0, 0];
	return [...start, ...end];
};

export { getCurveEndpoints as default };
