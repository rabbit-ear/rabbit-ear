/* SVG (c) Robby Kraft, MIT License */
var Debug = {
  log: () => {},
};

const keys = [
  "number",
  "object",
  "transform",
  "class",
  "style",
  "function",
  "string",
  "undefined",
  "boolean",
  "path",
  "svg",
  "id",
];
const Keys = {};
keys.forEach(key => Keys[key] = key);

const isBrowser = typeof window !== Keys.undefined
  && typeof window.document !== Keys.undefined;
const isNode = typeof process !== Keys.undefined
  && process.versions != null
  && process.versions.node != null;

const htmlString = "<!DOCTYPE html><title>.</title>";
const win = (function () {
  let w = {};
  if (isNode) {
    const { DOMParser, XMLSerializer } = require("xmldom");
    w.DOMParser = DOMParser;
    w.XMLSerializer = XMLSerializer;
    w.document = new DOMParser().parseFromString(htmlString, "text/html");
  } else if (isBrowser) {
    w = window;
  }
  return w;
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
    nodeName: "path",
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
    nodeName: "path",
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
    attributes: ["points"],
    args: parabolaPathString
  }
};

const regularPolygonArguments = (cX, cY, radius, sides) => {
  const origin = [cX, cY];
  return Array.from(Array(sides))
    .map((el, i) => 2 * Math.PI * i / sides)
    .map(a => [Math.cos(a), Math.sin(a)])
    .map(pts => origin.map((o, i) => o + radius * pts[i]));
};
const polygonPathString = (cX, cY, radius, sides) => [
  regularPolygonArguments(cX, cY, radius, sides)
    .map(a => `${a[0]},${a[1]}`).join(" ")
];

var RegularPolygon = {
  regularPolygon: {
    nodeName: "polygon",
    attributes: ["points"],
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
    nodeName: "path",
    attributes: ["d"],
    args: roundRectArguments
  }
};

const isIterable = (obj) => {
  return obj != null && typeof obj[Symbol.iterator] === Keys.function;
};
const flatten = (...args) => {
  switch (args.length) {
    case undefined:
    case 0: return args;
    case 1: return isIterable(args[0]) && typeof args[0] !== Keys.string
      ? flatten(...args[0])
      : [args[0]];
    default:
      return Array.from(args)
        .map(a => (isIterable(a)
          ? [...flatten(a)]
          : a))
        .reduce((a, b) => a.concat(b), []);
  }
};

var coordinates = (...args) => {
  return args.filter(a => typeof a === Keys.number)
    .concat(
      args.filter(a => typeof a === Keys.object && a !== null)
      .map(el => {
        if (typeof el.x === Keys.number) return [el.x, el.y];
        if (typeof el[0] === Keys.number) return [el[0], el[1]];
        return undefined;
      }).filter(a => a !== undefined)
      .reduce((a, b) => a.concat(b), [])
    );
};

const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const scale = (a, s) => [a[0] * s, a[1] * s];
const curveArguments = function (...args) {
  const params = coordinates(...flatten(...args));
  const endpoints = params.slice(0, 4);
  if (!endpoints.length) { return [""]; }
  const o_curve = params[4] || 0;
  const o_pinch = params[5] || 0.5;
  const tailPt = [endpoints[0], endpoints[1]];
  const headPt = [endpoints[2], endpoints[3]];
  const vector = sub(headPt, tailPt);
  const midpoint = add(tailPt, scale(vector, 0.5));
  const perpendicular = [vector[1], -vector[0]];
  const bezPoint = add(midpoint, scale(perpendicular, o_curve));
  const tailControl = add(tailPt, scale(sub(bezPoint, tailPt), o_pinch));
  const headControl = add(headPt, scale(sub(bezPoint, headPt), o_pinch));
  return [`M${tailPt[0]},${tailPt[1]}C${tailControl[0]},${tailControl[1]} ${headControl[0]},${headControl[1]} ${headPt[0]},${headPt[1]}`];
};

const getEndpoints = (element) => {
  const d = element.getAttribute("d");
  if (d == null || d === "") { return []; }
  return [
    d.slice(d.indexOf("M")+1, d.indexOf("C")).split(","),
    d.split(" ").pop().split(",")
  ].map(p => p.map(n => parseFloat(n)));
};
const bend = (element, amount) => {
  element.setAttribute("d", curveArguments(...getEndpoints(element), amount));
  return element;
};
var methods = {
  bend
};

