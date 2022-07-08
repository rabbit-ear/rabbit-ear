/* SVG (c) Kraft, MIT License */
/**
 * SVG (c) Kraft
 */
const SVG_Constructor = {
	init: () => {},
};
/**
 * @name svg
 * @description Create an svg element, the object will be bound with instance
 * methods for creating children and styles.
 * @memberof svg
 * @param {Element} [parent=undefined] optional parent DOM element, this will append to.
 * @param {number} [width=undefined] optional width of viewBox (if present, include height)
 * @param {number} [height=undefined] optional height of viewBox (if present, include width)
 * @param {function} [callback=undefined] optional function which will be
 * executed upon completion of initialization.
 * @returns {Element} one svg DOM element
 * @example
 * var svg = ear.svg(document.body, 640, 480)
 * @example
 * ear.svg(640, 480, document.body, (svg) => {
 *   // window did load, and "svg" is scoped
 * })
 * @linkcode SVG ./src/library.js 24
 */
function SVG () {
	return SVG_Constructor.init(...arguments);
}

/**
 * SVG (c) Kraft
 */
// frequently-used strings
const str_class = "class";
const str_function = "function";
const str_undefined = "undefined";
const str_boolean = "boolean";
const str_number = "number";
const str_string = "string";
const str_object = "object";

const str_svg = "svg";
const str_path = "path";

const str_id = "id";
const str_style = "style";
const str_viewBox = "viewBox";
const str_transform = "transform";
const str_points = "points";
const str_stroke = "stroke";
const str_fill = "fill";
const str_none = "none";

const str_arrow = "arrow";
const str_head = "head";
const str_tail = "tail";

/**
 * SVG (c) Kraft
 */

// compare to "undefined", the string
const isBrowser = typeof window !== str_undefined
	&& typeof window.document !== str_undefined;

const isNode = typeof process !== str_undefined
	&& process.versions != null
	&& process.versions.node != null;

const svgErrors = [];

svgErrors[10] = "\"error 010: window\" not set. if using node/deno, include package @xmldom/xmldom, set to the main export ( ear.window = xmldom; )";

/**
 * SVG (c) Kraft
 */

const svgWindowContainer = { window: undefined };

const buildHTMLDocument = (newWindow) => new newWindow.DOMParser()
	.parseFromString("<!DOCTYPE html><title>.</title>", "text/html");

const setWindow = (newWindow) => {
	// make sure window has a document. xmldom does not, and requires it be built.
	if (!newWindow.document) { newWindow.document = buildHTMLDocument(newWindow); }
	svgWindowContainer.window = newWindow;
	return svgWindowContainer.window;
};
// if we are in the browser, by default use the browser's "window".
if (isBrowser) { svgWindowContainer.window = window; }
/**
 * @description get the "window" object, which should have
 * DOMParser, XMLSerializer, and document.
 */
const SVGWindow = () => {
	if (svgWindowContainer.window === undefined) {
		throw svgErrors[10];
	}
	return svgWindowContainer.window;
};

/**
 * SVG (c) Kraft
 */
/** @description The namespace of an SVG element, the value of the attribute xmlns */
var NS = "http://www.w3.org/2000/svg";

/**
 * SVG (c) Kraft
 */
var NodeNames = {
	s: [  // svg
		"svg",
	],
	d: [  // defs
		"defs",      // can only be inside svg
	],
	h: [  // header
		"desc",      // anywhere, usually top level SVG, or <defs>
		"filter",    // anywhere, usually top level SVG, or <defs>
		"metadata",  // anywhere, usually top level SVG, or <defs>
		"style",     // anywhere, usually top level SVG, or <defs>
		"script",    // anywhere, usually top level SVG, or <defs>
		"title",     // anywhere, usually top level SVG, or <defs>
		"view",      // anywhere.  use attrs ‘viewBox’, ‘preserveAspectRatio’, ‘zoomAndPan’
	],
	c: [  // cdata
		"cdata",
	],
	g: [  // group
		"g",  // can contain drawings
	],
	v: [  // visible (drawing)
		"circle",
		"ellipse",
		"line",
		"path",
		"polygon",
		"polyline",
		"rect",
	],
	t: [  // text
		"text",
	],
	// can contain drawings
	i: [  // invisible
		"marker",    // anywhere, usually top level SVG, or <defs>
		"symbol",    // anywhere, usually top level SVG, or <defs>
		"clipPath",  // anywhere, usually top level SVG, or <defs>
		"mask",      // anywhere, usually top level SVG, or <defs>
	],
	p: [  // patterns
		"linearGradient", // <defs>
		"radialGradient", // <defs>
		"pattern",        // <defs>
	],
	cT: [ // children of text
		"textPath",   // <text>  path and href attributes
		"tspan",      // <text>
	],
	cG: [  // children of gradients
		"stop",           // <linearGradient> <radialGrandient>
	],
	cF: [  // children of filter
		"feBlend",             // <filter>
		"feColorMatrix",       // <filter>
		"feComponentTransfer", // <filter>
		"feComposite",         // <filter>
		"feConvolveMatrix",    // <filter>
		"feDiffuseLighting",   // <filter>
		"feDisplacementMap",   // <filter>
		"feDistantLight",      // <filter>
		"feDropShadow",        // <filter>
		"feFlood",             // <filter>
		"feFuncA",             // <filter>
		"feFuncB",             // <filter>
		"feFuncG",             // <filter>
		"feFuncR",             // <filter>
		"feGaussianBlur",      // <filter>
		"feImage",             // <filter>
		"feMerge",             // <filter>
		"feMergeNode",         // <filter>
		"feMorphology",        // <filter>
		"feOffset",            // <filter>
		"fePointLight",        // <filter>
		"feSpecularLighting",  // <filter>
		"feSpotLight",         // <filter>
		"feTile",              // <filter>
		"feTurbulence",        // <filter>
	],
};

/**
 * SVG (c) Kraft
 */
const svg_add2 = (a, b) => [a[0] + b[0], a[1] + b[1]];
const svg_sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
const svg_scale2 = (a, s) => [a[0] * s, a[1] * s];
const svg_magnitudeSq2 = (a) => (a[0] ** 2) + (a[1] ** 2);
const svg_magnitude2 = (a) => Math.sqrt(svg_magnitudeSq2(a));
const svg_distanceSq2 = (a, b) => svg_magnitudeSq2(svg_sub2(a, b));
const svg_distance2 = (a, b) => Math.sqrt(svg_distanceSq2(a, b));
const svg_polar_to_cart = (a, d) => [Math.cos(a) * d, Math.sin(a) * d];

var svg_algebra = /*#__PURE__*/Object.freeze({
	__proto__: null,
	svg_add2: svg_add2,
	svg_sub2: svg_sub2,
	svg_scale2: svg_scale2,
	svg_magnitudeSq2: svg_magnitudeSq2,
	svg_magnitude2: svg_magnitude2,
	svg_distanceSq2: svg_distanceSq2,
	svg_distance2: svg_distance2,
	svg_polar_to_cart: svg_polar_to_cart
});

/**
 * SVG (c) Kraft
 */

const arcPath = (x, y, radius, startAngle, endAngle, includeCenter = false) => {
	if (endAngle == null) { return ""; }
	const start = svg_polar_to_cart(startAngle, radius);
	const end = svg_polar_to_cart(endAngle, radius);
	const arcVec = [end[0] - start[0], end[1] - start[1]];
	const py = start[0] * end[1] - start[1] * end[0];
	const px = start[0] * end[0] + start[1] * end[1];
	const arcdir = (Math.atan2(py, px) > 0 ? 0 : 1);
	let d = (includeCenter
		? `M ${x},${y} l ${start[0]},${start[1]} `
		: `M ${x + start[0]},${y + start[1]} `);
	d += ["a ", radius, radius, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");
	if (includeCenter) { d += " Z"; }
	return d;
};

/**
 * SVG (c) Kraft
 */

const arcArguments = (a, b, c, d, e) => [arcPath(a, b, c, d, e, false)];

var Arc = {
	arc: {
		nodeName: str_path,
		attributes: ["d"],
		args: arcArguments,
		methods: {
			setArc: (el, ...args) => el.setAttribute("d", arcArguments(...args)),
		},
	},
};

/**
 * SVG (c) Kraft
 */

const wedgeArguments = (a, b, c, d, e) => [arcPath(a, b, c, d, e, true)];

var Wedge = {
	wedge: {
		nodeName: str_path,
		args: wedgeArguments,
		attributes: ["d"],
		methods: {
			setArc: (el, ...args) => el.setAttribute("d", wedgeArguments(...args)),
		},
	},
};

/**
 * SVG (c) Kraft
 */
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

/**
 * SVG (c) Kraft
 */

var Parabola = {
	parabola: {
		nodeName: "polyline",
		attributes: [str_points],
		args: parabolaPathString
	}
};

/**
 * SVG (c) Kraft
 */
const regularPolygonArguments = (sides, cX, cY, radius) => {
	const origin = [cX, cY];
	// default is point-aligned along the axis.
	// if we want edge-aligned, add this value to the angle.
	// const halfwedge = Math.PI / sides;
	return Array.from(Array(sides))
		.map((el, i) => 2 * Math.PI * (i / sides))
		.map(a => [Math.cos(a), Math.sin(a)])
		.map(pts => origin.map((o, i) => o + radius * pts[i]));
};

const polygonPathString = (sides, cX = 0, cY = 0, radius = 1) => [
	regularPolygonArguments(sides, cX, cY, radius)
		.map(a => `${a[0]},${a[1]}`).join(" "),
];

/**
 * SVG (c) Kraft
 */

var RegularPolygon = {
	regularPolygon: {
		nodeName: "polygon",
		attributes: [str_points],
		args: polygonPathString,
	},
};

/**
 * SVG (c) Kraft
 */
const roundRectArguments = (x, y, width, height, cornerRadius = 0) => {
	if (cornerRadius > width / 2) { cornerRadius = width / 2; }
	if (cornerRadius > height / 2) { cornerRadius = height / 2; }
	const w = width - cornerRadius * 2;
	const h = height - cornerRadius * 2;
	const s = `A${cornerRadius} ${cornerRadius} 0 0 1`;
	return [[`M${x + (width - w) / 2},${y}`, `h${w}`, s, `${x + width},${y + (height - h) / 2}`, `v${h}`, s, `${x + width - cornerRadius},${y + height}`, `h${-w}`, s, `${x},${y + height - cornerRadius}`, `v${-h}`, s, `${x + cornerRadius},${y}`].join(" ")];
};

/**
 * SVG (c) Kraft
 */

var RoundRect = {
	roundRect: {
		nodeName: str_path,
		attributes: ["d"],
		args: roundRectArguments,
	},
};

/**
 * SVG (c) Kraft
 */
var Case = {
	toCamel: s => s
		.replace(/([-_][a-z])/ig, $1 => $1
			.toUpperCase()
			.replace("-", "")
			.replace("_", "")),
	toKebab: s => s
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/([A-Z])([A-Z])(?=[a-z])/g, "$1-$2")
		.toLowerCase(),
	capitalized: s => s
		.charAt(0).toUpperCase() + s.slice(1),
};

