/* SVG (c) Robby Kraft, MIT License */
const SVG_Constructor = {
  init: () => {},
};
function SVG () {
  return SVG_Constructor.init(...arguments);
}

const _class = "class";
const _function = "function";
const _undefined = "undefined";
const _boolean = "boolean";
const _number = "number";
const _string = "string";
const _object = "object";
const _svg = "svg";
const _path = "path";
const _id = "id";
const _style = "style";
const _viewBox = "viewBox";
const _transform = "transform";
const _points = "points";
const _stroke = "stroke";
const _fill = "fill";
const _none = "none";
const _arrow = "arrow";
const _head = "head";
const _tail = "tail";

const isBrowser = typeof window !== _undefined
  && typeof window.document !== _undefined;
const isNode = typeof process !== _undefined
  && process.versions != null
  && process.versions.node != null;
const isWebWorker = typeof self === _object
  && self.constructor
  && self.constructor.name === "DedicatedWorkerGlobalScope";

var detect = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isBrowser: isBrowser,
  isNode: isNode,
  isWebWorker: isWebWorker
});

const htmlString = "<!DOCTYPE html><title>.</title>";
const Window = (function () {
  let win = {};
  if (isNode) {
    const { DOMParser, XMLSerializer } = require("@xmldom/xmldom");
    win.DOMParser = DOMParser;
    win.XMLSerializer = XMLSerializer;
    win.document = new DOMParser().parseFromString(htmlString, "text/html");
  } else if (isBrowser) {
    win = window;
  }
  return win;
}());

var NS = "http://www.w3.org/2000/svg";

var NodeNames = {
  s: [
    "svg",
  ],
  d: [
    "defs",
  ],
  h: [
    "desc",
    "filter",
    "metadata",
    "style",
    "script",
    "title",
    "view",
  ],
  c: [
    "cdata",
  ],
  g: [
    "g",
  ],
  v: [
    "circle",
    "ellipse",
    "line",
    "path",
    "polygon",
    "polyline",
    "rect",
  ],
  t: [
    "text",
  ],
  i: [
    "marker",
    "symbol",
    "clipPath",
    "mask",
  ],
  p: [
    "linearGradient",
    "radialGradient",
    "pattern",
  ],
  cT: [
    "textPath",
    "tspan",
  ],
  cG: [
    "stop",
  ],
  cF: [
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
  ],
};

const vec = (a, d) => [Math.cos(a) * d, Math.sin(a) * d];
const arcPath = (x, y, radius, startAngle, endAngle, includeCenter = false) => {
  if (endAngle == null) { return ""; }
  const start = vec(startAngle, radius);
  const end = vec(endAngle, radius);
  const arcVec = [end[0] - start[0], end[1] - start[1]];
  const py = start[0] * end[1] - start[1] * end[0];
  const px = start[0] * end[0] + start[1] * end[1];
  const arcdir = (Math.atan2(py, px) > 0 ? 0 : 1);
  let d = (includeCenter
    ? `M ${x},${y} l ${start[0]},${start[1]} `
    : `M ${x+start[0]},${y+start[1]} `);
  d += ["a ", radius, radius, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");
  if (includeCenter) { d += " Z"; }
  return d;
};

const arcArguments = (a, b, c, d, e) => [arcPath(a, b, c, d, e, false)];
var Arc = {
  arc: {
    nodeName: _path,
    attributes: ["d"],
    args: arcArguments,
    methods: {
      setArc: (el, ...args) => el.setAttribute("d", arcArguments(...args)),
    }
  }
};

const wedgeArguments = (a, b, c, d, e) => [arcPath(a, b, c, d, e, true)];
var Wedge = {
  wedge: {
    nodeName: _path,
    args: wedgeArguments,
    attributes: ["d"],
    methods: {
      setArc: (el, ...args) => el.setAttribute("d", wedgeArguments(...args)),
    }
  }
};

const COUNT = 128;
const parabolaArguments = (x = -1, y = 0, width = 2, height = 1) => Array
  .from(Array(COUNT + 1))
  .map((_, i) => (i - (COUNT)) / COUNT * 2 + 1)
  .map(i => [
    x + (i + 1) * width * 0.5,
    y + (i ** 2) * height
  ]);
const parabolaPathString = (a, b, c, d) => [
  parabolaArguments(a, b, c, d).map(n => `${n[0]},${n[1]}`).join(" ")
];

var Parabola = {
  parabola: {
    nodeName: "polyline",
    attributes: [_points],
    args: parabolaPathString
  }
};

const regularPolygonArguments = (sides, cX, cY, radius) => {
  const origin = [cX, cY];
  return Array.from(Array(sides))
    .map((el, i) => 2 * Math.PI * i / sides)
    .map(a => [Math.cos(a), Math.sin(a)])
    .map(pts => origin.map((o, i) => o + radius * pts[i]));
};
const polygonPathString = (sides, cX = 0, cY = 0, radius = 1) => [
  regularPolygonArguments(sides, cX, cY, radius)
    .map(a => `${a[0]},${a[1]}`).join(" ")
];

var RegularPolygon = {
  regularPolygon: {
    nodeName: "polygon",
    attributes: [_points],
    args: polygonPathString
  }
};

const roundRectArguments = (x, y, width, height, cornerRadius = 0) => {
  if (cornerRadius > width / 2) { cornerRadius = width / 2; }
  if (cornerRadius > height / 2) { cornerRadius = height / 2; }
  const w = width - cornerRadius * 2;
  const h = height - cornerRadius * 2;
  const s = `A${cornerRadius} ${cornerRadius} 0 0 1`;
  return [`M${x + (width - w) / 2},${y}`, `h${w}`, s, `${x + width},${y + (height - h) / 2}`, `v${h}`, s, `${x + width - cornerRadius},${y + height}`, `h${-w}`, s, `${x},${y + height - cornerRadius}`, `v${-h}`, s, `${x + cornerRadius},${y}`].join(" ");
};

var RoundRect = {
  roundRect: {
    nodeName: _path,
    attributes: ["d"],
    args: roundRectArguments
  }
};

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
    .charAt(0).toUpperCase() + s.slice(1)
};