var Curve = {
  curve: {
    nodeName: "path",
    attributes: ["d"],
    args: curveArguments,
    methods: methods
  }
};

const nodes = {};
Object.assign(nodes,
  Arc,
  Wedge,
  Parabola,
  RegularPolygon,
  RoundRect,
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
const nodesAndChildren = {};
Object.keys(folders).forEach(key => {
  nodesAndChildren[key] = folders[key].reduce((a, b) => a.concat(b), []);
});
Debug.log(nodesAndChildren);

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

var NodeAttributes = {
  svg: ["viewBox"],
  line: ["x1", "y1", "x2", "y2"],
  rect: ["x", "y", "width", "height"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  polygon: ["points"],
  polyline: ["points"],
  path: ["d"],
  text: ["x", "y"],
  mask: ["id"],
  symbol: ["id"],
  clipPath: [
    "id",
    "clip-rule",
  ],
  marker: [
    "id",
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
};

const setRadius = (el, r) => el.setAttribute(NodeAttributes.circle[2], r);
const setCenter = (el, a, b) => coordinates(...flatten(a, b)).slice(0, 2)
  .forEach((value, i) => el.setAttribute(NodeAttributes.circle[i], value));
const fromPoints = (a, b, c, d) => [a, b, Math.sqrt(Math.pow(c-a, 2) + Math.pow(d-b, 2))];
var circle = {
  circle: {
    args: (a, b, c, d) => {
      const coords = coordinates(...flatten(a, b, c, d));
      return (coords.length > 3
        ? fromPoints(...coords)
        : coords);
    },
    methods: {
      radius: setRadius,
      setRadius: setRadius,
      center: setCenter,
      setCenter: setCenter,
      position: setCenter,
      setPosition: setCenter,
    }
  }
};

const setRadii = (el, rx, ry) => [,,rx,ry].forEach((value, i) => el
  .setAttribute(NodeAttributes.ellipse[i], value));
const setCenter$1 = (el, a, b) => coordinates(...flatten(a, b)).slice(0, 2)
  .forEach((value, i) => el.setAttribute(NodeAttributes.ellipse[i], value));
var ellipse = {
  ellipse: {
    args: (a, b, c, d) => coordinates(...flatten(a, b, c, d)).slice(0, 4),
    methods: {
      radius: setRadii,
      setRadius: setRadii,
      center: setCenter$1,
      setCenter: setCenter$1,
      position: setCenter$1,
      setPosition: setCenter$1,
    }
  }
};

const Args = (a, b, c, d) => coordinates(...flatten(a, b, c, d)).slice(0, 4);
const setPoints = (element, a, b, c, d) => Args(a, b, c, d)
  .forEach((value, i) => element.setAttribute(NodeAttributes.line[i], value));
var line = {
  line: {
    args: Args,
    methods: {
      setPoints,
    }
  }
};

var markerRegEx = /[MmLlSsQqLlHhVvCcSsQqTtAaZz]/g;
var digitRegEx = /-?[0-9]*\.?\d+/g;
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
Object.keys(pathCommands).forEach(key => {
  const s = pathCommands[key];
  pathCommands[key.toUpperCase()] = s.charAt(0).toUpperCase() + s.slice(1);
});
const getD = (el) => {
  const attr = el.getAttribute("d");
  return (attr == null) ? "" : attr;
};
const appendPathItem = (el, command, ...args) => el
  .setAttribute("d", `${getD(el)}${command}${flatten(...args).join(" ")}`);
const parsePathCommands = function (str) {
  const results = [];
  let match;
  while ((match = markerRegEx.exec(str)) !== null) {
    results.push(match);
  }  return results.map(match => ({
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
const clear = element => element.removeAttribute("d");
const getCommands = element => parsePathCommands(getD(element));
const setCommands = (element, commandsObject) => commandsObject
  .forEach(el => appendPathItem(element, el.command, el.values));
const setString = (element, commandsString) => element
  .setAttribute("d", commandsString);
const setters = {
  "string": setString,
  "object": setCommands,
};
const noClearSet = (element, ...args) => {
  if (args.length === 1) {
    const typ = typeof args[0];
    if (setters[typ]) {
      setters[typ](element, args[0]);
    }
  }
};
const clearAndSet = (element, ...args) => {
  if (args.length === 1) {
    const typ = typeof args[0];
    if (setters[typ]) {
      clear(element);
      setters[typ](element, args[0]);
    }
  }
};
const methods$1 = {
  command: appendPathItem,
  clear,
  "get": getCommands,
  "set": clearAndSet,
  "add": noClearSet,
};
Object.keys(pathCommands).forEach(key => {
  methods$1[pathCommands[key]] = (el, ...args) => appendPathItem(el, key, ...args);
});
var path = {
  path: {
    methods: methods$1
  }
};

var rect = {
  rect: {
    args: (a, b, c, d) => {
      const coords = coordinates(...flatten(a, b, c, d)).slice(0, 4);
      if (coords.length > 3) {
        [0, 1].filter(i => coords[2+i] < 0).forEach(i => {
          coords[i] += coords[2+i];
          coords[2+i] = -coords[2+i];
        });
      }
      return coords;
    },
  }
};

const cdata = (textContent) => (new win.DOMParser())
  .parseFromString("<root></root>", "text/xml")
  .createCDATASection(`${textContent}`);

var style = {
  style: {
    methods: {
      setTextContent: (el, text) => {
        el.textContent = "";
        el.appendChild(cdata(text));
      }
    }
  }
};

var text = {
  text: {
    args: (a, b, c) => coordinates(...flatten(a, b, c)).slice(0, 2),
    init: (element, a, b, c, d) => {
      const text = [a,b,c,d].filter(a => typeof a === Keys.string).shift();
      if (text) {
        if (element.firstChild) {
          element.firstChild.nodeValue = text;
        } else {
          element.appendChild(win.document.createTextNode(text));
        }
      }
    }
  }
};

const viewBoxValue = function (x, y, width, height, padding) {
  if (padding == null) { padding = 0; }
  const scale = 1.0;
  const d = (width / scale) - width;
  const X = (x - d) - padding;
  const Y = (y - d) - padding;
  const W = (width + d * 2) + padding * 2;
  const H = (height + d * 2) + padding * 2;
  return [X, Y, W, H].join(" ");
};
function viewBox () {
  const numbers = coordinates(...flatten(arguments));
  if (numbers.length === 2) { numbers.unshift(0, 0); }
  return numbers.length === 4 ? viewBoxValue(...numbers) : undefined;
}

var DOM = {
  removeChildren: (element) => {
    while (element.lastChild) {
      element.removeChild(element.lastChild);
    }
  },
  appendTo: (element, parent) => {
    if (parent != null) {
      parent.appendChild(element);
    }
  },
  setAttributes: (element, attrs) => Object.keys(attrs)
    .forEach(key => element.setAttribute(Case.toKebab(key), attrs[key]))
};

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

const downloadInBrowser = function (filename, contentsAsString) {
  const blob = new win.Blob([contentsAsString], { type: "text/plain" });
  const a = win.document.createElement("a");
  a.setAttribute("href", win.URL.createObjectURL(blob));
  a.setAttribute("download", filename);
  win.document.body.appendChild(a);
  a.click();
  win.document.body.removeChild(a);
};
const SAVE_OPTIONS = () => ({
  output: Keys.string,
  windowStyle: false,
  filename: "image.svg"
});
const save = function (svg, options) {
  options = Object.assign(SAVE_OPTIONS(), options);
  const source = (new win.XMLSerializer()).serializeToString(svg);
  const formattedString = vkXML(source);
  if (isBrowser && !isNode) {
    downloadInBrowser(options.filename, formattedString);
  }
  return (options.output === "svg" ? svg : formattedString);
};

const parse = string => (new win.DOMParser())
  .parseFromString(string, "text/xml");
const checkParseError = xml => {
  const parserErrors = xml.getElementsByTagName("parsererror");
  if (parserErrors.length > 0) {
    throw new Error(parserErrors[0]);
  }
  return xml.documentElement;
};
const async = function (input) {
  return new Promise((resolve, reject) => {
    if (typeof input === Keys.string || input instanceof String) {
      fetch(input)
        .then(response => response.text())
        .then(str => checkParseError(parse(str)))
        .then(xml => xml.nodeName === "svg"
          ? xml
          : xml.getElementsByTagName("svg")[0])
        .then(svg => (svg == null
            ? reject("valid XML found, but no SVG element")
            : resolve(svg)))
        .catch(err => reject(err));
    }
    else if (input instanceof win.Document) {
      return asyncDone(input);
    }
  });
};
const sync = function (input) {
  if (typeof input === Keys.string || input instanceof String) {
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
const isFilename = input => typeof input === Keys.string
  && /^[\w,\s-]+\.[A-Za-z]{3}$/.test(input)
  && input.length < 10000;
const Load = input => (isFilename && isBrowser
  ? async(input)
  : sync(input));

const vB = "viewBox";
const setViewBox = (element, ...args) => {
  const viewBox$1 = args.length === 1 && typeof args[0] === "string"
    ? args[0]
    : viewBox(...args);
  if (viewBox$1) {
    element.setAttribute(vB, viewBox$1);
  }
  return element;
};
const getViewBox = function (element) {
  const vb = element.getAttribute(vB);
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

const getFrame = function (element) {
  const viewBox = getViewBox(element);
  if (viewBox !== undefined) {
    return viewBox;
  }
  if (typeof element.getBoundingClientRect === Keys.function) {
    const rr = element.getBoundingClientRect();
    return [rr.x, rr.y, rr.width, rr.height];
  }
  return [];
};
const bgClass = "svg-background-rectangle";
const background = function (element, color) {
  let backRect = Array.from(element.childNodes)
    .filter(child => child.getAttribute(Keys.class) === bgClass)
    .shift();
  if (backRect == null) {
    backRect = this.Constructor("rect", ...getFrame(element));
    backRect.setAttribute(Keys.class, bgClass);
    element.insertBefore(backRect, element.firstChild);
  }
  backRect.setAttribute("fill", color);
  return backRect;
};
const findStyleSheet = function (element) {
  const styles = element.getElementsByTagName(Keys.style);
  return styles.length === 0 ? undefined : styles[0];
};
const stylesheet = function (element, textContent) {
  let styleSection = findStyleSheet(element);
  if (styleSection == null) {
    styleSection = this.Constructor(Keys.style);
    element.insertBefore(styleSection, element.firstChild);
  }
  styleSection.textContent = "";
  styleSection.appendChild(cdata(textContent));
  return styleSection;
};
const clear$1 = function (element) {
  Array.from(element.attributes)
    .filter(a => a !== "xmlns")
    .forEach(attr => element.removeAttribute(attr.name));
  DOM.removeChildren(element);
};
const assignSVG = function (target, source) {
  clear$1(target);
  Array.from(source.childNodes).forEach((node) => {
    source.removeChild(node);
    target.appendChild(node);
  });
  Array.from(source.attributes)
    .forEach(attr => target.setAttribute(attr.name, attr.value));
};
const loadHelper = function (target, data) {
  const result = Load(data);
  if (result == null) { return; }
  return (typeof result.then === "function")
    ? result.then(svg => assignSVG(target, svg))
    : assignSVG(target, result);
};
var methods$2 = {
  clear: clear$1,
  size: setViewBox,
  setViewBox: setViewBox,
  background: background,
  getWidth: el => getFrame(el)[2],
  getHeight: el => getFrame(el)[3],
  stylesheet: function (text) { return stylesheet.call(this, text); },
  load: loadHelper,
  save: save,
};

const ElementConstructor = (new win.DOMParser())
  .parseFromString("<div />", "text/xml").documentElement.constructor;
var svg = {
  svg: {
    args: (...args) => [viewBox(coordinates(...args))].filter(a => a != null),
    methods: methods$2,
    init: (element, ...args) => {
      const parent = args.filter(a => a != null)
        .filter(arg => arg instanceof ElementConstructor)
        .shift();
      if (parent != null && typeof parent.appendChild === Keys.function) {
        parent.appendChild(element);
      }
    }
  }
};

var UUID = () => Math.random().toString(36).replace(/[^a-z]+/g, '').concat("aaaaa").substr(0, 5);

const makeIDString = function () {
  return Array.from(arguments)
    .filter(a => typeof a === Keys.string || a instanceof String)
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

const getPoints = el => {
  const attr = el.getAttribute("points");
  return (attr == null) ? "" : attr;
};
const polyString = function () {
  return Array
    .from(Array(Math.floor(arguments.length / 2)))
    .map((_, i) => `${arguments[i*2+0]},${arguments[i*2+1]}`)
    .join(" ");
};
const stringifyArgs = (...args) => [polyString(...coordinates(...flatten(...args)))];
const setPoints$1 = (element, ...args) => element
  .setAttribute("points", stringifyArgs(...args)[0]);
const addPoint = (element, ...args) => element
  .setAttribute("points", [getPoints(element), stringifyArgs(...args)[0]].filter(a => a !== "").join(" "));
var polys = {
  polyline: {
    args: stringifyArgs,
    methods: {
      setPoints: setPoints$1,
      addPoint
    }
  },
  polygon: {
    args: stringifyArgs,
    methods: {
      setPoints: setPoints$1,
      addPoint
    }
  }
};

var Spec = Object.assign({},
  circle,
  ellipse,
  line,
  path,
  rect,
  style,
  text,
  svg,
  maskTypes,
  polys,
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
  .filter(nodeName => NodeAttributes[nodeName] === undefined)
  .forEach(nodeName => { NodeAttributes[nodeName] = []; });
[ [["svg", "defs", "g"].concat(NodeNames.v, NodeNames.t), ManyElements.presentation],
  [["filter"], ManyElements.effects],
  [NodeNames.cT.concat("text"), ManyElements.text],
  [NodeNames.cF, ManyElements.effects],
  [NodeNames.cG, ManyElements.gradient],
].forEach(pair => pair[0].forEach(key => {
  NodeAttributes[key] = NodeAttributes[key].concat(pair[1]);
}));
Debug.log(NodeAttributes);

const getClassList = (element) => {
  if (element == null) { return []; }
  const currentClass = element.getAttribute(Keys.class);
  return (currentClass == null
    ? []
    : currentClass.split(" ").filter(s => s !== ""));
};
var classId = {
  addClass: (element, newClass) => {
    const classes = getClassList(element)
      .filter(c => c !== newClass);
    classes.push(newClass);
    element.setAttributeNS(null, Keys.class, classes.join(" "));
  },
  removeClass: (element, removedClass) => {
    const classes = getClassList(element)
      .filter(c => c !== removedClass);
    element.setAttributeNS(null, Keys.class, classes.join(" "));
  },
  setClass: (element, className) => {
    element.setAttributeNS(null, Keys.class, className);
  },
  setId: (element, idName) => {
    element.setAttributeNS(null, Keys.id, idName);
  }
};

const getAttr = (element) => {
  const t = element.getAttribute(Keys.transform);
  return (t == null || t === "") ? undefined : t;
};
const methods$3 = {
  clearTransform: (el) => { el.removeAttribute(Keys.transform); return el; }
};
["translate", "rotate", "scale", "matrix"].forEach(key => {
  methods$3[key] = (element, ...args) => element.setAttribute(
    Keys.transform,
    [getAttr(element), `${key}(${args.join(" ")})`]
      .filter(a => a !== undefined)
      .join(" "));
});

const findIdURL = function (arg) {
  if (arg == null) { return ""; }
  if (typeof arg === Keys.string) {
    return arg.slice(0, 3) === "url"
      ? arg
      : `url(#${arg})`;
  }
  if (arg.getAttribute != null) {
    const idString = arg.getAttribute(Keys.id);
    return `url(#${idString})`;
  }
  return "";
};
const methods$4 = {};
["clip-path",
  "mask",
  "symbol",
  "marker-end",
  "marker-mid",
  "marker-start",
].forEach(attr => {
  methods$4[Case.toCamel(attr)] = (element, parent) => element.setAttribute(attr, findIdURL(parent));
});

const Nodes = {};
NodeNames.v.push(...Object.keys(nodes));
Object.keys(nodes).forEach(node => {
  nodes[node].attributes = (nodes[node].attributes === undefined
    ? [...ManyElements.presentation]
    : nodes[node].attributes.concat(ManyElements.presentation));
});
Object.assign(Nodes, Spec, nodes);
Object.keys(NodeNames)
  .forEach(key => NodeNames[key]
    .filter(nodeName => Nodes[nodeName] === undefined)
    .forEach(nodeName => {
      Nodes[nodeName] = {};
    }));
const passthrough = function () { return Array.from(arguments); };
Object.keys(Nodes).forEach(key => {
  if (!Nodes[key].nodeName) { Nodes[key].nodeName = key; }
  if (!Nodes[key].init) { Nodes[key].init = passthrough; }
  if (!Nodes[key].args) { Nodes[key].args = passthrough; }
  if (!Nodes[key].methods) { Nodes[key].methods = {}; }
  if (!Nodes[key].attributes) {
    Nodes[key].attributes = NodeAttributes[key] || [];
  }
});
const assign = (groups, Methods) => {
  groups.forEach(n =>
    Object.keys(Methods).forEach(method => {
      Nodes[n].methods[method] = function () {
        Methods[method](...arguments);
        return arguments[0];
      };
    }));
};
assign(flatten(NodeNames.t, NodeNames.v, NodeNames.g, NodeNames.s, NodeNames.p, NodeNames.i, NodeNames.h, NodeNames.d), classId);
assign(flatten(NodeNames.t, NodeNames.v, NodeNames.g, NodeNames.s, NodeNames.p, NodeNames.i, NodeNames.h, NodeNames.d), DOM);
assign(flatten(NodeNames.v, NodeNames.g, NodeNames.s), methods$3);
assign(flatten(NodeNames.t, NodeNames.v, NodeNames.g), methods$4);
Debug.log(Nodes);

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
  const element = win.document.createElementNS(NS, Nodes[nodeName].nodeName);
  RequiredAttributes(element, nodeName);
  Nodes[nodeName].init(element, ...args);
  Nodes[nodeName].args(...args).forEach((v, i) => {
    if (Nodes[nodeName].attributes[i] != null) {
      element.setAttribute(Nodes[nodeName].attributes[i], v);
    }
  });
  Nodes[nodeName].attributes.forEach(attribute => {
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
        return Nodes[nodeName].methods[methodName].call(bound, element, ...arguments) || element;
      }
    }));
  if (nodesAndChildren[nodeName]) {
    nodesAndChildren[nodeName].forEach(childNode => {
      Object.defineProperty(element, childNode, {
        value: function () {
          const childElement = constructor(childNode, ...arguments);
          element.appendChild(childElement);
          return childElement;
        }
      });
    });
  }
  return element;
};
bound.Constructor = constructor;

const elements = {};
Object.keys(NodeNames).forEach(key => NodeNames[key]
  .forEach(nodeName => {
    elements[nodeName] = (...args) => constructor(nodeName, ...args);
  }));
Debug.log(elements);

const categories = {
  move: ["mousemove", "touchmove"],
  press: ["mousedown", "touchstart"],
  release: ["mouseup", "touchend"]
};
const handlerNames = Object.values(categories)
  .reduce((a,b) => a.concat(b), []);
const off = (element, handlers) => handlerNames.forEach(handlerName => {
  handlers[handlerName].forEach(func => element.removeEventListener(handlerName, func));
  handlers[handlerName] = [];
});
const defineGetter = (obj, prop, value) => Object.defineProperty(obj, prop, {
  get: () => value,
  enumerable: true
});
const TouchEvents = function (element) {
  let startPoint = [];
  const handlers = [];
  Object.keys(categories).forEach((key) => {
    categories[key].forEach((handler) => {
      handlers[handler] = [];
    });
  });
  const removeHandler = (category) => {
    categories[category].forEach(handlerName => {
      handlers[handlerName].forEach(func => element.removeEventListener(handlerName, func));
    });
  };
  const categoryUpdate = {
    press: () => {},
    release: () => {},
    move: (e, viewPoint) => {
      if (e.buttons > 0 && startPoint[0] === undefined) {
        startPoint = viewPoint;
      } else if(e.buttons === 0 && startPoint[0] !== undefined) {
        startPoint = [];
      }
      ["startX", "startY"].filter(prop => !e.hasOwnProperty(prop))
        .forEach((prop, i) => defineGetter(e, prop, startPoint[i]));
    }
  };
  Object.keys(categories).forEach(category => {
    const propName = "on" + Case.capitalized(category);
    Object.defineProperty(element, propName, {
      set: (handler) => (handler == null)
        ? removeHandler(category)
        : categories[category].forEach(handlerName => {
            const handlerFunc = (e) => {
              const pointer = (e.touches != null
                ? e.touches[0]
                : e);
              if (pointer !== undefined) {
                const viewPoint = convertToViewBox(element, pointer.clientX, pointer.clientY).map(n => isNaN(n) ? undefined : n);
                ["x", "y"]
                  .filter(prop => !e.hasOwnProperty(prop))
                  .forEach((prop, i) => defineGetter(e, prop, viewPoint[i]));
                categoryUpdate[category](e, viewPoint);
              }
              handler(e);
            };
            handlers[handlerName].push(handlerFunc);
            element.addEventListener(handlerName, handlerFunc);
          }),
      enumerable: true
    });
  });
  Object.defineProperty(element, "off", { value: () => off(element, handlers) });
};

const Animation = function (element) {
  let start;
  const handlers = {};
  let frame = 0;
  let requestId;
  const removeHandlers = () => {
    win.cancelAnimationFrame(requestId);
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
        }
        const progress = (e - start) * 0.001;
        handler({time: progress, frame: frame});
        frame += 1;
        if (handlers[uuid]) {
          requestId = win.requestAnimationFrame(handlers[uuid]);
        }
      };
      handlers[uuid] = handlerFunc;
      requestId = win.requestAnimationFrame(handlers[uuid]);
    },
    enumerable: true
  });
  Object.defineProperty(element, "stop", { value: removeHandlers, enumerable: true });
};

const distanceSq = (a, b) => [0, 1]
  .map(i => a[i] - b[i])
  .map(e => e ** 2)
  .reduce((a, b) => a + b, 0);
const removeFromParent = (svg) => (svg && svg.parentNode
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
    set: (target, property, value, receiver) => {
      target[property] = value;
      updateSVG();
      return true;
    }
  });
  const setPosition = function (...args) {
    coordinates(...flatten(...args))
      .forEach((n, i) => { position[i] = n; });
    updateSVG();
    if (typeof position.delegate === "function") {
      position.delegate.apply(position.pointsContainer, [proxy, position.pointsContainer]);
    }
  };
  position.delegate = undefined;
  position.setPosition = setPosition;
  position.onMouseMove = mouse => (cp.selected
    ? setPosition(cp.updatePosition(mouse))
    : undefined);
  position.onMouseUp = () => { cp.selected = false; };
  position.distance = mouse => Math.sqrt(distanceSq(mouse, position));
  ["x", "y"].forEach((prop, i) => Object.defineProperty(position, prop, {
    get: () => position[i],
    set: (v) => { position[i] = v; }
  }));
  ["svg", "updatePosition", "selected"].forEach(key => {
    Object.defineProperty(position, key, {
      get: () => cp[key],
      set: (v) => { cp[key] = v; }
    });
  });
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
  const protocol = point => (typeof delegate === "function"
    ? delegate.call(points, points, point)
    : undefined);
  points.forEach((p) => {
    p.delegate = protocol;
    p.pointsContainer = points;
  });
  const mousePressedHandler = function (mouse) {
    if (!(points.length > 0)) { return; }
    selected = points
      .map((p, i) => ({ i, d: distanceSq(p, [mouse.x, mouse.y]) }))
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
      if (runOnceAtStart === true) { func.call(points, points, undefined); }
    },
    position: func => points.forEach((p, i) => p.setPosition(func.call(points, i))),
    svg: func => points.forEach((p, i) => { p.svg = func.call(points, i); }),
  };
  Object.keys(functionalMethods).forEach(key => {
    points[key] = function () {
      if (typeof arguments[0] === "function") {
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

const initialize = function (svg, ...args) {
  args.filter(arg => typeof arg === Keys.function)
    .forEach(func => func.call(svg, svg));
};
const SVG = function () {
  const svg = constructor(Keys.svg, ...arguments);
  TouchEvents(svg);
  Animation(svg);
  applyControlsToSVG(svg);
  if (win.document.readyState === "loading") {
    win.document.addEventListener("DOMContentLoaded", () => initialize(svg, ...arguments));
  } else {
    initialize(svg, ...arguments);
  }
  return svg;
};
Object.assign(SVG, elements);
SVG.load = Load;
SVG.save = save;
SVG.NS = NS;

export default SVG;