/**
 * SVG (c) Kraft
 */

const svg_is_iterable = (obj) => obj != null && typeof obj[Symbol.iterator] === str_function;
/**
 * @description flatten only until the point of comma separated entities. recursive
 * @returns always an array
 */
const svg_semi_flatten_arrays = function () {
	switch (arguments.length) {
	case undefined:
	case 0: return Array.from(arguments);
	// only if its an array (is iterable) and NOT a string
	case 1: return svg_is_iterable(arguments[0]) && typeof arguments[0] !== str_string
		? svg_semi_flatten_arrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (svg_is_iterable(a)
			? [...svg_semi_flatten_arrays(a)]
			: a));
	}
};

/**
 * SVG (c) Kraft
 */
/**
 * this will extract coordinates from a set of inputs
 * and present them as a stride-2 flat array. length % 2 === 0
 * a 1D array of numbers, alternating x y
 *
 * use flatten() everytime you call this!
 * it's necessary the entries sit at the top level of ...args
 * findCoordinates(...flatten(...args));
 */
var coordinates = (...args) => args
	.filter(a => typeof a === str_number)
	.concat(args
		.filter(a => typeof a === str_object && a !== null)
		.map((el) => {
			if (typeof el.x === str_number) { return [el.x, el.y]; }
			if (typeof el[0] === str_number) { return [el[0], el[1]]; }
			return undefined;
		}).filter(a => a !== undefined)
		.reduce((a, b) => a.concat(b), []));
// [top-level numbers] concat [{x:,y:} and [0,1]] style

/**
 * SVG (c) Kraft
 */

const ends = [str_tail, str_head];
const stringifyPoint = p => p.join(",");
const pointsToPath = (points) => "M" + points.map(pt => pt.join(",")).join("L") + "Z";

const makeArrowPaths = function (options) {
	// throughout, tail is 0, head is 1
	let pts = [[0,1], [2,3]].map(pt => pt.map(i => options.points[i] || 0));
	let vector = svg_sub2(pts[1], pts[0]);
	let midpoint = svg_add2(pts[0], svg_scale2(vector, 0.5));
	// make sure arrow isn't too small
	const len = svg_magnitude2(vector);
	const minLength = ends
		.map(s => (options[s].visible
			? (1 + options[s].padding) * options[s].height * 2.5
			: 0))
		.reduce((a, b) => a + b, 0);
	if (len < minLength) {
		// check len === exactly 0. don't compare to epsilon here
		const minVec = len === 0 ? [minLength, 0] : svg_scale2(vector, minLength / len);
		pts = [svg_sub2, svg_add2].map(f => f(midpoint, svg_scale2(minVec, 0.5)));
		vector = svg_sub2(pts[1], pts[0]);
	}
	let perpendicular = [vector[1], -vector[0]];
	let bezPoint = svg_add2(midpoint, svg_scale2(perpendicular, options.bend));
	const bezs = pts.map(pt => svg_sub2(bezPoint, pt));
	const bezsLen = bezs.map(v => svg_magnitude2(v));
	const bezsNorm = bezs.map((bez, i) => bezsLen[i] === 0
		? bez
		: svg_scale2(bez, 1 / bezsLen[i]));
	const vectors = bezsNorm.map(norm => svg_scale2(norm, -1));
	const normals = vectors.map(vec => [vec[1], -vec[0]]);
	// get padding from either head/tail options or root of options
	const pad = ends.map((s, i) => options[s].padding
		? options[s].padding
		: (options.padding ? options.padding : 0.0));
	const scales = ends
		.map((s, i) => options[s].height * (options[s].visible ? 1 : 0))
		.map((n, i) => n + pad[i]);
		// .map((s, i) => options[s].height * ((options[s].visible ? 1 : 0) + pad[i]));
	const arcs = pts.map((pt, i) => svg_add2(pt, svg_scale2(bezsNorm[i], scales[i])));
	// readjust bezier curve now that the arrow heads push inwards
	vector = svg_sub2(arcs[1], arcs[0]);
	perpendicular = [vector[1], -vector[0]];
	midpoint = svg_add2(arcs[0], svg_scale2(vector, 0.5));
	bezPoint = svg_add2(midpoint, svg_scale2(perpendicular, options.bend));
	// done adjust
	const controls = arcs
		.map((arc, i) => svg_add2(arc, svg_scale2(svg_sub2(bezPoint, arc), options.pinch)));
	const polyPoints = ends.map((s, i) => [
		svg_add2(arcs[i], svg_scale2(vectors[i], options[s].height)),
		svg_add2(arcs[i], svg_scale2(normals[i], options[s].width / 2)),
		svg_add2(arcs[i], svg_scale2(normals[i], -options[s].width / 2)),
	]);
	return {
		line: `M${stringifyPoint(arcs[0])}C${stringifyPoint(controls[0])},${stringifyPoint(controls[1])},${stringifyPoint(arcs[1])}`,
		tail: pointsToPath(polyPoints[0]),
		head: pointsToPath(polyPoints[1]),
	};
};

/**
 * SVG (c) Kraft
 */

// end is "head" or "tail"
const setArrowheadOptions = (element, options, which) => {
	if (typeof options === str_boolean) {
		element.options[which].visible = options;
	} else if (typeof options === str_object) {
		Object.assign(element.options[which], options);
		if (options.visible == null) {
			element.options[which].visible = true;
		}
	} else if (options == null) {
		element.options[which].visible = true;
	}
};

const setArrowStyle = (element, options = {}, which = str_head) => {
	const path = element.getElementsByClassName(`${str_arrow}-${which}`)[0];
	// find options which translate to object methods (el.stroke("red"))
	Object.keys(options)
		.map(key => ({ key, fn: path[Case.toCamel(key)] }))
		.filter(el => typeof el.fn === str_function && el.key !== "class")
		.forEach(el => el.fn(options[el.key]));
	// find options which don't work as methods, set as attributes
	// Object.keys(options)
	// 	.map(key => ({ key, fn: path[Case.toCamel(key)] }))
	// 	.filter(el => typeof el.fn !== S.str_function && el.key !== "class")
	// 	.forEach(el => path.setAttribute(el.key, options[el.key]));
	//
	// apply a class attribute (add, don't overwrite existing classes)
	Object.keys(options)
		.filter(key => key === "class")
		.forEach(key => path.classList.add(options[key]));
};

const redraw = (element) => {
	const paths = makeArrowPaths(element.options);
	Object.keys(paths)
		.map(path => ({
			path,
			element: element.getElementsByClassName(`${str_arrow}-${path}`)[0],
		}))
		.filter(el => el.element)
		.map(el => { el.element.setAttribute("d", paths[el.path]); return el; })
		.filter(el => element.options[el.path])
		.forEach(el => el.element.setAttribute(
			"visibility",
			element.options[el.path].visible
				? "visible"
				: "hidden",
		));
	return element;
};

const setPoints$3 = (element, ...args) => {
	element.options.points = coordinates(...svg_semi_flatten_arrays(...args)).slice(0, 4);
	return redraw(element);
};

const bend$1 = (element, amount) => {
	element.options.bend = amount;
	return redraw(element);
};

const pinch$1 = (element, amount) => {
	element.options.pinch = amount;
	return redraw(element);
};

const padding = (element, amount) => {
	element.options.padding = amount;
	return redraw(element);
};

const head = (element, options) => {
	setArrowheadOptions(element, options, str_head);
	setArrowStyle(element, options, str_head);
	return redraw(element);
};

const tail = (element, options) => {
	setArrowheadOptions(element, options, str_tail);
	setArrowStyle(element, options, str_tail);
	return redraw(element);
};

const getLine = element => element.getElementsByClassName(`${str_arrow}-line`)[0];
const getHead = element => element.getElementsByClassName(`${str_arrow}-${str_head}`)[0];
const getTail = element => element.getElementsByClassName(`${str_arrow}-${str_tail}`)[0];

var ArrowMethods = {
	setPoints: setPoints$3,
	points: setPoints$3,
	bend: bend$1,
	pinch: pinch$1,
	padding,
	head,
	tail,
	getLine,
	getHead,
	getTail,
};

/**
 * SVG (c) Kraft
 */
const endOptions = () => ({
	visible: false,
	width: 8,
	height: 10,
	padding: 0.0,
});

const makeArrowOptions = () => ({
	head: endOptions(),
	tail: endOptions(),
	bend: 0.0,
	padding: 0.0,
	pinch: 0.618,
	points: [],
});

/**
 * SVG (c) Kraft
 */

const arrowKeys = Object.keys(makeArrowOptions());

const matchingOptions = (...args) => {
	for (let a = 0; a < args.length; a += 1) {
		if (typeof args[a] !== str_object) { continue; }
		const keys = Object.keys(args[a]);
		for (let i = 0; i < keys.length; i += 1) {
			if (arrowKeys.includes(keys[i])) {
				return args[a];
			}
		}
	}
	return undefined;
};