const is_iterable = (obj) => {
  return obj != null && typeof obj[Symbol.iterator] === _function;
};
const semi_flatten_arrays = function () {
  switch (arguments.length) {
    case undefined:
    case 0: return Array.from(arguments);
    case 1: return is_iterable(arguments[0]) && typeof arguments[0] !== _string
      ? semi_flatten_arrays(...arguments[0])
      : [arguments[0]];
    default:
      return Array.from(arguments).map(a => (is_iterable(a)
        ? [...semi_flatten_arrays(a)]
        : a));
  }
};

var coordinates = (...args) => {
  return args.filter(a => typeof a === _number)
    .concat(
      args.filter(a => typeof a === _object && a !== null)
        .map((el) => {
          if (typeof el.x === _number) { return [el.x, el.y]; }
          if (typeof el[0] === _number) { return [el[0], el[1]]; }
          return undefined;
        }).filter(a => a !== undefined)
        .reduce((a, b) => a.concat(b), [])
    );
};

const magnitudeSq2 = (a) => (a[0] ** 2) + (a[1] ** 2);
const magnitude2 = (a) => Math.sqrt(magnitudeSq2(a));
const distanceSq2 = (a, b) => magnitudeSq2(sub2(a, b));
const distance2 = (a, b) => Math.sqrt(distanceSq2(a, b));
const add2 = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
const scale2 = (a, s) => [a[0] * s, a[1] * s];

var algebra = /*#__PURE__*/Object.freeze({
  __proto__: null,
  magnitudeSq2: magnitudeSq2,
  magnitude2: magnitude2,
  distanceSq2: distanceSq2,
  distance2: distance2,
  add2: add2,
  sub2: sub2,
  scale2: scale2
});

const ends = [_tail, _head];
const stringifyPoint = p => p.join(",");
const pointsToPath = (points) => "M" + points.map(pt => pt.join(",")).join("L") + "Z";
const makeArrowPaths = function (options) {
  let pts = [[0,1], [2,3]].map(pt => pt.map(i => options.points[i] || 0));
  let vector = sub2(pts[1], pts[0]);
  let midpoint = add2(pts[0], scale2(vector, 0.5));
  const len = magnitude2(vector);
  const minLength = ends
    .map(s => (options[s].visible
      ? (1 + options[s].padding) * options[s].height * 2.5
      : 0))
    .reduce((a, b) => a + b, 0);
  if (len < minLength) {
    const minVec = len === 0 ? [minLength, 0] : scale2(vector, minLength / len);
    pts = [sub2, add2].map(f => f(midpoint, scale2(minVec, 0.5)));
    vector = sub2(pts[1], pts[0]);
  }
  let perpendicular = [vector[1], -vector[0]];
  let bezPoint = add2(midpoint, scale2(perpendicular, options.bend));
  const bezs = pts.map(pt => sub2(bezPoint, pt));
  const bezsLen = bezs.map(v => magnitude2(v));
  const bezsNorm = bezs.map((bez, i) => bezsLen[i] === 0
    ? bez
    : scale2(bez, 1 / bezsLen[i]));
  const vectors = bezsNorm.map(norm => scale2(norm, -1));
  const normals = vectors.map(vec => [vec[1], -vec[0]]);
  const pad = ends.map((s, i) => options[s].padding
    ? options[s].padding
    : (options.padding ? options.padding : 0.0));
  const scales = ends
    .map((s, i) => options[s].height * (options[s].visible ? 1 : 0))
    .map((n, i) => n + pad[i]);
  const arcs = pts.map((pt, i) => add2(pt, scale2(bezsNorm[i], scales[i])));
  vector = sub2(arcs[1], arcs[0]);
  perpendicular = [vector[1], -vector[0]];
  midpoint = add2(arcs[0], scale2(vector, 0.5));
  bezPoint = add2(midpoint, scale2(perpendicular, options.bend));
  const controls = arcs
    .map((arc, i) => add2(arc, scale2(sub2(bezPoint, arc), options.pinch)));
  const polyPoints = ends.map((s, i) => [
    add2(arcs[i], scale2(vectors[i], options[s].height)),
    add2(arcs[i], scale2(normals[i], options[s].width / 2)),
    add2(arcs[i], scale2(normals[i], -options[s].width / 2)),
  ]);
  return {
    line: `M${stringifyPoint(arcs[0])}C${stringifyPoint(controls[0])},${stringifyPoint(controls[1])},${stringifyPoint(arcs[1])}`,
    tail: pointsToPath(polyPoints[0]),
    head: pointsToPath(polyPoints[1]),
  };
};

