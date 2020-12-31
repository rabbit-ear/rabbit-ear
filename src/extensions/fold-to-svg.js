/* (c) Robby Kraft, MIT License */
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

const vertices = "vertices";
const edges = "edges";
const faces = "faces";
const boundaries = "boundaries";
const boundary = "boundary";
const mountain = "mountain";
const valley = "valley";
const mark = "mark";
const unassigned = "unassigned";
const creasePattern = "creasePattern";
const front = "front";
const back = "back";
const svg = "svg";
const _class = "class";
const index = "index";
const object = "object";
const string = "string";
const _function = "function";
const _undefined = "undefined";
const black = "black";
const white = "white";
const lightgray = "lightgray";
const stroke_width = "stroke-width";
const createElementNS = "createElementNS";
const setAttributeNS = "setAttributeNS";
const appendChild = "appendChild";
const vertices_coords = "vertices_coords";
const edges_vertices = "edges_vertices";
const faces_vertices = "faces_vertices";
const faces_edges = "faces_edges";
const edges_assignment = "edges_assignment";
const faces_re_layer = "faces_re:layer";
const frame_classes = "frame_classes";
const file_classes = "file_classes";
const foldedForm = "foldedForm";

const isBrowser = typeof window !== _undefined
  && typeof window.document !== _undefined;
const isNode = typeof process !== _undefined
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

const NS = "http://www.w3.org/2000/svg";
const g = () => win.document[createElementNS](NS, "g");
const defs = () => win.document[createElementNS](NS, "defs");
const style = function () {
  const s = win.document[createElementNS](NS, "style");
  s[setAttributeNS](null, "type", "text/css");
  return s;
};
const line = function (x1, y1, x2, y2) {
  const shape = win.document[createElementNS](NS, "line");
  shape[setAttributeNS](null, "x1", x1);
  shape[setAttributeNS](null, "y1", y1);
  shape[setAttributeNS](null, "x2", x2);
  shape[setAttributeNS](null, "y2", y2);
  return shape;
};
const circle = function (x, y, radius) {
  const shape = win.document[createElementNS](NS, "circle");
  shape[setAttributeNS](null, "cx", x);
  shape[setAttributeNS](null, "cy", y);
  shape[setAttributeNS](null, "r", radius);
  return shape;
};
const polygon = function (pointsArray) {
  const shape = win.document[createElementNS](NS, "polygon");
  const pointsString = pointsArray.map(p => `${p[0]},${p[1]}`).join(" ");
  shape[setAttributeNS](null, "points", pointsString);
  return shape;
};
const path = function (d) {
  const p = win.document[createElementNS](NS, "path");
  p[setAttributeNS](null, "d", d);
  return p;
};
const SVG = {
  NS,
  g,
  defs,
  style,
  line,
  circle,
  polygon,
  path,
};

const libraries = {
  SVG,
};

const linker = function (parent) {
};

const use = (library) => {
  if (library.NS) {
    libraries.SVG = library;
  }
};

const recursive_freeze = function (input) {
  Object.freeze(input);
  if (input === undefined) {
    return input;
  }
  Object.getOwnPropertyNames(input).filter(prop => input[prop] !== null
    && (typeof input[prop] === object || typeof input[prop] === _function)
    && !Object.isFrozen(input[prop]))
    .forEach(prop => recursive_freeze(input[prop]));
  return input;
};
const recursive_assign = (target, source) => {
  Object.keys(source).forEach((key) => {
    if (typeof source[key] === object && source[key] !== null) {
      if (!(key in target)) { target[key] = {}; }
      recursive_assign(target[key], source[key]);
    } else if (typeof target === object && !(key in target)) {
      target[key] = source[key];
    }
  });
  return target;
};
const get_object = (input) => {
  if (input == null) {
    return {};
  }
  if (typeof input === object && input !== null) {
    return input;
  }
  if (typeof input === string || input instanceof String) {
    try {
      const obj = JSON.parse(input);
      return obj;
    } catch (error) {
      return {};
    }
  }
  return {};
};