const init = function (element, ...args) {
	element.classList.add(str_arrow);
	// element.setAttribute(S.str_class, S.str_arrow);
	const paths = ["line", str_tail, str_head]
		.map(key => SVG.path().addClass(`${str_arrow}-${key}`).appendTo(element));
	paths[0].setAttribute(str_style, "fill:none;");
	paths[1].setAttribute(str_stroke, str_none);
	paths[2].setAttribute(str_stroke, str_none);
	element.options = makeArrowOptions();
	ArrowMethods.setPoints(element, ...args);
	const options = matchingOptions(...args);
	if (options) {
		Object.keys(options)
			.filter(key => ArrowMethods[key])
			.forEach(key => ArrowMethods[key](element, options[key]));
	}
	return element;
};

/**
 * SVG (c) Kraft
 */

var Arrow = {
	arrow: {
		nodeName: "g",
		attributes: [],
		args: () => [], // one function
		methods: ArrowMethods, // object of functions
		init,
	},
};

/**
 * SVG (c) Kraft
 */
/**
 * @description totally flatten, recursive
 * @returns an array, always.
 */
const svg_flatten_arrays = function () {
	return svg_semi_flatten_arrays(arguments).reduce((a, b) => a.concat(b), []);
};

/**
 * SVG (c) Kraft
 */

// endpoints is an array of 4 numbers
const makeCurvePath = (endpoints = [], bend = 0, pinch = 0.5) => {
	const tailPt = [endpoints[0] || 0, endpoints[1] || 0];
	const headPt = [endpoints[2] || 0, endpoints[3] || 0];
	const vector = svg_sub2(headPt, tailPt);
	const midpoint = svg_add2(tailPt, svg_scale2(vector, 0.5));
	const perpendicular = [vector[1], -vector[0]];
	const bezPoint = svg_add2(midpoint, svg_scale2(perpendicular, bend));
	const tailControl = svg_add2(tailPt, svg_scale2(svg_sub2(bezPoint, tailPt), pinch));
	const headControl = svg_add2(headPt, svg_scale2(svg_sub2(bezPoint, headPt), pinch));
	return `M${tailPt[0]},${tailPt[1]}C${tailControl[0]},${tailControl[1]} ${headControl[0]},${headControl[1]} ${headPt[0]},${headPt[1]}`;
};

/**
 * SVG (c) Kraft
 */

const curveArguments = (...args) => [
	makeCurvePath(coordinates(...svg_flatten_arrays(...args))),
];

/**
 * SVG (c) Kraft
 */
const getNumbersFromPathCommand = str => str
	.slice(1)
	.split(/[, ]+/)
	.map(s => parseFloat(s));

// this gets the parameter numbers, in an array
const getCurveTos = d => d
	.match(/[Cc][(0-9), .-]+/)
	.map(curve => getNumbersFromPathCommand(curve));

const getMoveTos = d => d
	.match(/[Mm][(0-9), .-]+/)
	.map(curve => getNumbersFromPathCommand(curve));

const getCurveEndpoints = (d) => {
	// get only the first Move and Curve commands
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

/**
 * SVG (c) Kraft
 */

const setPoints$2 = (element, ...args) => {
	const coords = coordinates(...svg_flatten_arrays(...args)).slice(0, 4);
	element.setAttribute("d", makeCurvePath(coords, element._bend, element._pinch));
	return element;
};

const bend = (element, amount) => {
	element._bend = amount;
	return setPoints$2(element, ...getCurveEndpoints(element.getAttribute("d")));
};

const pinch = (element, amount) => {
	element._pinch = amount;
	return setPoints$2(element, ...getCurveEndpoints(element.getAttribute("d")));
};

var curve_methods = {
	setPoints: setPoints$2,
	bend,
	pinch,
};

/**
 * SVG (c) Kraft
 */

var Curve = {
	curve: {
		nodeName: str_path,
		attributes: ["d"],
		args: curveArguments, // one function
		methods: curve_methods, // object of functions
	},
};

/**
 * SVG (c) Kraft
 */

const nodes = {};

Object.assign(
	nodes,
	// to include/exclude nodes from this library
	// comment out nodes below, rebuild
	Arc,
	Wedge,
	Parabola,
	RegularPolygon,
	RoundRect,
	Arrow,
	Curve,
);

/**
 * SVG (c) Kraft
 */

// arc, parabola, regularPolygon...
const customPrimitives = Object.keys(nodes);
// todo, get rid of custom primitives here if possible

const headerStuff = [NodeNames.h, NodeNames.p, NodeNames.i];
// const drawingShapes = [N.g, N.v, N.t];//, customPrimitives];
const drawingShapes = [NodeNames.g, NodeNames.v, NodeNames.t, customPrimitives];

const folders = {
	// VISIBLE
	svg: [NodeNames.s, NodeNames.d].concat(headerStuff).concat(drawingShapes),
	g: drawingShapes,
	text: [NodeNames.cT],
	linearGradient: [NodeNames.cG],
	radialGradient: [NodeNames.cG],
	// NON VISIBLE
	defs: headerStuff,
	filter: [NodeNames.cF],
	marker: drawingShapes,
	symbol: drawingShapes,
	clipPath: drawingShapes,
	mask: drawingShapes,
};

const nodesAndChildren = Object.create(null);
Object.keys(folders).forEach((key) => {
	nodesAndChildren[key] = folders[key].reduce((a, b) => a.concat(b), []);
});

/**
 * SVG (c) Kraft
 */

const viewBoxValue = function (x, y, width, height, padding = 0) {
	const scale = 1.0;
	const d = (width / scale) - width;
	const X = (x - d) - padding;
	const Y = (y - d) - padding;
	const W = (width + d * 2) + padding * 2;
	const H = (height + d * 2) + padding * 2;
	return [X, Y, W, H].join(" ");
};

/**
 * this will attempt to match a set of viewbox parameters
 * undefined, if it cannot build a string
 */
function viewBox$1 () {
	const numbers = coordinates(...svg_flatten_arrays(arguments));
	if (numbers.length === 2) { numbers.unshift(0, 0); }
	return numbers.length === 4 ? viewBoxValue(...numbers) : undefined;
}

/**
 * SVG (c) Kraft
 */

const cdata = (textContent) => (new (SVGWindow()).DOMParser())
	.parseFromString("<root></root>", "text/xml")
	.createCDATASection(`${textContent}`);

/**
 * SVG (c) Kraft
 */

const removeChildren = (element) => {
	while (element.lastChild) {
		element.removeChild(element.lastChild);
	}
	return element;
};

const appendTo = (element, parent) => {
	if (parent != null) {
		parent.appendChild(element);
	}
	return element;
};

const setAttributes = (element, attrs) => Object.keys(attrs)
	.forEach(key => element.setAttribute(Case.toKebab(key), attrs[key]));

const moveChildren = (target, source) => {
	while (source.childNodes.length > 0) {
		const node = source.childNodes[0];
		source.removeChild(node);
		target.appendChild(node);
	}
	return target;
};

const clearSVG = (element) => {
	Array.from(element.attributes)
		.filter(a => a !== "xmlns")
		.forEach(attr => element.removeAttribute(attr.name));
	return removeChildren(element);
};

const assignSVG = (target, source) => {
	Array.from(source.attributes)
		.forEach(attr => target.setAttribute(attr.name, attr.value));
	return moveChildren(target, source);
};

// everything but clearSVG gets exported as the default and added
// as a method to many elements
var dom = {
	removeChildren,
	appendTo,
	setAttributes,
};

/**
 * SVG (c) Kraft
 */

/** parser error to check against */
// const pErr = (new window.DOMParser())
//  .parseFromString("INVALID", "text/xml")
//  .getElementsByTagName("parsererror")[0]
//  .namespaceURI;

const filterWhitespaceNodes = (node) => {
	if (node === null) { return node; }
	for (let i = node.childNodes.length - 1; i >= 0; i -= 1) {
		const child = node.childNodes[i];
		if (child.nodeType === 3 && child.data.match(/^\s*$/)) {
			node.removeChild(child);
		}
		if (child.nodeType === 1) {
			filterWhitespaceNodes(child);
		}
	}
	return node;
};

/**
 * parse and checkParseError go together.
 * checkParseError needs to be called to pull out the .documentElement
 */
const parse = string => (new (SVGWindow()).DOMParser())
	.parseFromString(string, "text/xml");

const checkParseError = xml => {
	const parserErrors = xml.getElementsByTagName("parsererror");
	if (parserErrors.length > 0) {
		throw new Error(parserErrors[0]);
	}
	return filterWhitespaceNodes(xml.documentElement);
};

// get an svg from a html 5 fetch returned in a promise
// will reject if there is no svg

// the SVG is returned as a promise
// try "filename.svg", "<svg>" text blob, already-parsed XML document tree
const async = function (input) {
	return new Promise((resolve, reject) => {
		if (typeof input === str_string || input instanceof String) {
			fetch(input)
				.then(response => response.text())
				.then(str => checkParseError(parse(str)))
				.then(xml => (xml.nodeName === str_svg
					? xml
					: xml.getElementsByTagName(str_svg)[0]))
				.then(svg => (svg == null
					? reject(new Error("valid XML found, but no SVG element"))
					: resolve(svg)))
				.catch(err => reject(err));
		} else if (input instanceof SVGWindow().Document) {
			return asyncDone(input);
		}
	});
};

const sync = function (input) {
	if (typeof input === str_string || input instanceof String) {
		try {
			return checkParseError(parse(input));
		} catch (error) {
			return error;
		}
	}
	if (input.childNodes != null) {
		return input;
	}
};

// check for an actual .svg ending?
// (input.slice(input.length - 4, input.length) === ".svg")
const isFilename = input => typeof input === str_string
	&& /^[\w,\s-]+\.[A-Za-z]{3}$/.test(input)
	&& input.length < 10000;

const Load = input => (isFilename(input)
	&& isBrowser
	&& typeof SVGWindow().fetch === str_function
	? async(input)
	: sync(input));

/**
* vkBeautify
*
* Version - 0.99.00.beta
* Copyright (c) 2012 Vadim Kiryukhin
* vkiryukhin @ gmail.com
* http://www.eslinstructor.net/vkbeautify/
*
* MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*/

function vkXML (text, step) {
  const ar = text.replace(/>\s{0,}</g, "><")
    .replace(/</g, "~::~<")
    .replace(/\s*xmlns\:/g, "~::~xmlns:")
    // .replace(/\s*xmlns\=/g,"~::~xmlns=")
    .split("~::~");
  const len = ar.length;
  let inComment = false;
  let deep = 0;
  let str = "";
  const space = (step != null && typeof step === "string" ? step : "\t");
  const shift = ["\n"];
  for (let si = 0; si < 100; si += 1) {
    shift.push(shift[si] + space);
  }
  for (let ix = 0; ix < len; ix += 1) {
    // start comment or <![CDATA[...]]> or <!DOCTYPE //
    if (ar[ix].search(/<!/) > -1) {
      str += shift[deep] + ar[ix];
      inComment = true;
      // end comment  or <![CDATA[...]]> //
      if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1
        || ar[ix].search(/!DOCTYPE/) > -1) {
        inComment = false;
      }
    } else if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
      // end comment  or <![CDATA[...]]> //
      str += ar[ix];
      inComment = false;
    } else if (/^<\w/.exec(ar[ix - 1]) && /^<\/\w/.exec(ar[ix])
      && /^<[\w:\-\.\,]+/.exec(ar[ix - 1])
      == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace("/", "")) {
      // <elm></elm> //
      str += ar[ix];
      if (!inComment) { deep -= 1; }
    } else if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) === -1
      // <elm> //
      && ar[ix].search(/\/>/) === -1) {
      str = !inComment ? str += shift[deep++] + ar[ix] : str += ar[ix];
    } else if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
      // <elm>...</elm> //
      str = !inComment ? str += shift[deep] + ar[ix] : str += ar[ix];
    } else if (ar[ix].search(/<\//) > -1) {
      // </elm> //
      str = !inComment ? str += shift[--deep] + ar[ix] : str += ar[ix];
    } else if (ar[ix].search(/\/>/) > -1) {
      // <elm/> //
      str = !inComment ? str += shift[deep] + ar[ix] : str += ar[ix];
    } else if (ar[ix].search(/<\?/) > -1) {
      // <? xml ... ?> //
      str += shift[deep] + ar[ix];
    } else if (ar[ix].search(/xmlns\:/) > -1 || ar[ix].search(/xmlns\=/) > -1) {
      // xmlns //
      str += shift[deep] + ar[ix];
    } else {
      str += ar[ix];
    }
  }
  return (str[0] === "\n") ? str.slice(1) : str;
}