const setArrowheadOptions = (element, options, which) => {
  if (typeof options === _boolean) {
    element.options[which].visible = options;
  } else if (typeof options === _object) {
    Object.assign(element.options[which], options);
    if (options.visible == null) {
      element.options[which].visible = true;
    }
  } else if (options == null) {
    element.options[which].visible = true;
  }
};
const setArrowStyle = (element, options = {}, which) => {
  const path = element.getElementsByClassName(`${_arrow}-${which}`)[0];
  Object.keys(options)
    .map(key => ({ key, fn: path[Case.toCamel(key)] }))
    .filter(el => typeof el.fn === _function)
    .forEach(el => el.fn(options[el.key]));
};
const redraw = (element) => {
  const paths = makeArrowPaths(element.options);
  Object.keys(paths)
    .map(path => ({
      path,
      element: element.getElementsByClassName(`${_arrow}-${path}`)[0]
    }))
    .filter(el => el.element)
    .map(el => { el.element.setAttribute("d", paths[el.path]); return el; })
    .filter(el => element.options[el.path])
    .forEach(el => el.element.setAttribute(
      "visibility",
      element.options[el.path].visible
        ? "visible"
        : "hidden"));
  return element;
};
const setPoints$3 = (element, ...args) => {
  element.options.points = coordinates(...semi_flatten_arrays(...args)).slice(0, 4);
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
  setArrowheadOptions(element, options, _head);
  setArrowStyle(element, options, _head);
  return redraw(element);
};
const tail = (element, options) => {
  setArrowheadOptions(element, options, _tail);
  setArrowStyle(element, options, _tail);
  return redraw(element);
};
const getLine = element => element.getElementsByClassName(`${_arrow}-line`)[0];
const getHead = element => element.getElementsByClassName(`${_arrow}-${_head}`)[0];
const getTail = element => element.getElementsByClassName(`${_arrow}-${_tail}`)[0];
var methods$5 = {
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

const arrowKeys = Object.keys(makeArrowOptions());
const matchingOptions = (...args) => {
  for (let a = 0; a < args.length; a++) {
    if (typeof args[a] !== _object) { continue; }
    const keys = Object.keys(args[a]);
    for (let i = 0; i < keys.length; i++) {
      if (arrowKeys.includes(keys[i])) {
        return args[a];
      }
    }
  }
};
const init = function (element, ...args) {
  element.setAttribute(_class, _arrow);
  const paths = ["line", _tail, _head]
    .map(key => SVG.path().setClass(`${_arrow}-${key}`).appendTo(element));
  paths[0].setAttribute(_style, "fill:none;");
  paths[1].setAttribute(_stroke, _none);
  paths[2].setAttribute(_stroke, _none);
  element.options = makeArrowOptions();
  methods$5.setPoints(element, ...args);
  const options = matchingOptions(...args);
  if (options) {
    Object.keys(options)
      .filter(key => methods$5[key])
      .forEach(key => methods$5[key](element, options[key]));
  }
  return element;
};

var Arrow = {
  arrow: {
    nodeName: "g",
    attributes: [],
    args: () => [],
    methods: methods$5,
    init,
  }
};

const flatten_arrays = function () {
  return semi_flatten_arrays(arguments).reduce((a, b) => a.concat(b), []);
};

const makeCurvePath = (endpoints = [], bend = 0, pinch = 0.5) => {
  const tailPt = [endpoints[0] || 0, endpoints[1] || 0];
  const headPt = [endpoints[2] || 0, endpoints[3] || 0];
  const vector = sub2(headPt, tailPt);
  const midpoint = add2(tailPt, scale2(vector, 0.5));
  const perpendicular = [vector[1], -vector[0]];
  const bezPoint = add2(midpoint, scale2(perpendicular, bend));
  const tailControl = add2(tailPt, scale2(sub2(bezPoint, tailPt), pinch));
  const headControl = add2(headPt, scale2(sub2(bezPoint, headPt), pinch));
  return `M${tailPt[0]},${tailPt[1]}C${tailControl[0]},${tailControl[1]} ${headControl[0]},${headControl[1]} ${headPt[0]},${headPt[1]}`;
};

const curveArguments = (...args) => [
  makeCurvePath(coordinates(...flatten_arrays(...args)))
];

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
    ? [move[move.length-2], move[move.length-1]]
    : [0, 0];
  const end = curve
    ? [curve[curve.length-2], curve[curve.length-1]]
    : [0, 0];
  return [...start, ...end];
};

const setPoints$2 = (element, ...args) => {
  const coords = coordinates(...flatten_arrays(...args)).slice(0, 4);
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
var methods$4 = {
  setPoints: setPoints$2,
  bend,
  pinch,
};

var Curve = {
  curve: {
    nodeName: _path,
    attributes: ["d"],
    args: curveArguments,
    methods: methods$4
  }
};

const nodes = {};
Object.assign(nodes,
  Arc,
  Wedge,
  Parabola,
  RegularPolygon,
  RoundRect,
  Arrow,
  Curve
);

const customPrimitives = Object.keys(nodes);
const headerStuff = [NodeNames.h, NodeNames.p, NodeNames.i];
const drawingShapes = [NodeNames.g, NodeNames.v, NodeNames.t, customPrimitives];
const folders = {
  svg: [NodeNames.s, NodeNames.d].concat(headerStuff).concat(drawingShapes),
  g: drawingShapes,
  text: [NodeNames.cT],
  linearGradient: [NodeNames.cG],
  radialGradient: [NodeNames.cG],
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

const viewBoxValue = function (x, y, width, height, padding = 0) {
  const scale = 1.0;
  const d = (width / scale) - width;
  const X = (x - d) - padding;
  const Y = (y - d) - padding;
  const W = (width + d * 2) + padding * 2;
  const H = (height + d * 2) + padding * 2;
  return [X, Y, W, H].join(" ");
};
function viewBox$1 () {
  const numbers = coordinates(...flatten_arrays(arguments));
  if (numbers.length === 2) { numbers.unshift(0, 0); }
  return numbers.length === 4 ? viewBoxValue(...numbers) : undefined;
}

const cdata = (textContent) => (new Window.DOMParser())
  .parseFromString("<root></root>", "text/xml")
  .createCDATASection(`${textContent}`);

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
var dom = {
  removeChildren,
  appendTo,
  setAttributes,
};

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
const parse = string => (new Window.DOMParser())
  .parseFromString(string, "text/xml");
const checkParseError = xml => {
  const parserErrors = xml.getElementsByTagName("parsererror");
  if (parserErrors.length > 0) {
    throw new Error(parserErrors[0]);
  }
  return filterWhitespaceNodes(xml.documentElement);
};
const async = function (input) {
  return new Promise((resolve, reject) => {
    if (typeof input === _string || input instanceof String) {
      fetch(input)
        .then(response => response.text())
        .then(str => checkParseError(parse(str)))
        .then(xml => xml.nodeName === _svg
          ? xml
          : xml.getElementsByTagName(_svg)[0])
        .then(svg => (svg == null
            ? reject("valid XML found, but no SVG element")
            : resolve(svg)))
        .catch(err => reject(err));
    }
    else if (input instanceof Window.Document) {
      return asyncDone(input);
    }
  });
};
const sync = function (input) {
  if (typeof input === _string || input instanceof String) {
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
const isFilename = input => typeof input === _string
  && /^[\w,\s-]+\.[A-Za-z]{3}$/.test(input)
  && input.length < 10000;
const Load = input => (isFilename(input)
  && isBrowser
  && typeof Window.fetch === _function
  ? async(input)
  : sync(input));

function vkXML (text, step) {
  const ar = text.replace(/>\s{0,}</g, "><")
    .replace(/</g, "~::~<")
    .replace(/\s*xmlns\:/g, "~::~xmlns:")
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
    if (ar[ix].search(/<!/) > -1) {
      str += shift[deep] + ar[ix];
      inComment = true;
      if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1
        || ar[ix].search(/!DOCTYPE/) > -1) {
        inComment = false;
      }
    } else if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
      str += ar[ix];
      inComment = false;
    } else if (/^<\w/.exec(ar[ix - 1]) && /^<\/\w/.exec(ar[ix])
      && /^<[\w:\-\.\,]+/.exec(ar[ix - 1])
      == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace("/", "")) {
      str += ar[ix];
      if (!inComment) { deep -= 1; }
    } else if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) === -1
      && ar[ix].search(/\/>/) === -1) {
      str = !inComment ? str += shift[deep++] + ar[ix] : str += ar[ix];
    } else if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
      str = !inComment ? str += shift[deep] + ar[ix] : str += ar[ix];
    } else if (ar[ix].search(/<\//) > -1) {
      str = !inComment ? str += shift[--deep] + ar[ix] : str += ar[ix];
    } else if (ar[ix].search(/\/>/) > -1) {
      str = !inComment ? str += shift[deep] + ar[ix] : str += ar[ix];
    } else if (ar[ix].search(/<\?/) > -1) {
      str += shift[deep] + ar[ix];
    } else if (ar[ix].search(/xmlns\:/) > -1 || ar[ix].search(/xmlns\=/) > -1) {
      str += shift[deep] + ar[ix];
    } else {
      str += ar[ix];
    }
  }
  return (str[0] === "\n") ? str.slice(1) : str;
}