const make_vertices_edges = function (graph) {
  if (!graph[edges_vertices]) { return undefined; }
  const vertices_edges = [];
  graph[edges_vertices].forEach((ev, i) => ev
    .forEach((v) => {
      if (vertices_edges[v] === undefined) {
        vertices_edges[v] = [];
      }
      vertices_edges[v].push(i);
    }));
  return vertices_edges;
};
const bounding_rect = function (graph) {
  if (graph[vertices_coords] == null
    || graph[vertices_coords].length <= 0) {
    return [0, 0, 0, 0];
  }
  const dimension = graph[vertices_coords][0].length;
  const min = Array(dimension).fill(Infinity);
  const max = Array(dimension).fill(-Infinity);
  graph[vertices_coords].forEach(v => v.forEach((n, i) => {
    if (n < min[i]) { min[i] = n; }
    if (n > max[i]) { max[i] = n; }
  }));
  return (isNaN(min[0]) || isNaN(min[1]) || isNaN(max[0]) || isNaN(max[1])
    ? [0, 0, 0, 0]
    : [min[0], min[1], max[0] - min[0], max[1] - min[1]]);
};
const get_boundary = function (graph) {
  if (graph[edges_assignment] == null) { return { vertices: [], edges: [] }; }
  const edges_vertices_b = graph[edges_assignment]
    .map(a => a === "B" || a === "b");
  const vertices_edges = make_vertices_edges(graph);
  const edge_walk = [];
  const vertex_walk = [];
  let edgeIndex = -1;
  for (let i = 0; i < edges_vertices_b.length; i += 1) {
    if (edges_vertices_b[i]) { edgeIndex = i; break; }
  }
  if (edgeIndex === -1) {
    return { vertices: [], edges: [] };
  }
  edges_vertices_b[edgeIndex] = false;
  edge_walk.push(edgeIndex);
  vertex_walk.push(graph[edges_vertices][edgeIndex][0]);
  let nextVertex = graph[edges_vertices][edgeIndex][1];
  while (vertex_walk[0] !== nextVertex) {
    vertex_walk.push(nextVertex);
    edgeIndex = vertices_edges[nextVertex]
      .filter(v => edges_vertices_b[v])
      .shift();
    if (edgeIndex === undefined) { return { vertices: [], edges: [] }; }
    if (graph[edges_vertices][edgeIndex][0] === nextVertex) {
      [, nextVertex] = graph[edges_vertices][edgeIndex];
    } else {
      [nextVertex] = graph[edges_vertices][edgeIndex];
    }
    edges_vertices_b[edgeIndex] = false;
    edge_walk.push(edgeIndex);
  }
  return {
    vertices: vertex_walk,
    edges: edge_walk,
  };
};

const none = "none";
const five_hundred_px = "500px";
var Options = (vmin = 1) => recursive_freeze({
  input: string,
  output: string,
  padding: null,
  file_frame: null,
  stylesheet: null,
  shadows: null,
  boundaries: true,
  faces: true,
  edges: true,
  vertices: false,
  attributes: {
    svg: {
      width: five_hundred_px,
      height: five_hundred_px,
      stroke: black,
      fill: none,
      "stroke-linejoin": "bevel",
      "stroke-width": vmin / 200,
    },
    circle: {
      r: vmin / 200,
    },
    boundaries: {
      fill: white,
    },
    faces: {
      stroke: none,
      front: { fill: lightgray },
      back: { fill: white },
      foldedForm: { stroke: black },
    },
    edges: {
      boundary: {},
      mountain: { stroke: "red" },
      valley: { stroke: "blue" },
      mark: { stroke: lightgray },
      unassigned: { stroke: lightgray },
    },
    vertices: {
      stroke: none,
      fill: black,
    }
  }
});

const make_options = (graph = {}, options = {}) => {
  const bounds = bounding_rect(graph);
  const vmin = Math.min(bounds[2], bounds[3]);
  recursive_assign(options, Options(vmin));
  if (options.shadows) {
    recursive_assign(options, { attributes: { faces: {
      front: { filter: "url(#shadow)" },
      back: { filter: "url(#shadow)" },
    }}});
  }
  return options;
};

const boundaries_polygon = (graph) => {
  if (vertices_coords in graph === false
    || edges_vertices in graph === false
    || edges_assignment in graph === false) {
    return [];
  }
  const boundary$1 = get_boundary(graph)
    .vertices
    .map(v => [0, 1].map(i => graph[vertices_coords][v][i]));
  if (boundary$1.length === 0) { return []; }
  const p = libraries.SVG.polygon(boundary$1);
  p[setAttributeNS](null, _class, boundary);
  return [p];
};

const vertices_circle = function (graph, options) {
  if (vertices_coords in graph === false) {
    return [];
  }
  const svg_vertices = graph[vertices_coords]
    .map(v => libraries.SVG.circle(v[0], v[1], 0.01));
  svg_vertices.forEach((c, i) => c[setAttributeNS](null, index, i));
  return svg_vertices;
};