/**
 * SVG (c) Kraft
 */

const SAVE_OPTIONS = () => ({
	download: false, // trigger a file download (browser only)
	output: str_string, // output type ("string", "svg") string or XML DOM object
	windowStyle: false, // include any external stylesheets present on the window object
	filename: "image.svg", // if "download" is true, the filename for the downloaded file
});

const getWindowStylesheets = function () {
	const css = [];
	if (SVGWindow().document.styleSheets) {
		for (let s = 0; s < SVGWindow().document.styleSheets.length; s += 1) {
			const sheet = SVGWindow().document.styleSheets[s];
			try {
				const rules = ("cssRules" in sheet) ? sheet.cssRules : sheet.rules;
				for (let r = 0; r < rules.length; r += 1) {
					const rule = rules[r];
					if ("cssText" in rule) {
						css.push(rule.cssText);
					} else {
						css.push(`${rule.selectorText} {\n${rule.style.cssText}\n}\n`);
					}
				}
			} catch (error) {
				console.warn(error);
			}
		}
	}
	return css.join("\n");
};

const downloadInBrowser = function (filename, contentsAsString) {
	const blob = new (SVGWindow()).Blob([contentsAsString], { type: "text/plain" });
	const a = SVGWindow().document.createElement("a");
	a.setAttribute("href", SVGWindow().URL.createObjectURL(blob));
	a.setAttribute("download", filename);
	SVGWindow().document.body.appendChild(a);
	a.click();
	SVGWindow().document.body.removeChild(a);
};

const save = function (svg, options) {
	options = Object.assign(SAVE_OPTIONS(), options);
	// if this SVG was created inside the browser, it inherited all the <link>
	// stylesheets present on the window, this allows them to be included.
	// default: not included.
	if (options.windowStyle) {
		const styleContainer = SVGWindow().document.createElementNS(NS, str_style);
		styleContainer.setAttribute("type", "text/css");
		styleContainer.innerHTML = getWindowStylesheets();
		svg.appendChild(styleContainer);
	}
	// convert the SVG to a string and format it with good indentation
	const source = (new (SVGWindow()).XMLSerializer()).serializeToString(svg);
	const formattedString = vkXML(source);
	//
	if (options.download && isBrowser && !isNode) {
		downloadInBrowser(options.filename, formattedString);
	}
	return (options.output === str_svg ? svg : formattedString);
};

/**
 * SVG (c) Kraft
 */

const setViewBox = (element, ...args) => {
	// are they giving us pre-formatted string, or a list of numbers
	const viewBox = args.length === 1 && typeof args[0] === str_string
		? args[0]
		: viewBox$1(...args);
	if (viewBox) {
		element.setAttribute(str_viewBox, viewBox);
	}
	return element;
};

const getViewBox = function (element) {
	const vb = element.getAttribute(str_viewBox);
	return (vb == null
		? undefined
		: vb.split(" ").map(n => parseFloat(n)));
};

const convertToViewBox = function (svg, x, y) {
	const pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	// todo: i thought this threw an error once. something about getScreenCTM.
	const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
	return [svgPoint.x, svgPoint.y];
};

/*
export const translateViewBox = function (svg, dx, dy) {
	const viewBox = getViewBox(svg);
	if (viewBox == null) {
		setDefaultViewBox(svg);
	}
	viewBox[0] += dx;
	viewBox[1] += dy;
	svg.setAttributeNS(null, vB, viewBox.join(" "));
};

export const scaleViewBox = function (svg, scale, origin_x = 0, origin_y = 0) {
	if (Math.abs(scale) < 1e-8) { scale = 0.01; }
	const matrix = svg.createSVGMatrix()
		.translate(origin_x, origin_y)
		.scale(1 / scale)
		.translate(-origin_x, -origin_y);
	const viewBox = getViewBox(svg);
	if (viewBox == null) {
		setDefaultViewBox(svg);
	}
	const top_left = svg.createSVGPoint();
	const bot_right = svg.createSVGPoint();
	[top_left.x, top_left.y] = viewBox;
	bot_right.x = viewBox[0] + viewBox[2];
	bot_right.y = viewBox[1] + viewBox[3];
	const new_top_left = top_left.matrixTransform(matrix);
	const new_bot_right = bot_right.matrixTransform(matrix);
	setViewBox(svg,
		new_top_left.x,
		new_top_left.y,
		new_bot_right.x - new_top_left.x,
		new_bot_right.y - new_top_left.y);
};

*/

var viewBox = /*#__PURE__*/Object.freeze({
	__proto__: null,
	setViewBox: setViewBox,
	getViewBox: getViewBox,
	convertToViewBox: convertToViewBox
});

/**
 * SVG (c) Kraft
 */

// check if the loader is running synchronously or asynchronously
const loadSVG = (target, data) => {
	const result = Load(data);
	if (result == null) { return; }
	return (typeof result.then === str_function)
		? result.then(svg => assignSVG(target, svg))
		: assignSVG(target, result);
};

const getFrame = function (element) {
	const viewBox = getViewBox(element);
	if (viewBox !== undefined) {
		return viewBox;
	}
	if (typeof element.getBoundingClientRect === str_function) {
		const rr = element.getBoundingClientRect();
		return [rr.x, rr.y, rr.width, rr.height];
	}
	// return Array(4).fill(undefined);
	return [];
};

const setPadding = function (element, padding) {
	const viewBox = getViewBox(element);
	if (viewBox !== undefined) {
		setViewBox(element, ...[-padding, -padding, padding * 2, padding * 2]
			.map((nudge, i) => viewBox[i] + nudge));
	}
	return element;
};

const bgClass = "svg-background-rectangle";

// i prevented circular dependency by passing a pointer to Constructor through 'this'
// every function is bound
const background = function (element, color) {
	let backRect = Array.from(element.childNodes)
		.filter(child => child.getAttribute(str_class) === bgClass)
		.shift();
	if (backRect == null) {
		backRect = this.Constructor("rect", null, ...getFrame(element));
		backRect.setAttribute(str_class, bgClass);
		backRect.setAttribute(str_stroke, str_none);
		element.insertBefore(backRect, element.firstChild);
	}
	backRect.setAttribute(str_fill, color);
	return element;
};

const findStyleSheet = function (element) {
	const styles = element.getElementsByTagName(str_style);
	return styles.length === 0 ? undefined : styles[0];
};

const stylesheet = function (element, textContent) {
	let styleSection = findStyleSheet(element);
	if (styleSection == null) {
		styleSection = this.Constructor(str_style);
		element.insertBefore(styleSection, element.firstChild);
	}
	styleSection.textContent = "";
	styleSection.appendChild(cdata(textContent));
	return styleSection;
};

// these will end up as methods on the <svg> nodes
var methods$1 = {
	clear: clearSVG,
	size: setViewBox,
	setViewBox,
	getViewBox,
	padding: setPadding,
	background,
	getWidth: el => getFrame(el)[2],
	getHeight: el => getFrame(el)[3],
	stylesheet: function (el, text) { return stylesheet.call(this, el, text); },
	load: loadSVG,
	save: save,
};

// svg.load = function (element, data, callback) {
//   return Load(data, (svg, error) => {
//     if (svg != null) { replaceSVG(element, svg); }
//     if (callback != null) { callback(element, error); }
//   });
// };

/**
 * SVG (c) Kraft
 */
const libraries = {
	math: {
		vector: (...args) => [...args],
	},
};

/**
 * SVG (c) Kraft
 */

const categories = {
	move: ["mousemove", "touchmove"],
	press: ["mousedown", "touchstart"], // "mouseover",
	release: ["mouseup", "touchend"],
	leave: ["mouseleave", "touchcancel"],
};

const handlerNames = Object.values(categories)
	.reduce((a, b) => a.concat(b), []);