const SAVE_OPTIONS = () => ({
  download: false,
  output: _string,
  windowStyle: false,
  filename: "image.svg"
});
const getWindowStylesheets = function () {
  const css = [];
  if (Window.document.styleSheets) {
    for (let s = 0; s < Window.document.styleSheets.length; s += 1) {
      const sheet = Window.document.styleSheets[s];
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
  const blob = new Window.Blob([contentsAsString], { type: "text/plain" });
  const a = Window.document.createElement("a");
  a.setAttribute("href", Window.URL.createObjectURL(blob));
  a.setAttribute("download", filename);
  Window.document.body.appendChild(a);
  a.click();
  Window.document.body.removeChild(a);
};
const save = function (svg, options) {
  options = Object.assign(SAVE_OPTIONS(), options);
  if (options.windowStyle) {
    const styleContainer = Window.document.createElementNS(NS, _style);
    styleContainer.setAttribute("type", "text/css");
    styleContainer.innerHTML = getWindowStylesheets();
    svg.appendChild(styleContainer);
  }
  const source = (new Window.XMLSerializer()).serializeToString(svg);
  const formattedString = vkXML(source);
  if (options.download && isBrowser && !isNode) {
    downloadInBrowser(options.filename, formattedString);
  }
  return (options.output === _svg ? svg : formattedString);
};

const setViewBox = (element, ...args) => {
  const viewBox = args.length === 1 && typeof args[0] === _string
    ? args[0]
    : viewBox$1(...args);
  if (viewBox) {
    element.setAttribute(_viewBox, viewBox);
  }
  return element;
};
const getViewBox = function (element) {
  const vb = element.getAttribute(_viewBox);
  return (vb == null
    ? undefined
    : vb.split(" ").map(n => parseFloat(n)));
};
const convertToViewBox = function (svg, x, y) {
  const pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
  return [svgPoint.x, svgPoint.y];
};

var viewBox = /*#__PURE__*/Object.freeze({
  __proto__: null,
  setViewBox: setViewBox,
  getViewBox: getViewBox,
  convertToViewBox: convertToViewBox
});

const loadSVG = (target, data) => {
  const result = Load(data);
  if (result == null) { return; }
  return (typeof result.then === _function)
    ? result.then(svg => assignSVG(target, svg))
    : assignSVG(target, result);
};
const getFrame = function (element) {
  const viewBox = getViewBox(element);
  if (viewBox !== undefined) {
    return viewBox;
  }
  if (typeof element.getBoundingClientRect === _function) {
    const rr = element.getBoundingClientRect();
    return [rr.x, rr.y, rr.width, rr.height];
  }
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
const background = function (element, color) {
  let backRect = Array.from(element.childNodes)
    .filter(child => child.getAttribute(_class) === bgClass)
    .shift();
  if (backRect == null) {
    backRect = this.Constructor("rect", ...getFrame(element));
    backRect.setAttribute(_class, bgClass);
    backRect.setAttribute(_stroke, _none);
		element.insertBefore(backRect, element.firstChild);
  }
  backRect.setAttribute(_fill, color);
  return element;
};
const findStyleSheet = function (element) {
  const styles = element.getElementsByTagName(_style);
  return styles.length === 0 ? undefined : styles[0];
};
const stylesheet = function (element, textContent) {
  let styleSection = findStyleSheet(element);
  if (styleSection == null) {
    styleSection = this.Constructor(_style);
    element.insertBefore(styleSection, element.firstChild);
  }
  styleSection.textContent = "";
  styleSection.appendChild(cdata(textContent));
  return styleSection;
};
var methods$3 = {
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

const libraries = {
  math: {
    vector: (...args) => [...args]
  }
};

const categories = {
  move: ["mousemove", "touchmove"],
  press: ["mousedown", "touchstart"],
  release: ["mouseup", "touchend"]
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
	["pressX", "pressY"].filter(prop => !e.hasOwnProperty(prop))
		.forEach((prop, i) => defineGetter(e, prop, startPoint[i]));
	if (!e.hasOwnProperty("press")) {
		defineGetter(e, "press", libraries.math.vector(...startPoint));
	}
};
const TouchEvents = function (element) {
  let startPoint = [];
  const handlers = [];
  Object.keys(categories).forEach((key) => {
    categories[key].forEach((handler) => {
      handlers[handler] = [];
    });
  });
  const removeHandler = category => categories[category]
    .forEach(handlerName => handlers[handlerName]
      .forEach(func => element.removeEventListener(handlerName, func)));
  const categoryUpdate = {
    press: (e, viewPoint) => {
      startPoint = viewPoint;
			assignPress(e, startPoint);
		},
    release: () => {},
    move: (e, viewPoint) => {
      if (e.buttons > 0 && startPoint[0] === undefined) {
        startPoint = viewPoint;
      } else if (e.buttons === 0 && startPoint[0] !== undefined) {
        startPoint = [];
      }
			assignPress(e, startPoint);
    }
  };
  Object.keys(categories).forEach((category) => {
    const propName = "on" + Case.capitalized(category);
    Object.defineProperty(element, propName, {
      set: (handler) => (handler == null)
        ? removeHandler(category)
        : categories[category].forEach((handlerName) => {
            const handlerFunc = (e) => {
              const pointer = (e.touches != null
                ? e.touches[0]
                : e);
              if (pointer !== undefined) {
                const viewPoint = convertToViewBox(element, pointer.clientX, pointer.clientY)
									.map(n => isNaN(n) ? undefined : n);
                ["x", "y"]
                  .filter(prop => !e.hasOwnProperty(prop))
                  .forEach((prop, i) => defineGetter(e, prop, viewPoint[i]));
								if (!e.hasOwnProperty("position")) {
									defineGetter(e, "position", libraries.math.vector(...viewPoint));
								}
                categoryUpdate[category](e, viewPoint);
              }
              handler(e);
            };
            if (element.addEventListener) {
              handlers[handlerName].push(handlerFunc);
              element.addEventListener(handlerName, handlerFunc);
            }
          }),
      enumerable: true
    });
  });
  Object.defineProperty(element, "off", { value: () => off(element, handlers) });
};

var UUID = () => Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, '')
  .concat("aaaaa")
  .substr(0, 5);

const Animation = function (element) {
  let start;
  const handlers = {};
  let frame = 0;
  let requestId;
  const removeHandlers = () => {
    if (Window.cancelAnimationFrame) {
      Window.cancelAnimationFrame(requestId);
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
        frame += 1;
        if (handlers[uuid]) {
          requestId = Window.requestAnimationFrame(handlers[uuid]);
        }
      };
      handlers[uuid] = handlerFunc;
      if (Window.requestAnimationFrame) {
        requestId = Window.requestAnimationFrame(handlers[uuid]);
      }
    },
    enumerable: true
  });
  Object.defineProperty(element, "stop", { value: removeHandlers, enumerable: true });
};

const removeFromParent = svg => (svg && svg.parentNode
  ? svg.parentNode.removeChild(svg)
  : undefined);
const possiblePositionAttributes = [["cx", "cy"], ["x", "y"]];
const controlPoint = function (parent, options = {}) {
  const position = [0, 0];
  const cp = {
    selected: false,
    svg: undefined,
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
    }
  });
  const setPosition = function (...args) {
    coordinates(...flatten_arrays(...args))
      .forEach((n, i) => { position[i] = n; });
    updateSVG();
    if (typeof position.delegate === _function) {
      position.delegate.apply(position.pointsContainer, [proxy, position.pointsContainer]);
    }
  };
  position.delegate = undefined;
  position.setPosition = setPosition;
  position.onMouseMove = mouse => (cp.selected
    ? setPosition(cp.updatePosition(mouse))
    : undefined);
  position.onMouseUp = () => { cp.selected = false; };
  position.distance = mouse => Math.sqrt(distanceSq2(mouse, position));
  ["x", "y"].forEach((prop, i) => Object.defineProperty(position, prop, {
    get: () => position[i],
    set: (v) => { position[i] = v; }
  }));
  [_svg, "updatePosition", "selected"].forEach(key => Object
    .defineProperty(position, key, {
      get: () => cp[key],
      set: (v) => { cp[key] = v; }
    }));
  Object.defineProperty(position, "remove", {
    value: () => {
      removeFromParent(cp.svg);
      position.delegate = undefined;
    }
  });
  return proxy;
};
const controls = function (svg, number, options) {
  let selected;
  let delegate;
  const points = Array.from(Array(number))
    .map(() => controlPoint(svg, options));
  const protocol = point => (typeof delegate === _function
    ? delegate.call(points, point, selected, points)
    : undefined);
  points.forEach((p) => {
    p.delegate = protocol;
    p.pointsContainer = points;
  });
  const mousePressedHandler = function (mouse) {
    if (!(points.length > 0)) { return; }
    selected = points
      .map((p, i) => ({ i, d: distanceSq2(p, [mouse.x, mouse.y]) }))
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
      if (typeof arguments[0] === _function) {
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

var svgDef = {
  svg: {
    args: (...args) => [viewBox$1(coordinates(...args))].filter(a => a != null),
    methods: methods$3,
    init: (element, ...args) => {
      args.filter(a => typeof a === _string)
        .forEach(string => loadSVG(element, string));
      args.filter(a => a != null)
        .filter(el => typeof el.appendChild === _function)
        .forEach(parent => parent.appendChild(element));
      TouchEvents(element);
      Animation(element);
      applyControlsToSVG(element);
    }
  }
};

const loadGroup = (group, ...sources) => {
  const elements = sources.map(source => sync(source))
    .filter(a => a !== undefined);
  elements.filter(element => element.tagName === _svg)
    .forEach(element => moveChildren(group, element));
  elements.filter(element => element.tagName !== _svg)
    .forEach(element => group.appendChild(element));
  return group;
};
var gDef = {
  g: {
    init: loadGroup,
    methods: {
      load: loadGroup,
    }
  }
};

var attributes = Object.assign(Object.create(null), {
  svg: [_viewBox],
  line: ["x1", "y1", "x2", "y2"],
  rect: ["x", "y", "width", "height"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  polygon: [_points],
  polyline: [_points],
  path: ["d"],
  text: ["x", "y"],
  mask: [_id],
  symbol: [_id],
  clipPath: [
    _id,
    "clip-rule",
  ],
  marker: [
    _id,
    "markerHeight",
    "markerUnits",
    "markerWidth",
    "orient",
    "refX",
    "refY",
  ],
  linearGradient: [
    "x1",
    "x2",
    "y1",
    "y2",
  ],
  radialGradient: [
    "cx",
    "cy",
    "r",
    "fr",
    "fx",
    "fy",
  ],
  stop: [
    "offset",
    "stop-color",
    "stop-opacity",
  ],
  pattern: [
    "patternContentUnits",
    "patternTransform",
    "patternUnits",
  ],
});

const setRadius = (el, r) => {
  el.setAttribute(attributes.circle[2], r);
  return el;
};
const setOrigin = (el, a, b) => {
  [...coordinates(...flatten_arrays(a, b)).slice(0, 2)]
    .forEach((value, i) => el.setAttribute(attributes.circle[i], value));
  return el;
};
const fromPoints = (a, b, c, d) => [a, b, distance2([a, b], [c, d])];
var circleDef = {
  circle: {
    args: (a, b, c, d) => {
      const coords = coordinates(...flatten_arrays(a, b, c, d));
      switch (coords.length) {
        case 0: case 1: return [, , ...coords]
        case 2: case 3: return coords;
        default: return fromPoints(...coords);
      }
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
    }
  }
};

const setRadii = (el, rx, ry) => {
  [, , rx, ry].forEach((value, i) => el.setAttribute(attributes.ellipse[i], value));
  return el;
};
const setCenter = (el, a, b) => {
  [...coordinates(...flatten_arrays(a, b)).slice(0, 2)]
    .forEach((value, i) => el.setAttribute(attributes.ellipse[i], value));
  return el;
};
var ellipseDef = {
  ellipse: {
    args: (a, b, c, d) => {
      const coords = coordinates(...flatten_arrays(a, b, c, d)).slice(0, 4);
      switch (coords.length) {
        case 0: case 1: case 2: return [, , ...coords]
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
    }
  }
};

const Args$1 = (...args) => coordinates(...semi_flatten_arrays(...args)).slice(0, 4);
const setPoints$1 = (element, ...args) => { Args$1(...args)
  .forEach((value, i) => element.setAttribute(attributes.line[i], value)); return element; };
var lineDef = {
  line: {
    args: Args$1,
    methods: {
      setPoints: setPoints$1,
    }
  }
};

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
  z: "close"
};
Object.keys(pathCommands).forEach((key) => {
  const s = pathCommands[key];
  pathCommands[key.toUpperCase()] = s.charAt(0).toUpperCase() + s.slice(1);
});
const parsePathCommands = function (str) {
  const results = [];
  let match;
  while ((match = markerRegEx.exec(str)) !== null) {
    results.push(match);
  }
  return results.map(match => ({
    command: str[match.index],
    index: match.index
  }))
  .reduceRight((all, cur) => {
    const chunk = str.substring(cur.index, all.length ? all[all.length - 1].index : str.length);
    return all.concat([
       { command: cur.command,
       index: cur.index,
       chunk: (chunk.length > 0) ? chunk.substr(1, chunk.length - 1) : chunk }
    ]);
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
const getD = (el) => {
  const attr = el.getAttribute("d");
  return (attr == null) ? "" : attr;
};
const clear = element => {
  element.removeAttribute("d");
  return element;
};
const appendPathCommand = (el, command, ...args) => {
  el.setAttribute("d", `${getD(el)}${command}${flatten_arrays(...args).join(" ")}`);
  return el;
};
const getCommands = element => parsePathCommands(getD(element));
const methods$2 = {
  addCommand: appendPathCommand,
  appendCommand: appendPathCommand,
  clear,
  getCommands: getCommands,
  get: getCommands,
  getD: el => el.getAttribute("d"),
};
Object.keys(pathCommands).forEach((key) => {
  methods$2[pathCommands[key]] = (el, ...args) => appendPathCommand(el, key, ...args);
});
var pathDef = {
  path: {
    methods: methods$2
  }
};

const setRectSize = (el, rx, ry) => {
  [, , rx, ry]
    .forEach((value, i) => el.setAttribute(attributes.rect[i], value));
  return el;
};
const setRectOrigin = (el, a, b) => {
  [...coordinates(...flatten_arrays(a, b)).slice(0, 2)]
    .forEach((value, i) => el.setAttribute(attributes.rect[i], value));
  return el;
};
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
var rectDef = {
  rect: {
    args: (a, b, c, d) => {
      const coords = coordinates(...flatten_arrays(a, b, c, d)).slice(0, 4);
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
    }
  }
};

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
      }
    }
  }
};

var textDef = {
  text: {
    args: (a, b, c) => coordinates(...flatten_arrays(a, b, c)).slice(0, 2),
    init: (element, a, b, c, d) => {
      const text = [a,b,c,d].filter(a => typeof a === _string).shift();
      if (text) {
        element.appendChild(Window.document.createTextNode(text));
      }
    }
  }
};

const makeIDString = function () {
  return Array.from(arguments)
    .filter(a => typeof a === _string || a instanceof String)
    .shift() || UUID();
};
const args = (...args) => [makeIDString(...args)];
var maskTypes = {
  mask: { args: args },
  clipPath: { args: args },
  symbol: { args: args },
  marker: {
    args: args,
    methods: {
      size: setViewBox,
      setViewBox: setViewBox
    }
  },
};

const getPoints = (el) => {
  const attr = el.getAttribute(_points);
  return (attr == null) ? "" : attr;
};
const polyString = function () {
  return Array
    .from(Array(Math.floor(arguments.length / 2)))
    .map((_, i) => `${arguments[i * 2 + 0]},${arguments[i * 2 + 1]}`)
    .join(" ");
};
const stringifyArgs = (...args) => [
  polyString(...coordinates(...semi_flatten_arrays(...args)))
];
const setPoints = (element, ...args) => {
  element.setAttribute(_points, stringifyArgs(...args)[0]);
  return element;
};
const addPoint = (element, ...args) => {
  element.setAttribute(_points, [getPoints(element), stringifyArgs(...args)[0]]
    .filter(a => a !== "")
    .join(" "));
  return element;
};
const Args = function (...args) {
  return args.length === 1 && typeof args[0] === _string
    ? [args[0]]
    : stringifyArgs(...args);
};
var polyDefs = {
  polyline: {
    args: Args,
    methods: {
      setPoints,
      addPoint
    }
  },
  polygon: {
    args: Args,
    methods: {
      setPoints,
      addPoint
    }
  }
};

var Spec = Object.assign({},
  svgDef,
  gDef,
  circleDef,
  ellipseDef,
  lineDef,
  pathDef,
  rectDef,
  styleDef,
  textDef,
  maskTypes,
  polyDefs,
);

var ManyElements = {
  presentation: [
    "color",
    "color-interpolation",
    "cursor",
    "direction",
    "display",
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
    "image-rendering",
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
    "transform-origin",
    "user-select",
    "vector-effect",
    "visibility"
  ],
  animation: [
    "accumulate",
    "additive",
    "attributeName",
    "begin",
    "by",
    "calcMode",
    "dur",
    "end",
    "from",
    "keyPoints",
    "keySplines",
    "keyTimes",
    "max",
    "min",
    "repeatCount",
    "repeatDur",
    "restart",
    "to",
    "values",
  ],
  effects: [
    "azimuth",
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
    "in",
    "in2",
    "intercept",
    "k1",
    "k2",
    "k3",
    "k4",
    "kernelMatrix",
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
    "targetX",
    "targetY",
    "type",
    "xChannelSelector",
    "yChannelSelector",
  ],
  text: [
    "dx",
    "dy",
    "alignment-baseline",
    "baseline-shift",
    "dominant-baseline",
    "lengthAdjust",
    "method",
    "overline-position",
    "overline-thickness",
    "rotate",
    "spacing",
    "startOffset",
    "strikethrough-position",
    "strikethrough-thickness",
    "text-anchor",
    "text-decoration",
    "text-rendering",
    "textLength",
    "underline-position",
    "underline-thickness",
    "word-spacing",
    "writing-mode",
  ],
  gradient: [
    "gradientTransform",
    "gradientUnits",
    "spreadMethod",
  ],
};

Object.values(NodeNames)
  .reduce((a,b) => a.concat(b), [])
  .filter(nodeName => attributes[nodeName] === undefined)
  .forEach(nodeName => { attributes[nodeName] = []; });
[ [[_svg, "defs", "g"].concat(NodeNames.v, NodeNames.t), ManyElements.presentation],
  [["filter"], ManyElements.effects],
  [NodeNames.cT.concat("text"), ManyElements.text],
  [NodeNames.cF, ManyElements.effects],
  [NodeNames.cG, ManyElements.gradient],
].forEach(pair => pair[0].forEach(key => {
  attributes[key] = attributes[key].concat(pair[1]);
}));

const getClassList = (element) => {
  if (element == null) { return []; }
  const currentClass = element.getAttribute(_class);
  return (currentClass == null
    ? []
    : currentClass.split(" ").filter(s => s !== ""));
};
var classMethods = {
  addClass: (element, newClass) => {
    const classes = getClassList(element)
      .filter(c => c !== newClass);
    classes.push(newClass);
    element.setAttributeNS(null, _class, classes.join(" "));
  },
  removeClass: (element, removedClass) => {
    const classes = getClassList(element)
      .filter(c => c !== removedClass);
    element.setAttributeNS(null, _class, classes.join(" "));
  },
  setClass: (element, className) => {
    element.setAttributeNS(null, _class, className);
  },
  setId: (element, idName) => {
    element.setAttributeNS(null, _id, idName);
  }
};

const getAttr = (element) => {
  const t = element.getAttribute(_transform);
  return (t == null || t === "") ? undefined : t;
};
const methods$1 = {
  clearTransform: (el) => { el.removeAttribute(_transform); return el; }
};
["translate", "rotate", "scale", "matrix"].forEach(key => {
  methods$1[key] = (element, ...args) => element.setAttribute(
    _transform,
    [getAttr(element), `${key}(${args.join(" ")})`]
      .filter(a => a !== undefined)
      .join(" "));
});

const findIdURL = function (arg) {
  if (arg == null) { return ""; }
  if (typeof arg === _string) {
    return arg.slice(0, 3) === "url"
      ? arg
      : `url(#${arg})`;
  }
  if (arg.getAttribute != null) {
    const idString = arg.getAttribute(_id);
    return `url(#${idString})`;
  }
  return "";
};
const methods = {};
["clip-path",
  "mask",
  "symbol",
  "marker-end",
  "marker-mid",
  "marker-start",
].forEach(attr => {
  methods[Case.toCamel(attr)] = (element, parent) => element.setAttribute(attr, findIdURL(parent));
});

const Nodes = {};
NodeNames.v.push(...Object.keys(nodes));
Object.keys(nodes).forEach((node) => {
  nodes[node].attributes = (nodes[node].attributes === undefined
    ? [...ManyElements.presentation]
    : nodes[node].attributes.concat(ManyElements.presentation));
});
Object.assign(Nodes, Spec, nodes);
Object.keys(NodeNames)
  .forEach(key => NodeNames[key]
    .filter(nodeName => Nodes[nodeName] === undefined)
    .forEach((nodeName) => {
      Nodes[nodeName] = {};
    }));
const passthrough = function () { return Array.from(arguments); };
Object.keys(Nodes).forEach((key) => {
  if (!Nodes[key].nodeName) { Nodes[key].nodeName = key; }
  if (!Nodes[key].init) { Nodes[key].init = passthrough; }
  if (!Nodes[key].args) { Nodes[key].args = passthrough; }
  if (!Nodes[key].methods) { Nodes[key].methods = {}; }
  if (!Nodes[key].attributes) {
    Nodes[key].attributes = attributes[key] || [];
  }
});
const assign = (groups, Methods) => {
  groups.forEach(n =>
    Object.keys(Methods).forEach((method) => {
      Nodes[n].methods[method] = function () {
        Methods[method](...arguments);
        return arguments[0];
      };
    }));
};
assign(flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g, NodeNames.s, NodeNames.p, NodeNames.i, NodeNames.h, NodeNames.d), classMethods);
assign(flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g, NodeNames.s, NodeNames.p, NodeNames.i, NodeNames.h, NodeNames.d), dom);
assign(flatten_arrays(NodeNames.v, NodeNames.g, NodeNames.s), methods$1);
assign(flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g), methods);