const edges_assignment_names = {
  B: boundary,
  b: boundary,
  M: mountain,
  m: mountain,
  V: valley,
  v: valley,
  F: mark,
  f: mark,
  U: unassigned,
  u: unassigned
};
const edges_assignment_to_lowercase = {
  B: "b",
  b: "b",
  M: "m",
  m: "m",
  V: "v",
  v: "v",
  F: "f",
  f: "f",
  U: "u",
  u: "u",
};
const edges_coords = function (graph) {
  if (graph[edges_vertices] == null || graph[vertices_coords] == null) {
    return [];
  }
  return graph[edges_vertices].map(ev => ev.map(v => graph[vertices_coords][v]));
};
const edges_indices_classes = function (graph) {
  const assignment_indices = { u:[], f:[], v:[], m:[], b:[] };
  graph[edges_assignment].map(a => edges_assignment_to_lowercase[a])
    .forEach((a, i) => assignment_indices[a].push(i));
  return assignment_indices;
};
const make_edges_assignment_names = function (graph) {
  return (graph[edges_vertices] == null || graph[edges_assignment] == null
    || graph[edges_vertices].length !== graph[edges_assignment].length
    ? []
    : graph[edges_assignment].map(a => edges_assignment_names[a]));
};
const segment_to_path = function (s) {
  return `M${s[0][0]} ${s[0][1]}L${s[1][0]} ${s[1][1]}`;
};
const edges_path_data = function (graph) {
  const path_data = edges_coords(graph).map(segment => segment_to_path(segment)).join("");
  return path_data === "" ? undefined : path_data;
};
const edges_by_assignment_paths_data = function (graph) {
  if (graph[edges_vertices] == null
    || graph[vertices_coords] == null
    || graph[edges_assignment] == null) {
    return [];
  }
  const segments = edges_coords(graph);
  const assignment_sorted_edges = edges_indices_classes(graph);
  const paths = Object.keys(assignment_sorted_edges)
    .map(assignment => assignment_sorted_edges[assignment].map(i => segments[i]))
    .map(segments => segments.map(segment => segment_to_path(segment)).join(""));
  const result = {};
  Object.keys(assignment_sorted_edges).map((key, i) => {
    if (paths[i] !== "") {
      result[key] = paths[i];
    }
  });
  return result;
};
const edges_path = function (graph) {
  if (graph[edges_assignment] == null) {
    const d = edges_path_data(graph);
    return d === undefined ? [] : [libraries.SVG.path(d)];
  }
  const ds = edges_by_assignment_paths_data(graph);
  return Object.keys(ds).map(assignment => {
    const p = libraries.SVG.path(ds[assignment]);
    p[setAttributeNS](null, _class, edges_assignment_names[assignment]);
    return p;
  });
};
const edges_line = function (graph) {
  const lines = edges_coords(graph).map(e => libraries.SVG.line(e[0][0], e[0][1], e[1][0], e[1][1]));
  lines.forEach((l, i) => l[setAttributeNS](null, index, i));
  make_edges_assignment_names(graph)
    .forEach((a, i) => lines[i][setAttributeNS](null, _class, a));
  return lines;
};

var subtract = function subtract(v, u) {
  return v.map(function (n, i) {
    return n - (u[i] || 0);
  });
};
var cross2 = function cross2(a, b) {
  return a[0] * b[1] - a[1] * b[0];
};
var math = {
  core: {
    subtract: subtract,
    cross2: cross2,
  }
};

const get_faces_winding = (graph) => graph
  .faces_vertices
  .map(fv => fv.map(v => graph.vertices_coords[v])
    .map((c, i, arr) => [c, arr[(i + 1) % arr.length], arr[(i + 2) % arr.length]])
    .map(tri => math.core.cross2(
      math.core.subtract(tri[1], tri[0]),
      math.core.subtract(tri[2], tri[1]),
    )).reduce((a, b) => a + b, 0));