const off = (element, handlers) => handlerNames.forEach((handlerName) => {
	handlers[handlerName].forEach(func => element.removeEventListener(handlerName, func));
	handlers[handlerName] = [];
});

const defineGetter = (obj, prop, value) => Object.defineProperty(obj, prop, {
	get: () => value,
	enumerable: true,
	configurable: true,
});

const assignPress = (e, startPoint) => {
	["pressX", "pressY"].filter(prop => !Object.prototype.hasOwnProperty.call(e, prop))
		.forEach((prop, i) => defineGetter(e, prop, startPoint[i]));
	if (!Object.prototype.hasOwnProperty.call(e, "press")) {
		defineGetter(e, "press", libraries.math.vector(...startPoint));
	}
};

const TouchEvents = function (element) {
	// todo, more pointers for multiple screen touches

	let startPoint = [];
	// hold onto all handlers. to be able to turn them off
	const handlers = [];
	Object.keys(categories).forEach((key) => {
		categories[key].forEach((handler) => {
			handlers[handler] = [];
		});
	});

	const removeHandler = category => categories[category]
		.forEach(handlerName => handlers[handlerName]
			.forEach(func => element.removeEventListener(handlerName, func)));

	// add more properties depending on the type of handler
	const categoryUpdate = {
		press: (e, viewPoint) => {
			startPoint = viewPoint;
			assignPress(e, startPoint);
		},
		release: () => {},
		leave: () => {},
		move: (e, viewPoint) => {
			if (e.buttons > 0 && startPoint[0] === undefined) {
				startPoint = viewPoint;
			} else if (e.buttons === 0 && startPoint[0] !== undefined) {
				startPoint = [];
			}
			assignPress(e, startPoint);
		},
	};

	// assign handlers for onMove, onPress, onRelease
	Object.keys(categories).forEach((category) => {
		const propName = `on${Case.capitalized(category)}`;
		Object.defineProperty(element, propName, {
			set: (handler) => {
				if (handler == null) {
					removeHandler(category);
					return;
				}
				categories[category].forEach((handlerName) => {
					const handlerFunc = (e) => {
						// const pointer = (e.touches != null && e.touches.length
						const pointer = (e.touches != null
							? e.touches[0]
							: e);
						// onRelease events don't have a pointer
						if (pointer !== undefined) {
							const viewPoint = convertToViewBox(element, pointer.clientX, pointer.clientY)
								.map(n => (Number.isNaN(n) ? undefined : n)); // e.target
							["x", "y"]
								.filter(prop => !Object.prototype.hasOwnProperty.call(e, prop))
								.forEach((prop, i) => defineGetter(e, prop, viewPoint[i]));
							if (!Object.prototype.hasOwnProperty.call(e, "position")) {
								defineGetter(e, "position", libraries.math.vector(...viewPoint));
							}
							categoryUpdate[category](e, viewPoint);
						}
						handler(e);
					};
					// node.js doesn't have addEventListener
					if (element.addEventListener) {
						handlers[handlerName].push(handlerFunc);
						element.addEventListener(handlerName, handlerFunc);
					}
				});
			},
			enumerable: true,
		});
	});

	Object.defineProperty(element, "off", { value: () => off(element, handlers) });
};

/**
 * SVG (c) Kraft
 */
var UUID = () => Math.random()
	.toString(36)
	.replace(/[^a-z]+/g, "")
	.concat("aaaaa")
	.substr(0, 5);

/**
 * SVG (c) Kraft
 */

const Animation = function (element) {
	// let fps; // todo: bring this back

	let start;
	const handlers = {};
	let frame = 0;
	let requestId;

	const removeHandlers = () => {
		if (SVGWindow().cancelAnimationFrame) {
			SVGWindow().cancelAnimationFrame(requestId);
		}
		Object.keys(handlers)
			.forEach(uuid => delete handlers[uuid]);
		start = undefined;
		frame = 0;
	};

	Object.defineProperty(element, "play", {
		set: (handler) => {
			removeHandlers();
			if (handler == null) { return; }
			const uuid = UUID();
			const handlerFunc = (e) => {
				if (!start) {
					start = e;
					frame = 0;
				}
				const progress = (e - start) * 0.001;
				handler({ time: progress, frame });
				// prepare next frame
				frame += 1;
				if (handlers[uuid]) {
					requestId = SVGWindow().requestAnimationFrame(handlers[uuid]);
				}
			};
			handlers[uuid] = handlerFunc;
			// node.js doesn't have requestAnimationFrame
			// we don't need to duplicate this if statement above, because it won't
			// ever be called if this one is prevented.
			if (SVGWindow().requestAnimationFrame) {
				requestId = SVGWindow().requestAnimationFrame(handlers[uuid]);
			}
		},
		enumerable: true,
	});
	Object.defineProperty(element, "stop", { value: removeHandlers, enumerable: true });
};

/**
 * SVG (c) Kraft
 */

const removeFromParent = svg => (svg && svg.parentNode
	? svg.parentNode.removeChild(svg)
	: undefined);

const possiblePositionAttributes = [["cx", "cy"], ["x", "y"]];

const controlPoint = function (parent, options = {}) {
	// private properties. unless exposed
	const position = [0, 0]; // initialize below
	const cp = {
		selected: false,
		svg: undefined,
		// to be overwritten
		updatePosition: input => input,
	};

	const updateSVG = () => {
		if (!cp.svg) { return; }
		if (!cp.svg.parentNode) {
			parent.appendChild(cp.svg);
		}
		possiblePositionAttributes
			.filter(coords => cp.svg[coords[0]] != null)
			.forEach(coords => coords.forEach((attr, i) => {
				cp.svg.setAttribute(attr, position[i]);
			}));
	};

	const proxy = new Proxy(position, {
		set: (target, property, value) => {
			target[property] = value;
			updateSVG();
			return true;
		},
	});

	const setPosition = function (...args) {
		coordinates(...svg_flatten_arrays(...args))
			.forEach((n, i) => { position[i] = n; });
		updateSVG();
		// alert delegate
		if (typeof position.delegate === str_function) {
			position.delegate.apply(position.pointsContainer, [proxy, position.pointsContainer]);
		}
	};

	// set default position
	// setPosition(options.position);

	position.delegate = undefined; // to be set
	position.setPosition = setPosition;
	position.onMouseMove = mouse => (cp.selected
		? setPosition(cp.updatePosition(mouse))
		: undefined);
	position.onMouseUp = () => { cp.selected = false; };
	position.distance = mouse => Math.sqrt(svg_distanceSq2(mouse, position));

	["x", "y"].forEach((prop, i) => Object.defineProperty(position, prop, {
		get: () => position[i],
		set: (v) => { position[i] = v; }
	}));
	// would be nice if "svg" also called removeFromParent(); on set()
	[str_svg, "updatePosition", "selected"].forEach(key => Object
		.defineProperty(position, key, {
			get: () => cp[key],
			set: (v) => { cp[key] = v; },
		}));
	Object.defineProperty(position, "remove", {
		value: () => {
			// todo, do we need to do any other unwinding?
			removeFromParent(cp.svg);
			position.delegate = undefined;
		},
	});

	return proxy;
};

const controls = function (svg, number, options) {
	let selected;
	let delegate;
	const points = Array.from(Array(number))
		.map(() => controlPoint(svg, options));

	// hook up the delegate callback for the on change event
	const protocol = point => (typeof delegate === str_function
		? delegate.call(points, point, selected, points)
		: undefined);

	points.forEach((p) => {
		p.delegate = protocol;
		p.pointsContainer = points;
	});

	const mousePressedHandler = function (mouse) {
		if (!(points.length > 0)) { return; }
		selected = points
			.map((p, i) => ({ i, d: svg_distanceSq2(p, [mouse.x, mouse.y]) }))
			.sort((a, b) => a.d - b.d)
			.shift()
			.i;
		points[selected].selected = true;
	};
	const mouseMovedHandler = function (mouse) {
		points.forEach(p => p.onMouseMove(mouse));
	};
	const mouseReleasedHandler = function () {
		points.forEach(p => p.onMouseUp());
		selected = undefined;
	};

	svg.onPress = mousePressedHandler;
	svg.onMove = mouseMovedHandler;
	svg.onRelease = mouseReleasedHandler;
	// svg.addEventListener("touchcancel", touchUpHandler, false);

	Object.defineProperty(points, "selectedIndex", { get: () => selected });
	Object.defineProperty(points, "selected", { get: () => points[selected] });
	Object.defineProperty(points, "add", {
		value: (opt) => {
			points.push(controlPoint(svg, opt));
		},
	});
	points.removeAll = () => {
		while (points.length > 0) {
			points.pop().remove();
		}
	};

	const functionalMethods = {
		onChange: (func, runOnceAtStart) => {
			delegate = func;
			// we need a point, give us the last one in the array
			if (runOnceAtStart === true) {
				const index = points.length - 1;
				func.call(points, points[index], index, points);
			}
		},
		position: func => points.forEach((p, i) => p.setPosition(func.call(points, p, i, points))),
		svg: func => points.forEach((p, i) => { p.svg = func.call(points, p, i, points); }),
	};
	Object.keys(functionalMethods).forEach((key) => {
		points[key] = function () {
			if (typeof arguments[0] === str_function) {
				functionalMethods[key](...arguments);
			}
			return points;
		};
	});
	points.parent = function (parent) {
		if (parent != null && parent.appendChild != null) {
			points.forEach((p) => { parent.appendChild(p.svg); });
		}
		return points;
	};

	return points;
};

const applyControlsToSVG = (svg) => {
	svg.controls = (...args) => controls.call(svg, svg, ...args);
};

/**
 * SVG (c) Kraft
 */

// const findWindowBooleanParam = (...params) => params
//   .filter(arg => typeof arg === S.str_object)
//   .filter(o => typeof o.window === S.str_boolean)
//   .reduce((a, b) => a.window || b.window, false);

var svgDef = {
	svg: {
		args: (...args) => [viewBox$1(coordinates(...args))].filter(a => a != null),
		methods: methods$1,
		init: (element, ...args) => {
			args.filter(a => typeof a === str_string)
				.forEach(string => loadSVG(element, string));
			args.filter(a => a != null)
				// .filter(arg => arg instanceof ElementConstructor)
				.filter(el => typeof el.appendChild === str_function)
				.forEach(parent => parent.appendChild(element));
			TouchEvents(element);
			Animation(element);
			applyControlsToSVG(element);
		},
	},
};