const RequiredAttrMap = {
  svg: {
    version: "1.1",
    xmlns: NS,
  },
  style: {
    type: "text/css"
  }
};
const RequiredAttributes = (element, nodeName) => {
  if (RequiredAttrMap[nodeName]) {
    Object.keys(RequiredAttrMap[nodeName])
      .forEach(key => element.setAttribute(key, RequiredAttrMap[nodeName][key]));
  }
};
const bound = {};
const constructor = (nodeName, ...args) => {
  const element = Window.document.createElementNS(NS, Nodes[nodeName].nodeName);
  RequiredAttributes(element, nodeName);
  Nodes[nodeName].init(element, ...args);
  Nodes[nodeName].args(...args).forEach((v, i) => {
    if (Nodes[nodeName].attributes[i] != null) {
      element.setAttribute(Nodes[nodeName].attributes[i], v);
    }
  });
  Nodes[nodeName].attributes.forEach((attribute) => {
    Object.defineProperty(element, Case.toCamel(attribute), {
      value: function () {
        element.setAttribute(attribute, ...arguments);
        return element;
      }
    });
  });
  Object.keys(Nodes[nodeName].methods).forEach(methodName =>
    Object.defineProperty(element, methodName, {
      value: function () {
        return Nodes[nodeName].methods[methodName].call(bound, element, ...arguments);
      }
    }));
  if (nodesAndChildren[nodeName]) {
    nodesAndChildren[nodeName].forEach((childNode) => {
      const value = function () {
        const childElement = constructor(childNode, ...arguments);
        element.appendChild(childElement);
        return childElement;
      };
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

const elements = {};
Object.keys(NodeNames).forEach(key => NodeNames[key]
  .forEach((nodeName) => {
    elements[nodeName] = (...args) => constructor(nodeName, ...args);
  }));

const link_rabbitear_math = (svg, ear) => {
  [ "segment",
    "circle",
    "ellipse",
    "rect",
    "polygon",
  ].filter(key => ear[key] && ear[key].prototype)
    .forEach((key) => {
      ear[key].prototype.svg = function () { return svg.path(this.svgPath()); };
    });
  libraries.math.vector = ear.vector;
};
const link_rabbitear_graph = (svg, ear) => {
  const NODE_NAME = "origami";
  Nodes[NODE_NAME] = {
    nodeName: "svg",
    init: function (element, ...args) {
      return ear.graph.svg.drawInto(element, ...args);
    },
    args: () => [],
    methods: Nodes.svg.methods,
    attributes: Nodes.svg.attributes,
    static: {},
  };
  Object.keys(ear.graph.svg).forEach(key => {
    Nodes[NODE_NAME].static[key] = (element, ...args) => {
      const child = ear.graph.svg[key](...args);
      element.appendChild(child);
      return child;
    };
  });
  nodesAndChildren[NODE_NAME] = [...nodesAndChildren.svg];
  nodesAndChildren.svg.push(NODE_NAME);
  nodesAndChildren.g.push(NODE_NAME);
  svg[NODE_NAME] = (...args) => constructor(NODE_NAME, ...args);
  Object.keys(ear.graph.svg).forEach(key => {
    svg[NODE_NAME][key] = ear.graph.svg[key];
  });
};
const Linker = function (lib) {
	if (lib.graph && lib.origami) {
    lib.svg = this;
    link_rabbitear_math(this, lib);
    link_rabbitear_graph(this, lib);
	}
};

const initialize = function (svg, ...args) {
  args.filter(arg => typeof arg === _function)
    .forEach(func => func.call(svg, svg));
};
SVG_Constructor.init = function () {
  const svg = constructor(_svg, ...arguments);
  if (Window.document.readyState === "loading") {
    Window.document.addEventListener("DOMContentLoaded", () => initialize(svg, ...arguments));
  } else {
    initialize(svg, ...arguments);
  }
  return svg;
};
SVG.NS = NS;
SVG.linker = Linker.bind(SVG);
Object.assign(SVG, elements);
SVG.core = Object.assign(Object.create(null), {
  load: Load,
  save,
  coordinates,
  flatten: flatten_arrays,
  attributes,
  children: nodesAndChildren,
  cdata,
  detect,
}, Case, classMethods, dom, algebra, methods$1, viewBox);

export { SVG as default };