const faces_sorted_by_layer = function (faces_layer) {
  return faces_layer.map((layer, i) => ({ layer, i }))
    .sort((a, b) => a.layer - b.layer)
    .map(el => el.i);
};
const finalize_faces = function (graph, svg_faces) {
  const isFoldedForm = typeof graph.frame_classes === object
    && graph.frame_classes !== null
    && !(graph.frame_classes.includes(creasePattern));
  const orderIsCertain = graph[faces_re_layer] != null
    && graph[faces_re_layer].length === graph[faces_vertices].length;
  const classNames = [ [front], [back] ]
    .map(arr => {
      if (isFoldedForm) { arr.push("foldedForm"); }
      return arr;
    }).map(arr => arr.join(" "));
  get_faces_winding(graph)
    .map(c => (c < 0 ? classNames[0] : classNames[1]))
    .forEach((className, i) => svg_faces[i][setAttributeNS](null, _class, className));
  return (orderIsCertain
    ? faces_sorted_by_layer(graph[faces_re_layer]).map(i => svg_faces[i])
    : svg_faces);
};
const faces_vertices_polygon = function (graph) {
  if (faces_vertices in graph === false
    || vertices_coords in graph === false) {
    return [];
  }
  const svg_faces = graph[faces_vertices]
    .map(fv => fv.map(v => [0, 1].map(i => graph[vertices_coords][v][i])))
    .map(face => libraries.SVG.polygon(face));
  svg_faces.forEach((face, i) => face[setAttributeNS](null, index, i));
  return finalize_faces(graph, svg_faces);
};
const faces_edges_polygon = function (graph) {
  if (faces_edges in graph === false
    || edges_vertices in graph === false
    || vertices_coords in graph === false) {
    return [];
  }
  const svg_faces = graph[faces_edges]
    .map(face_edges => face_edges
      .map(edge => graph[edges_vertices][edge])
      .map((vi, i, arr) => {
        const next = arr[(i + 1) % arr.length];
        return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
      }).map(v => [0, 1].map(i => graph[vertices_coords][v][i])))
    .map(face => libraries.SVG.polygon(face));
  svg_faces.forEach((face, i) => face[setAttributeNS](null, index, i));
  return finalize_faces(graph, svg_faces);
};

const component_classes = {
  vertices: [],
  edges: [unassigned, mark, valley, mountain, boundary],
  faces: [front, back, foldedForm],
  boundaries: [],
};
const style_component = (group, { attributes }, component) => {
  const classes = component_classes[component] || [];
  Array.from(group.childNodes)
    .filter(child => attributes[child.nodeName])
    .forEach(child => Object.keys(attributes[child.nodeName])
      .forEach(attr => child[setAttributeNS](null, attr, attributes[child.nodeName][attr])));
  Object.keys(attributes[component])
    .filter(key => !classes.includes(key))
    .forEach(key => group[setAttributeNS](null, key, attributes[component][key]));
  if (classes.length === 0) { return; }
  Array.from(group.childNodes)
    .forEach(child => Object.keys(attributes[component][child.getAttribute(_class)] || {})
      .forEach(key => child[setAttributeNS](null, key, attributes[component][child.getAttribute(_class)][key])));
};

const faces_draw_function = graph => (graph[faces_vertices] != null
  ? faces_vertices_polygon(graph)
  : faces_edges_polygon(graph));
const draw_func = {
  vertices: vertices_circle,
  edges: edges_path,
  faces: faces_draw_function,
  boundaries: boundaries_polygon
};
const render_components = (graph, options = {}) => {
  if (!options.attributes) {
    options.attributes = {};
  }
  return [boundaries, faces, edges, vertices]
  .filter(key => options[key] === true)
  .map(key => {
    const group = libraries.SVG.g();
    group[setAttributeNS](null, _class, key);
    draw_func[key](graph, options)
      .forEach(a => group[appendChild](a));
    style_component(group, options, key);
    return group;
  })
  .filter(group => group.childNodes.length > 0);
};

const { document } = win;
const shadow_defaults = Object.freeze({
  blur: 0.005,
  opacity: 0.3,
  color: black,
});
const result = "result";
const _in = "in";
const blur = "blur";
const offsetColor = "offsetColor";
const offsetBlur = "offsetBlur";
const feMergeNode = "feMergeNode";
const two_hundred = "200%";
const shadowFilter = function (options = shadow_defaults) {
  const id_name = "shadow";
  if (typeof options !== object || options === null) { options = {}; }
  Object.keys(shadow_defaults)
    .filter(key => !(key in options))
    .forEach((key) => { options[key] = shadow_defaults[key]; });
  const filter = document[createElementNS](libraries.SVG.NS, "filter");
  filter[setAttributeNS](null, "width", two_hundred);
  filter[setAttributeNS](null, "height", two_hundred);
  filter[setAttributeNS](null, "id", id_name);
  const gaussian = document[createElementNS](libraries.SVG.NS, "feGaussianBlur");
  gaussian[setAttributeNS](null, _in, "SourceAlpha");
  gaussian[setAttributeNS](null, "stdDeviation", options.blur);
  gaussian[setAttributeNS](null, result, blur);
  const offset = document[createElementNS](libraries.SVG.NS, "feOffset");
  offset[setAttributeNS](null, _in, blur);
  offset[setAttributeNS](null, result, offsetBlur);
  const flood = document[createElementNS](libraries.SVG.NS, "feFlood");
  flood[setAttributeNS](null, "flood-color", options.color);
  flood[setAttributeNS](null, "flood-opacity", options.opacity);
  flood[setAttributeNS](null, result, offsetColor);
  const composite = document[createElementNS](libraries.SVG.NS, "feComposite");
  composite[setAttributeNS](null, _in, offsetColor);
  composite[setAttributeNS](null, "in2", offsetBlur);
  composite[setAttributeNS](null, "operator", _in);
  composite[setAttributeNS](null, result, offsetBlur);
  const merge = document[createElementNS](libraries.SVG.NS, "feMerge");
  const mergeNode1 = document[createElementNS](libraries.SVG.NS, feMergeNode);
  const mergeNode2 = document[createElementNS](libraries.SVG.NS, feMergeNode);
  mergeNode2[setAttributeNS](null, _in, "SourceGraphic");
  merge[appendChild](mergeNode1);
  merge[appendChild](mergeNode2);
  filter[appendChild](gaussian);
  filter[appendChild](offset);
  filter[appendChild](flood);
  filter[appendChild](composite);
  filter[appendChild](merge);
  return filter;
};