/**
 * SVG (c) Kraft
 */

const loadGroup = (group, ...sources) => {
	const elements = sources.map(source => sync(source))
		.filter(a => a !== undefined);
	elements.filter(element => element.tagName === str_svg)
		.forEach(element => moveChildren(group, element));
	elements.filter(element => element.tagName !== str_svg)
		.forEach(element => group.appendChild(element));
	return group;
};

var gDef = {
	g: {
		init: loadGroup,
		methods: {
			load: loadGroup,
		},
	},
};

/**
 * SVG (c) Kraft
 */
// this object will be completed with all remaining nodeName keys
// with an empty array value
var attributes = Object.assign(Object.create(null), {
	// the order of indices matter
	svg: [str_viewBox],
	line: ["x1", "y1", "x2", "y2"],
	rect: ["x", "y", "width", "height"],
	circle: ["cx", "cy", "r"],
	ellipse: ["cx", "cy", "rx", "ry"],
	polygon: [str_points],
	polyline: [str_points],
	path: ["d"],
	text: ["x", "y"],
	mask: [str_id],
	symbol: [str_id],
	clipPath: [
		str_id,
		"clip-rule", // use with clipPath
	],
	marker: [
		str_id,
		"markerHeight",
		"markerUnits",
		"markerWidth",
		"orient",
		"refX",
		"refY",
	],
	linearGradient: [
		"x1", // <linearGradient>
		"x2", // <linearGradient>
		"y1", // <linearGradient>
		"y2", // <linearGradient>
	],
	radialGradient: [
		"cx", // <radialGradient>
		"cy", // <radialGradient>
		"r", // <radialGradient>
		"fr", // <radialGradient>
		"fx", // <radialGradient>
		"fy", // <radialGradient>
	],
	stop: [
		"offset",
		"stop-color",
		"stop-opacity",
	],
	pattern: [
		"patternContentUnits", // only <pattern>
		"patternTransform", // only <pattern>
		"patternUnits", // only <pattern>
	],
});

/**
 * SVG (c) Kraft
 */

const setRadius = (el, r) => {
	el.setAttribute(attributes.circle[2], r);
	return el;
};

const setOrigin = (el, a, b) => {
	[...coordinates(...svg_flatten_arrays(a, b)).slice(0, 2)]
		.forEach((value, i) => el.setAttribute(attributes.circle[i], value));
	return el;
};

const fromPoints = (a, b, c, d) => [a, b, svg_distance2([a, b], [c, d])];
/**
 * @name circle
 * @memberof svg
 * @description Draw an SVG Circle element.
 * @param {number} radius the radius of the circle
 * @param {...number|number[]} center the center of the circle
 * @returns {Element} an SVG node element
 * @linkcode SVG ./src/nodes/spec/circle.js 28
 */
var circleDef = {
	circle: {
		args: (a, b, c, d) => {
			const coords = coordinates(...svg_flatten_arrays(a, b, c, d));
			// console.log("SVG circle coords", coords);
			switch (coords.length) {
			case 0: case 1: return [, , ...coords];
			case 2: case 3: return coords;
			// case 4
			default: return fromPoints(...coords);
			}
			// return coordinates(...flatten(a, b, c)).slice(0, 3);
		},
		methods: {
			radius: setRadius,
			setRadius,
			origin: setOrigin,
			setOrigin,
			center: setOrigin,
			setCenter: setOrigin,
			position: setOrigin,
			setPosition: setOrigin,
		},
	},
};

/**
 * SVG (c) Kraft
 */

// const setRadii = (el, rx, ry) => [,,rx,ry]
//   .forEach((value, i) => el.setAttribute(attributes.ellipse[i], value));
const setRadii = (el, rx, ry) => {
	[, , rx, ry].forEach((value, i) => el.setAttribute(attributes.ellipse[i], value));
	return el;
};

const setCenter = (el, a, b) => {
	[...coordinates(...svg_flatten_arrays(a, b)).slice(0, 2)]
		.forEach((value, i) => el.setAttribute(attributes.ellipse[i], value));
	return el;
};

var ellipseDef = {
	ellipse: {
		args: (a, b, c, d) => {
			const coords = coordinates(...svg_flatten_arrays(a, b, c, d)).slice(0, 4);
			switch (coords.length) {
			case 0: case 1: case 2: return [, , ...coords];
			default: return coords;
			}
		},
		methods: {
			radius: setRadii,
			setRadius: setRadii,
			origin: setCenter,
			setOrigin: setCenter,
			center: setCenter,
			setCenter,
			position: setCenter,
			setPosition: setCenter,
		},
	},
};

/**
 * SVG (c) Kraft
 */

const Args$1 = (...args) => coordinates(...svg_semi_flatten_arrays(...args)).slice(0, 4);

const setPoints$1 = (element, ...args) => {
	Args$1(...args).forEach((value, i) => element.setAttribute(attributes.line[i], value));
	return element;
};
/**
 * @name line
 * @description SVG Line element
 * @memberof SVG
 * @linkcode SVG ./src/nodes/spec/line.js 18
 */
var lineDef = {
	line: {
		args: Args$1,
		methods: {
			setPoints: setPoints$1,
		},
	},
};

/**
 * SVG (c) Kraft
 */

const markerRegEx = /[MmLlSsQqLlHhVvCcSsQqTtAaZz]/g;
const digitRegEx = /-?[0-9]*\.?\d+/g;

