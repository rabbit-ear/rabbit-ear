/* SVG (c) Kraft */
/**
 * Rabbit Ear (c) Kraft
 */

const markerRegEx = /[MmLlSsQqLlHhVvCcSsQqTtAaZz]/g;
// numbers can be signed, have no leading digit (".5"), and an exponent ("1e-5").
// consecutive decimals are separate numbers: "1.5.5" is 1.5 and 0.5.
const digitRegEx = /[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g;

/**
 * @description Path names in English
 */
const pathCommandNames = {
	m: "move",
	l: "line",
	v: "vertical",
	h: "horizontal",
	a: "ellipse",
	c: "curve",
	s: "smoothCurve",
	q: "quadCurve",
	t: "smoothQuadCurve",
	z: "close",
};

// make capitalized copies of each command
Object.keys(pathCommandNames).forEach((key) => {
	const s = pathCommandNames[key];
	pathCommandNames[key.toUpperCase()] = s.charAt(0).toUpperCase() + s.slice(1);
});

/**
 * if the command is relative, it will build upon offset coordinate
 */
const add2path = (a, b) => [a[0] + (b[0] || 0), a[1] + (b[1] || 0)];
const getEndpoint = (command, values, offset = [0, 0]) => {
	const upper = command.toUpperCase();
	let origin = command === upper ? [0, 0] : offset;
	// H and V (uppercase) absolutely position themselves along their
	// horiz or vert axis, but they should carry over the other component
	if (command === "V") {
		origin = [offset[0], 0];
	}
	if (command === "H") {
		origin = [0, offset[1]];
	}
	switch (upper) {
		case "V":
			return add2path(origin, [0, values[0]]);
		case "H":
			return add2path(origin, [values[0], 0]);
		case "M":
		case "L":
		case "T":
			return add2path(origin, values);
		case "A":
			return add2path(origin, [values[5], values[6]]);
		case "C":
			return add2path(origin, [values[4], values[5]]);
		case "S":
		case "Q":
			return add2path(origin, [values[2], values[3]]);
		case "Z":
			return undefined; // cannot be set locally.
		default:
			return origin;
	}
};

/**
 * @description Parse a path "d" attribute into an array of objects,
 * where each object contains a command, and the numerical values.
 * @param {string} d the "d" attribute of a path.
 */
const parsePathCommands = (d) => {
	const results = [];
	let match = markerRegEx.exec(d);
	while (match !== null) {
		results.push(match);
		match = markerRegEx.exec(d);
	}
	return results
		.map((result, i, arr) => ({
			command: result[0],
			start: result.index,
			end: i === arr.length - 1 ? d.length - 1 : arr[(i + 1) % arr.length].index - 1,
		}))
		.map(({ command, start, end }) => {
			const valueString = d.substring(start + 1, end + 1);
			const strings = valueString.match(digitRegEx);
			const values = strings ? strings.map(parseFloat) : [];
			return { command, values };
		});
};

/**
 * @description The number of values which make up one set of parameters
 * for each command. A command can contain multiple sets of values,
 * for example "L 1 1 2 2" is two line commands.
 */
const commandValueCount = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };

/**
 * @description Split a command which contains multiple sets of values into
 * a list of commands, each containing one set. In the case of a move command,
 * all additional sets of values are implicitly line commands (SVG spec).
 * @param {{ command: string, values: number[] }} command a parsed command
 * @returns {{ command: string, values: number[] }[]} a list of commands
 */
const splitCommandValueSets = ({ command, values }) => {
	const upper = command.toUpperCase();
	const count = commandValueCount[upper];
	if (!count || values.length <= count) {
		return [{ command, values }];
	}
	const lineCommand = command === upper ? "L" : "l";
	return Array.from(Array(Math.floor(values.length / count))).map((_, i) => ({
		command: i > 0 && upper === "M" ? lineCommand : command,
		values: values.slice(i * count, (i + 1) * count),
	}));
};

/**
 * @description Parse a path "d" attribute into an array of objects, one for
 * every segment, where each object contains a command, its numerical values,
 * and the start and end points of the segment. Commands with multiple sets
 * of values ("L 1 1 2 2") will be split into multiple commands.
 * @param {string} d the "d" attribute of a path.
 * @returns {{
 *   command: string,
 *   values: number[],
 *   start: number[],
 *   end: number[],
 * }[]}
 */
const parsePathCommandsWithEndpoints = (d) => {
	let pen = [0, 0];
	// the start of the current subpath, this is where a "Z" command returns to
	let subpathStart = [0, 0];
	return parsePathCommands(d)
		.flatMap(splitCommandValueSets)
		.map(({ command, values }) => {
			const upper = command.toUpperCase();
			const start = pen;
			const end = upper === "Z" ? [...subpathStart] : getEndpoint(command, values, pen);
			if (upper === "M") {
				subpathStart = end;
			}
			pen = end;
			return { command, values, start, end };
		});
};

export { parsePathCommands, parsePathCommandsWithEndpoints, pathCommandNames };