const make_defs = (graph, options) => {
  const bounds = bounding_rect(graph);
  const vmin = Math.min(bounds[2], bounds[3]);
  const defs = libraries.SVG.defs();
  if (options.stylesheet != null) {
    const style = libraries.SVG.style();
    defs[appendChild](style);
    const strokeVar = options.attributes.svg[stroke_width]
      ? options.attributes.svg[stroke_width] : vmin / 200;
    const cdata = (new win.DOMParser())
      .parseFromString("<xml></xml>", "application/xml")
      .createCDATASection(`\n* { --${stroke_width}: ${strokeVar}; }\n${options.stylesheet}`);
    style[appendChild](cdata);
  }
  if (options.shadows != null) {
    const shadowOptions = (typeof options.shadows === object && options.shadows !== null
      ? options.shadows
      : { blur: vmin / 200 });
    defs[appendChild](shadowFilter(shadowOptions));
  }
  return (options.stylesheet != null || options.shadows != null
    ? defs
    : undefined);
};

const graph_classes = function (graph) {
  const file_classes$1 = (graph[file_classes] != null
    ? graph[file_classes] : []).join(" ");
  const frame_classes$1 = (graph[frame_classes] != null
    ? graph[frame_classes] : []).join(" ");
  return [file_classes$1, frame_classes$1]
    .filter(s => s !== "")
    .join(" ");
};

const makeViewBox = function (x, y, width, height, padding = 0) {
  const scale = 1.0;
  const d = (width / scale) - width;
  const X = (x - d) - padding;
  const Y = (y - d) - padding;
  const W = (width + d * 2) + padding * 2;
  const H = (height + d * 2) + padding * 2;
  return [X, Y, W, H].join(" ");
};
const make_svg_attributes = (graph, options) => {
  const bounds = bounding_rect(graph);
  const vmin = Math.min(bounds[2], bounds[3]);
  const attributes = {
    viewBox: makeViewBox(...bounds, options.padding),
  };
  const classValue = graph_classes(graph);
  if (classValue !== "") {
    attributes[_class] = classValue;
  }
  Object.assign(attributes, options.attributes.svg);
  return attributes;
};

const render_into_svg = (svg, graph = {}, options = {}) => {
  make_options(graph, options);
  const defs = make_defs(graph, options);
  if (defs) { svg[appendChild](defs); }
  render_components(graph, options)
    .forEach(group => svg[appendChild](group));
  const attrs = make_svg_attributes(graph, options);
  Object.keys(attrs).forEach(attr => svg[setAttributeNS](null, attr, attrs[attr]));
  return svg;
};

const svg$1 = () => {
  const svgImage = win.document[createElementNS](libraries.SVG.NS, svg);
  svgImage.setAttribute("version", "1.1");
  svgImage.setAttribute("xmlns", libraries.SVG.NS);
  return svgImage;
};
const FoldToSvg = (arg, options = {}) => {
  const graph = get_object(arg);
  make_options(graph, options);
  const element = render_into_svg(svg$1(), graph, options);
  if (options.output === svg) { return element; }
  const stringified = (new win.XMLSerializer()).serializeToString(element);
  const beautified = vkXML(stringified);
  return beautified;
};
Object.assign(FoldToSvg, {
  render_into_svg,
  render_components,
  options: make_options,
  boundaries_polygon,
  vertices_circle,
  edges_path_data,
  edges_by_assignment_paths_data,
  edges_path,
  edges_line,
  faces_vertices_polygon,
  faces_edges_polygon,
  linker: linker.bind(FoldToSvg),
  use,
});

export default FoldToSvg;