const pathCommands = {
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

// const expectedArguments = {
//   m: 2,
//   l: 2,
//   v: 1,
//   h: 1,
//   a: 7, // or 14
//   c: 6,
//   s: 4,
//   q: 4,
//   t: 2,
//   z: 0,
// };

// make capitalized copies of each command
Object.keys(pathCommands).forEach((key) => {
	const s = pathCommands[key];
	pathCommands[key.toUpperCase()] = s.charAt(0).toUpperCase() + s.slice(1);
	// expectedArguments[key.toUpperCase()] = expectedArguments[key];
});

// results in an array of objects [
//  { command: "M", values: [50, 50], en: "Move" }
//  { command: "l", values: [45, 95], en: "line" }
// ]
const parsePathCommands = function (str) {
	// Ulric Wilfred
	const results = [];
	let match;
	while ((match = markerRegEx.exec(str)) !== null) {
		results.push(match);
	}
	return results.map(m => ({
		command: str[m.index],
		index: m.index,
	}))
		.reduceRight((all, cur) => {
			const chunk = str.substring(cur.index, all.length ? all[all.length - 1].index : str.length);
			return all.concat([{
				command: cur.command,
				index: cur.index,
				chunk: (chunk.length > 0) ? chunk.substr(1, chunk.length - 1) : chunk,
			}]);
		}, [])
		.reverse()
		.map((el) => {
			const values = el.chunk.match(digitRegEx);
			el.en = pathCommands[el.command];
			el.values = values ? values.map(parseFloat) : [];
			delete el.chunk;
			return el;
		});
};

/**
 * @param {SVGElement} one svg element, intended to be a <path> element
 * @returns {string} the "d" attribute, or if unset, returns an empty string "".
 */
const getD = (el) => {
	const attr = el.getAttribute("d");
	return (attr == null) ? "" : attr;
};

const clear = element => {
	element.removeAttribute("d");
	return element;
};

// todo: would be great if for arguments > 2 it alternated space and comma
const appendPathCommand = (el, command, ...args) => {
	el.setAttribute("d", `${getD(el)}${command}${svg_flatten_arrays(...args).join(" ")}`);
	return el;
};

// break out the path commands into an array of descriptive objects
const getCommands = element => parsePathCommands(getD(element));

// const setters = {
//   string: setPathString,
//   object: setPathCommands,
// };
// const appenders = {
//   string: appendPathString,
//   object: appendPathCommands,
// };

// depending on the user's argument, different setters will get called
// const noClearSet = (element, ...args) => {
//   if (args.length === 1) {
//     const typ = typeof args[0];
//     if (setters[typ]) {
//       setters[typ](element, args[0]);
//     }
//   }
// };

// const clearAndSet = (element, ...args) => {
//   if (args.length === 1) {
//     const typ = typeof args[0];
//     if (setters[typ]) {
//       clear(element);
//       setters[typ](element, args[0]);
//     }
//   }
// };

const path_methods = {
	addCommand: appendPathCommand,
	appendCommand: appendPathCommand,
	clear,
	getCommands: getCommands,
	get: getCommands,
	getD: el => el.getAttribute("d"),
	// set: clearAndSet,
	// add: noClearSet,
};

Object.keys(pathCommands).forEach((key) => {
	path_methods[pathCommands[key]] = (el, ...args) => appendPathCommand(el, key, ...args);
});

var pathDef = {
	path: {
		methods: path_methods,
	},
};

/**
 * SVG (c) Kraft
 */

const setRectSize = (el, rx, ry) => {
	[, , rx, ry]
		.forEach((value, i) => el.setAttribute(attributes.rect[i], value));
	return el;
};

const setRectOrigin = (el, a, b) => {
	[...coordinates(...svg_flatten_arrays(a, b)).slice(0, 2)]
		.forEach((value, i) => el.setAttribute(attributes.rect[i], value));
	return el;
};

// can handle negative widths and heights
const fixNegatives = function (arr) {
	[0, 1].forEach(i => {
		if (arr[2 + i] < 0) {
			if (arr[0 + i] === undefined) { arr[0 + i] = 0; }
			arr[0 + i] += arr[2 + i];
			arr[2 + i] = -arr[2 + i];
		}
	});
	return arr;
};
/**
 * @name rect
 * @memberof svg
 * @description Draw an SVG Rect element.
 * @param {number} x the x coordinate of the corner
 * @param {number} y the y coordinate of the corner
 * @param {number} width the length along the x dimension
 * @param {number} height the length along the y dimension
 * @returns {Element} an SVG node element
 * @linkcode SVG ./src/nodes/spec/rect.js 40
 */
var rectDef = {
	rect: {
		args: (a, b, c, d) => {
			const coords = coordinates(...svg_flatten_arrays(a, b, c, d)).slice(0, 4);
			switch (coords.length) {
			case 0: case 1: case 2: case 3: return fixNegatives([, , ...coords]);
			default: return fixNegatives(coords);
			}
		},
		methods: {
			origin: setRectOrigin,
			setOrigin: setRectOrigin,
			center: setRectOrigin,
			setCenter: setRectOrigin,
			size: setRectSize,
			setSize: setRectSize,
		},
	},
};

/**
 * SVG (c) Kraft
 */

var styleDef = {
	style: {
		init: (el, text) => {
			el.textContent = "";
			el.appendChild(cdata(text));
		},
		methods: {
			setTextContent: (el, text) => {
				el.textContent = "";
				el.appendChild(cdata(text));
				return el;
			},
		},
	},
};

/**
 * SVG (c) Kraft
 */
/**
 * @description SVG text element
 * @memberof SVG
 * @linkcode SVG ./src/nodes/spec/text.js 11
 */
var textDef = {
	text: {
		// assuming people will at most supply coordinate (x,y,z) and text
		args: (a, b, c) => coordinates(...svg_flatten_arrays(a, b, c)).slice(0, 2),
		init: (element, a, b, c, d) => {
			const text = [a, b, c, d].filter(el => typeof el === str_string).shift();
			if (text) {
				element.appendChild(SVGWindow().document.createTextNode(text));
				// it seems like this is excessive and will never happen
				// if (element.firstChild) {
				//   element.firstChild.nodeValue = text;
				// } else {
				//   element.appendChild(window().document.createTextNode(text));
				// }
			}
		},
	},
};

/**
 * SVG (c) Kraft
 */

const makeIDString = function () {
	return Array.from(arguments)
		.filter(a => typeof a === str_string || a instanceof String)
		.shift() || UUID();
};

const maskArgs = (...args) => [makeIDString(...args)];

var maskTypes = {
	mask: { args: maskArgs },
	clipPath: { args: maskArgs },
	symbol: { args: maskArgs },
	marker: {
		args: maskArgs,
		methods: {
			size: setViewBox,
			setViewBox: setViewBox,
		},
	},
};

/**
 * SVG (c) Kraft
 */

const getPoints = (el) => {
	const attr = el.getAttribute(str_points);
	return (attr == null) ? "" : attr;
};

const polyString = function () {
	return Array
		.from(Array(Math.floor(arguments.length / 2)))
		.map((_, i) => `${arguments[i * 2 + 0]},${arguments[i * 2 + 1]}`)
		.join(" ");
};

const stringifyArgs = (...args) => [
	polyString(...coordinates(...svg_semi_flatten_arrays(...args))),
];

const setPoints = (element, ...args) => {
	element.setAttribute(str_points, stringifyArgs(...args)[0]);
	return element;
};

const addPoint = (element, ...args) => {
	element.setAttribute(str_points, [getPoints(element), stringifyArgs(...args)[0]]
		.filter(a => a !== "")
		.join(" "));
	return element;
};

// this should be improved
// right now the special case is if there is only 1 argument and it's a string
// it should be able to take strings or numbers at any point,
// converting the strings to coordinates
const Args = function (...args) {
	return args.length === 1 && typeof args[0] === str_string
		? [args[0]]
		: stringifyArgs(...args);
};

var polyDefs = {
	polyline: {
		args: Args,
		methods: {
			setPoints,
			addPoint,
		},
	},
	polygon: {
		args: Args,
		methods: {
			setPoints,
			addPoint,
		},
	},
};

/**
 * SVG (c) Kraft
 */
/**
 * in each of these instances, arguments maps the arguments to attributes
 * as the attributes are listed in the "attributes" folder.
 *
 * arguments: function. this should convert the array of arguments into
 * an array of (processed) arguments. 1:1. arguments into arguments.
 * make sure it is returning an array.
 *
 */
var Spec = Object.assign(
	{},
	svgDef,
	gDef,
	circleDef,
	ellipseDef,
	lineDef,
	pathDef,
	rectDef,
	styleDef,
	textDef,
	// multiple
	maskTypes,
	polyDefs,
);

/**
 * SVG (c) Kraft
 */
var ManyElements = {
	presentation: [
		"color",
		"color-interpolation",
		"cursor", // mouse cursor
		"direction", // rtl right to left
		"display", // none, inherit
		"fill",
		"fill-opacity",
		"fill-rule",
		"font-family",
		"font-size",
		"font-size-adjust",
		"font-stretch",
		"font-style",
		"font-variant",
		"font-weight",
		"image-rendering", // provides a hint to the browser about how to make speed vs. quality tradeoffs as it performs image processing
		"letter-spacing",
		"opacity",
		"overflow",
		"paint-order",
		"pointer-events",
		"preserveAspectRatio",
		"shape-rendering",
		"stroke",
		"stroke-dasharray",
		"stroke-dashoffset",
		"stroke-linecap",
		"stroke-linejoin",
		"stroke-miterlimit",
		"stroke-opacity",
		"stroke-width",
		"tabindex",
		"transform-origin", // added by Robby
		"user-select", // added by Robby
		"vector-effect",
		"visibility",
	],
	animation: [
		"accumulate", // controls whether or not an animation is cumulative
		"additive", // controls whether or not an animation is additive
		"attributeName", // used by: <animate>, <animateColor>, <animateTransform>, and <set>
		"begin",
		"by",
		"calcMode",
		"dur",
		"end",
		"from",
		"keyPoints", // used by: <animate>, <animateColor>, <animateMotion>, <animateTransform>, and <set>
		"keySplines",
		"keyTimes",
		"max",
		"min",
		"repeatCount",
		"repeatDur",
		"restart",
		"to", // final value of the attribute that will be modified during the animation
		"values",
	],
	effects: [
		"azimuth", // only used by: <feDistantLight>
		"baseFrequency",
		"bias",
		"color-interpolation-filters",
		"diffuseConstant",
		"divisor",
		"edgeMode",
		"elevation",
		"exponent",
		"filter",
		"filterRes",
		"filterUnits",
		"flood-color",
		"flood-opacity",
		"in", // identifies input for the given filter primitive.
		"in2", // identifies the second input for the given filter primitive.
		"intercept", // defines the intercept of the linear function of color component transfers
		"k1", // only used by: <feComposite>
		"k2", // only used by: <feComposite>
		"k3", // only used by: <feComposite>
		"k4", // only used by: <feComposite>
		"kernelMatrix", // only used by: <feConvolveMatrix>
		"lighting-color",
		"limitingConeAngle",
		"mode",
		"numOctaves",
		"operator",
		"order",
		"pointsAtX",
		"pointsAtY",
		"pointsAtZ",
		"preserveAlpha",
		"primitiveUnits",
		"radius",
		"result",
		"seed",
		"specularConstant",
		"specularExponent",
		"stdDeviation",
		"stitchTiles",
		"surfaceScale",
		"targetX", // only used in: <feConvolveMatrix>
		"targetY", // only used in: <feConvolveMatrix>
		"type", // many different uses, in animate, and <style> <script>
		"xChannelSelector", // <feDisplacementMap>
		"yChannelSelector",
	],
	text: [
		// "x",   // <text>
		// "y",   // <text>
		"dx", // <text>
		"dy", // <text>
		"alignment-baseline", // specifies how a text alignts vertically
		"baseline-shift",
		"dominant-baseline",
		"lengthAdjust", // <text>
		"method", // for <textPath> only
		"overline-position",
		"overline-thickness",
		"rotate", // rotates each individual glyph
		"spacing",
		"startOffset", // <textPath>
		"strikethrough-position",
		"strikethrough-thickness",
		"text-anchor",
		"text-decoration",
		"text-rendering",
		"textLength", // <text>
		"underline-position",
		"underline-thickness",
		"word-spacing",
		"writing-mode",
	],
	gradient: [
		"gradientTransform", // linear/radial gradient
		"gradientUnits", // linear/radial gradient
		"spreadMethod", // linear/radial gradient
	],
};

/**
 * SVG (c) Kraft
 */

Object.values(NodeNames)
	.reduce((a, b) => a.concat(b), [])
	.filter(nodeName => attributes[nodeName] === undefined)
	.forEach(nodeName => { attributes[nodeName] = []; });

[[[str_svg, "defs", "g"].concat(NodeNames.v, NodeNames.t), ManyElements.presentation],
	[["filter"], ManyElements.effects],
	[NodeNames.cT.concat("text"), ManyElements.text], // todo: should we include "svg" here?
	[NodeNames.cF, ManyElements.effects],
	[NodeNames.cG, ManyElements.gradient],
].forEach(pair => pair[0].forEach(key => {
	attributes[key] = attributes[key].concat(pair[1]);
}));

/**
 * SVG (c) Kraft
 */

const getClassList = (element) => {
	if (element == null) { return []; }
	const currentClass = element.getAttribute(str_class);
	return (currentClass == null
		? []
		: currentClass.split(" ").filter(s => s !== ""));
};

var classMethods = {
	addClass: (element, newClass) => {
		const classes = getClassList(element)
			.filter(c => c !== newClass);
		classes.push(newClass);
		element.setAttributeNS(null, str_class, classes.join(" "));
	},
	removeClass: (element, removedClass) => {
		const classes = getClassList(element)
			.filter(c => c !== removedClass);
		element.setAttributeNS(null, str_class, classes.join(" "));
	},
	setClass: (element, className) => {
		element.setAttributeNS(null, str_class, className);
	},
	setId: (element, idName) => {
		element.setAttributeNS(null, str_id, idName);
	},
};

/**
 * SVG (c) Kraft
 */

const getAttr = (element) => {
	const t = element.getAttribute(str_transform);
	return (t == null || t === "") ? undefined : t;
};

const TransformMethods = {
	clearTransform: (el) => { el.removeAttribute(str_transform); return el; },
};

["translate", "rotate", "scale", "matrix"].forEach(key => {
	TransformMethods[key] = (element, ...args) => element.setAttribute(
		str_transform,
		[getAttr(element), `${key}(${args.join(" ")})`]
			.filter(a => a !== undefined)
			.join(" "),
	);
});

/**
 * SVG (c) Kraft
 */

// for the clip-path and mask values. looks for the ID as a "url(#id-name)" string
const findIdURL = function (arg) {
	if (arg == null) { return ""; }
	if (typeof arg === str_string) {
		return arg.slice(0, 3) === "url"
			? arg
			: `url(#${arg})`;
	}
	if (arg.getAttribute != null) {
		const idString = arg.getAttribute(str_id);
		return `url(#${idString})`;
	}
	return "";
};

const methods = {};

// these do not represent the nodes that these methods are applied to
// every node gets these attribute-setting method (pointing to a mask)
["clip-path",
	"mask",
	"symbol",
	"marker-end",
	"marker-mid",
	"marker-start",
].forEach(attr => {
	methods[Case.toCamel(attr)] = (element, parent) => element.setAttribute(attr, findIdURL(parent));
});

/**
 * SVG (c) Kraft
 */

const Nodes = {};

// assuming custom nodes are drawing-type, make them known to the library
NodeNames.v.push(...Object.keys(nodes));
// assuming custom nodes are drawing-type, append presentation attributes
Object.keys(nodes).forEach((node) => {
	nodes[node].attributes = (nodes[node].attributes === undefined
		? [...ManyElements.presentation]
		: nodes[node].attributes.concat(ManyElements.presentation));
});
// incorporate custom nodes as if they are drawing primitives.
// Object.assign(Nodes, Spec);//, CustomNodes);
Object.assign(Nodes, Spec, nodes);

// in most cases the key === value. "line": "line"
// except custom shapes: "regularPolygon": "polygon"
Object.keys(NodeNames)
	.forEach(key => NodeNames[key]
		.filter(nodeName => Nodes[nodeName] === undefined)
		.forEach((nodeName) => {
			Nodes[nodeName] = {};
		}));

const passthrough = function () { return Array.from(arguments); };

// complete the lookup table. empty entries where nothing existed
Object.keys(Nodes).forEach((key) => {
	if (!Nodes[key].nodeName) { Nodes[key].nodeName = key; }
	if (!Nodes[key].init) { Nodes[key].init = passthrough; }
	if (!Nodes[key].args) { Nodes[key].args = passthrough; }
	if (!Nodes[key].methods) { Nodes[key].methods = {}; }
	if (!Nodes[key].attributes) {
		Nodes[key].attributes = attributes[key] || [];
	}
});

const assignMethods = (groups, Methods) => {
	groups.forEach(n => Object
		.keys(Methods).forEach((method) => {
			Nodes[n].methods[method] = function () {
				Methods[method](...arguments);
				return arguments[0];
			};
		}));
};

assignMethods(svg_flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g, NodeNames.s, NodeNames.p, NodeNames.i, NodeNames.h, NodeNames.d), classMethods);
assignMethods(svg_flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g, NodeNames.s, NodeNames.p, NodeNames.i, NodeNames.h, NodeNames.d), dom);
assignMethods(svg_flatten_arrays(NodeNames.v, NodeNames.g, NodeNames.s), TransformMethods);
assignMethods(svg_flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g), methods);

/**
 * SVG (c) Kraft
 */

const RequiredAttrMap = {
	svg: {
		version: "1.1",
		xmlns: NS,
	},
	style: {
		type: "text/css",
	},
};

// required attributes for elements like <svg>, <style>
const RequiredAttributes = (element, nodeName) => {
	if (RequiredAttrMap[nodeName]) {
		Object.keys(RequiredAttrMap[nodeName])
			.forEach(key => element.setAttribute(key, RequiredAttrMap[nodeName][key]));
	}
};

const bound = {};

const constructor = (nodeName, parent, ...args) => {
	const element = SVGWindow().document.createElementNS(NS, Nodes[nodeName].nodeName);
	if (parent) { parent.appendChild(element); }
	RequiredAttributes(element, nodeName);
	Nodes[nodeName].init(element, ...args);
	Nodes[nodeName].args(...args).forEach((v, i) => {
		if (Nodes[nodeName].attributes[i] != null) {
			element.setAttribute(Nodes[nodeName].attributes[i], v);
		}
	});
	// camelCase functional style attribute setters, like .stroke() .strokeWidth()
	Nodes[nodeName].attributes.forEach((attribute) => {
		Object.defineProperty(element, Case.toCamel(attribute), {
			value: function () {
				element.setAttribute(attribute, ...arguments);
				return element;
			}
		});
	});
	// custom methods from each primitive's definition
	Object.keys(Nodes[nodeName].methods).forEach(methodName => Object
		.defineProperty(element, methodName, {
			value: function () {
				// all custom methods are attached to the node.
				// if there is no return value specified,
				// the method will return the element itself
				// to encourage method-chaining design.
				// nevermind.
				// things need to be able to return undefined
				return Nodes[nodeName].methods[methodName].call(bound, element, ...arguments);
				// || element;
			},
		}));
	// a method to create a child and automatically append it to this node
	if (nodesAndChildren[nodeName]) {
		nodesAndChildren[nodeName].forEach((childNode) => {
			const value = function () { return constructor(childNode, element, ...arguments); };
			// static methods have to be created in runtime,
			// after the object has been initialized.
			if (Nodes[childNode].static) {
				Object.keys(Nodes[childNode].static).forEach(key => {
					value[key] = function () {
						return Nodes[childNode].static[key](element, ...arguments);
					};
				});
			}
			Object.defineProperty(element, childNode, { value });
		});
	}
	return element;
};

bound.Constructor = constructor;

/**
 * SVG (c) Kraft
 */

const elements = {};

Object.keys(NodeNames).forEach(key => NodeNames[key]
	.forEach((nodeName) => {
		elements[nodeName] = (...args) => constructor(nodeName, null, ...args);
	}));

/**
 * SVG (c) Kraft
 */
/**
 * The purpose of this section is to implant this library to become
 * one small part of a larger library. This requires knowing about
 * the larger library, for now, the linking is hard-coded to Rabbit Ear.
 */
const link_rabbitear_math = (svg, ear) => {
	// give all primitives a .svg() method that turns them into a <path>
	// ignoring primitives: "vector", "line", "ray", "matrix", "plane"
	["segment",
		"circle",
		"ellipse",
		"rect",
		"polygon",
	].filter(key => ear[key] && ear[key].prototype)
		.forEach((key) => {
			ear[key].prototype.svg = function () { return svg.path(this.svgPath()); };
		});

	// bind the other way. allow SVG library to return vector() objects,
	// as in the onMove function, the location of the pointer.
	libraries.math.vector = ear.vector;
};

// create a new svg element "origami", which is really a <svg>
const link_rabbitear_graph = (svg, ear) => {
	// register this node name as a drawable element with the library.
	const NODE_NAME = "origami";
	// actual drawing methods are contained in Rabbit Ear under "ear.graph.svg"
	Nodes[NODE_NAME] = {
		nodeName: "g",
		init: function (element, ...args) {
			return ear.graph.svg.drawInto(element, ...args);
		},
		args: () => [],
		methods: Nodes.g.methods,
		attributes: Nodes.g.attributes,
		static: {},
	};
	Object.keys(ear.graph.svg).forEach(key => {
		Nodes[NODE_NAME].static[key] = (element, ...args) => {
			const child = ear.graph.svg[key](...args);
			element.appendChild(child);
			return child;
		};
	});
	// give "origami" the ability to act like a <svg> and create children, like <line>
	nodesAndChildren[NODE_NAME] = [...nodesAndChildren.g];
	// <svg> and <g> can call .origami() and it is appended as a child
	nodesAndChildren.svg.push(NODE_NAME);
	nodesAndChildren.g.push(NODE_NAME);
	// this sets a constructor as a child of the library itself: ear.svg.origami()
	// as well as the static methods: ear.svg.origami.edges() / faces()...
	// 'boundaries', 'faces', 'edges', 'vertices', 'drawInto', 'getViewBox'
	svg[NODE_NAME] = (...args) => constructor(NODE_NAME, null, ...args);
	Object.keys(ear.graph.svg).forEach(key => {
		svg[NODE_NAME][key] = ear.graph.svg[key];
	});
};

// link this library to be a part of the larger library
const Linker = function (lib) {
	// is the library a familiar library?
	// Rabbit Ear?
	// todo: what is the best way to uniquely identify Rabbit Ear.
	if (lib.graph && lib.origami) {
		lib.svg = this;
		link_rabbitear_math(this, lib);
		link_rabbitear_graph(this, lib);
	}
};

/**
 * SVG (c) Kraft
 */

const initialize = function (svg, ...args) {
	args.filter(arg => typeof arg === str_function)
		.forEach(func => func.call(svg, svg));
};

SVG_Constructor.init = function () {
	const svg = constructor(str_svg, null, ...arguments);
	// call initialize as soon as possible. check if page has loaded
	if (SVGWindow().document.readyState === "loading") {
		SVGWindow().document.addEventListener("DOMContentLoaded", () => initialize(svg, ...arguments));
	} else {
		initialize(svg, ...arguments);
	}
	return svg;
};

// const SVG = function () {
// 	const svg = Constructor(S.str_svg, null, ...arguments);
// 	// call initialize as soon as possible. check if page has loaded
// 	if (window().document.readyState === "loading") {
// 		window().document.addEventListener("DOMContentLoaded", () => initialize(svg, ...arguments));
// 	} else {
// 		initialize(svg, ...arguments);
// 	}
// 	return svg;
// };

SVG.NS = NS;
SVG.linker = Linker.bind(SVG);
// SVG.use = use.bind(SVG);
Object.assign(SVG, elements);
SVG.core = Object.assign(Object.create(null), {
	load: Load,
	save,
	coordinates,
	flatten: svg_flatten_arrays,
	attributes,
	children: nodesAndChildren,
	cdata,
}, Case, classMethods, dom, svg_algebra, TransformMethods, viewBox);

// the window object, from which the document is used to createElement.
// when using Node.js, this must be set to to the
// default export of the library @xmldom/xmldom
Object.defineProperty(SVG, "window", {
	enumerable: false,
	set: value => { setWindow(value); },
});

export { SVG as default };
