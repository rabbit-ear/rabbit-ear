/* (c) Robby Kraft, MIT License */
const isBrowser = typeof window !== "undefined"
  && typeof window.document !== "undefined";
const isNode = typeof process !== "undefined"
  && process.versions != null
  && process.versions.node != null;
const htmlString = "<!DOCTYPE html><title> </title>";
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
const svgNS = "http://www.w3.org/2000/svg";
const svg = function () {
  const svgImage = win.document.createElementNS(svgNS, "svg");
  svgImage.setAttribute("version", "1.1");
  svgImage.setAttribute("xmlns", svgNS);
  return svgImage;
};
const group = function (parent) {
  const g = win.document.createElementNS(svgNS, "g");
  if (parent) { parent.appendChild(g); }
  return g;
};
const defs = function (parent) {
  const defs = win.document.createElementNS(svgNS, "defs");
  if (parent) { parent.appendChild(defs); }
  return defs;
};
const style = function (parent) {
  const s = win.document.createElementNS(svgNS, "style");
  s.setAttribute("type", "text/css");
  if (parent) { parent.appendChild(s); }
  return s;
};
const setViewBox = function (SVG, x, y, width, height, padding = 0) {
  const scale = 1.0;
  const d = (width / scale) - width;
  const X = (x - d) - padding;
  const Y = (y - d) - padding;
  const W = (width + d * 2) + padding * 2;
  const H = (height + d * 2) + padding * 2;
  const viewBoxString = [X, Y, W, H].join(" ");
  SVG.setAttributeNS(null, "viewBox", viewBoxString);
};
const line = function (x1, y1, x2, y2) {
  const shape = win.document.createElementNS(svgNS, "line");
  shape.setAttributeNS(null, "x1", x1);
  shape.setAttributeNS(null, "y1", y1);
  shape.setAttributeNS(null, "x2", x2);
  shape.setAttributeNS(null, "y2", y2);
  return shape;
};
const circle = function (x, y, radius) {
  const shape = win.document.createElementNS(svgNS, "circle");
  shape.setAttributeNS(null, "cx", x);
  shape.setAttributeNS(null, "cy", y);
  shape.setAttributeNS(null, "r", radius);
  return shape;
};
const polygon = function (pointsArray) {
  const shape = win.document.createElementNS(svgNS, "polygon");
  const pointsString = pointsArray.map(p => `${p[0]},${p[1]}`).join(" ");
  shape.setAttributeNS(null, "points", pointsString);
  return shape;
};
const path = function (d) {
  const p = win.document.createElementNS(svgNS, "path");
  p.setAttributeNS(null, "d", d);
  return p;
};
const is_iterable = obj => obj != null
  && typeof obj[Symbol.iterator] === "function";
const flatten_input = function (...args) {
  switch (args.length) {
    case undefined:
    case 0: return args;
    case 1: return is_iterable(args[0]) && typeof args[0] !== "string"
      ? flatten_input(...args[0])
      : [args[0]];
    default:
      return Array.from(args)
        .map(a => (is_iterable(a)
          ? [...flatten_input(a)]
          : a))
        .reduce((a, b) => a.concat(b), []);
  }
};
const setPoints = function (shape, ...pointsArray) {
  const flat = flatten_input(...pointsArray);
  let pointsString = "";
  if (typeof flat[0] === "number") {
    pointsString = Array.from(Array(Math.floor(flat.length / 2)))
      .reduce((a, b, i) => `${a}${flat[i * 2]},${flat[i * 2 + 1]} `, "");
  }
  if (typeof flat[0] === "object") {
    if (typeof flat[0].x === "number") {
      pointsString = flat.reduce((prev, curr) => `${prev}${curr.x},${curr.y} `, "");
    }
    if (typeof flat[0][0] === "number") {
      pointsString = flat.reduce((prev, curr) => `${prev}${curr[0]},${curr[1]} `, "");
    }
  }
  shape.setAttributeNS(null, "points", pointsString);
  return shape;
};
const setArrowPoints = function (shape, ...args) {
  const children = Array.from(shape.childNodes);
  const path = children.filter(node => node.tagName === "path").shift();
  const polys = ["svg-arrow-head", "svg-arrow-tail"]
    .map(c => children.filter(n => n.getAttribute("class") === c).shift());
  const flat = flatten_input(...args);
  let endpoints = [];
  if (typeof flat[0] === "number") {
    endpoints = flat;
  }
  if (typeof flat[0] === "object") {
    if (typeof flat[0].x === "number") {
      endpoints = flat.map(p => [p[0], p[1]]).reduce((a, b) => a.concat(b), []);
    }
    if (typeof flat[0][0] === "number") {
      endpoints = flat.reduce((a, b) => a.concat(b), []);
    }
  }
  if (!endpoints.length && shape.endpoints != null) {
    endpoints = shape.endpoints;
  }
  if (!endpoints.length) { return shape; }
  shape.endpoints = endpoints;
  const o = shape.options;
  let tailPt = [endpoints[0], endpoints[1]];
  let headPt = [endpoints[2], endpoints[3]];
  let vector = [headPt[0] - tailPt[0], headPt[1] - tailPt[1]];
  let midpoint = [tailPt[0] + vector[0] / 2, tailPt[1] + vector[1] / 2];
  const len = Math.sqrt((vector[0] ** 2) + (vector[1] ** 2));
  const minLength = (
    (o.tail.visible ? (1 + o.tail.padding) * o.tail.height * 2.5 : 0)
  + (o.head.visible ? (1 + o.head.padding) * o.head.height * 2.5 : 0)
  );
  if (len < minLength) {
    const minVec = len === 0
      ? [minLength, 0]
      : [vector[0] / len * minLength, vector[1] / len * minLength];
    tailPt = [midpoint[0] - minVec[0] * 0.5, midpoint[1] - minVec[1] * 0.5];
    headPt = [midpoint[0] + minVec[0] * 0.5, midpoint[1] + minVec[1] * 0.5];
    vector = [headPt[0] - tailPt[0], headPt[1] - tailPt[1]];
  }
  let perpendicular = [vector[1], -vector[0]];
  let bezPoint = [
    midpoint[0] + perpendicular[0] * o.curve,
    midpoint[1] + perpendicular[1] * o.curve
  ];
  const bezTail = [bezPoint[0] - tailPt[0], bezPoint[1] - tailPt[1]];
  const bezHead = [bezPoint[0] - headPt[0], bezPoint[1] - headPt[1]];
  const bezTailLen = Math.sqrt((bezTail[0] ** 2) + (bezTail[1] ** 2));
  const bezHeadLen = Math.sqrt((bezHead[0] ** 2) + (bezHead[1] ** 2));
  const bezTailNorm = bezTailLen === 0
    ? bezTail
    : [bezTail[0] / bezTailLen, bezTail[1] / bezTailLen];
  const bezHeadNorm = bezTailLen === 0
    ? bezHead
    : [bezHead[0] / bezHeadLen, bezHead[1] / bezHeadLen];
  const tailVector = [-bezTailNorm[0], -bezTailNorm[1]];
  const headVector = [-bezHeadNorm[0], -bezHeadNorm[1]];
  const tailNormal = [tailVector[1], -tailVector[0]];
  const headNormal = [headVector[1], -headVector[0]];
  const tailArc = [
    tailPt[0] + bezTailNorm[0] * o.tail.height * ((o.tail.visible ? 1 : 0) + o.tail.padding),
    tailPt[1] + bezTailNorm[1] * o.tail.height * ((o.tail.visible ? 1 : 0) + o.tail.padding)
  ];
  const headArc = [
    headPt[0] + bezHeadNorm[0] * o.head.height * ((o.head.visible ? 1 : 0) + o.head.padding),
    headPt[1] + bezHeadNorm[1] * o.head.height * ((o.head.visible ? 1 : 0) + o.head.padding)
  ];
  vector = [headArc[0] - tailArc[0], headArc[1] - tailArc[1]];
  perpendicular = [vector[1], -vector[0]];
  midpoint = [tailArc[0] + vector[0] / 2, tailArc[1] + vector[1] / 2];
  bezPoint = [
    midpoint[0] + perpendicular[0] * o.curve,
    midpoint[1] + perpendicular[1] * o.curve
  ];
  const tailControl = [
    tailArc[0] + (bezPoint[0] - tailArc[0]) * o.pinch,
    tailArc[1] + (bezPoint[1] - tailArc[1]) * o.pinch
  ];
  const headControl = [
    headArc[0] + (bezPoint[0] - headArc[0]) * o.pinch,
    headArc[1] + (bezPoint[1] - headArc[1]) * o.pinch
  ];
  const tailPolyPts = [
    [tailArc[0] + tailNormal[0] * -o.tail.width, tailArc[1] + tailNormal[1] * -o.tail.width],
    [tailArc[0] + tailNormal[0] * o.tail.width, tailArc[1] + tailNormal[1] * o.tail.width],
    [tailArc[0] + tailVector[0] * o.tail.height, tailArc[1] + tailVector[1] * o.tail.height]
  ];
  const headPolyPts = [
    [headArc[0] + headNormal[0] * -o.head.width, headArc[1] + headNormal[1] * -o.head.width],
    [headArc[0] + headNormal[0] * o.head.width, headArc[1] + headNormal[1] * o.head.width],
    [headArc[0] + headVector[0] * o.head.height, headArc[1] + headVector[1] * o.head.height]
  ];
  path.setAttribute("d", `M${tailArc[0]},${tailArc[1]}C${tailControl[0]},${tailControl[1]},${headControl[0]},${headControl[1]},${headArc[0]},${headArc[1]}`);
  if (o.head.visible) {
    polys[0].removeAttribute("display");
    setPoints(polys[0], headPolyPts);
  } else {
    polys[0].setAttribute("display", "none");
  }
  if (o.tail.visible) {
    polys[1].removeAttribute("display");
    setPoints(polys[1], tailPolyPts);
  } else {
    polys[1].setAttribute("display", "none");
  }
  return shape;
};
const attachArrowMethods = function (element) {
  element.head = (options) => {
    if (typeof options === "object") {
      Object.assign(element.options.head, options);
      if (options.visible === undefined) {
        element.options.head.visible = true;
      }
    } else if (typeof options === "boolean") {
      element.options.head.visible = options;
    } else if (options == null) {
      element.options.head.visible = true;
    }
    setArrowPoints(element);
    return element;
  };
  element.tail = (options) => {
    if (typeof options === "object") {
      Object.assign(element.options.tail, options);
      if (options.visible === undefined) {
        element.options.tail.visible = true;
      }
      element.options.tail.visible = true;
    } else if (typeof options === "boolean") {
      element.options.tail.visible = options;
    } else if (options == null) {
      element.options.tail.visible = true;
    }
    setArrowPoints(element);
    return element;
  };
  element.curve = (amount) => {
    element.options.curve = amount;
    setArrowPoints(element);
    return element;
  };
  element.pinch = (amount) => {
    element.options.pinch = amount;
    setArrowPoints(element);
    return element;
  };
};
const arrow = function (...args) {
  const shape = win.document.createElementNS(svgNS, "g");
  const tailPoly = win.document.createElementNS(svgNS, "polygon");
  const headPoly = win.document.createElementNS(svgNS, "polygon");
  const arrowPath = win.document.createElementNS(svgNS, "path");
  tailPoly.setAttributeNS(null, "class", "svg-arrow-tail");
  headPoly.setAttributeNS(null, "class", "svg-arrow-head");
  arrowPath.setAttributeNS(null, "class", "svg-arrow-path");
  tailPoly.setAttributeNS(null, "style", "stroke: none;");
  headPoly.setAttributeNS(null, "style", "stroke: none;");
  arrowPath.setAttributeNS(null, "style", "fill: none;");
  shape.appendChild(arrowPath);
  shape.appendChild(tailPoly);
  shape.appendChild(headPoly);
  shape.options = {
    head: { width: 0.5, height: 2, visible: false, padding: 0.0 },
    tail: { width: 0.5, height: 2, visible: false, padding: 0.0 },
    curve: 0.0,
    pinch: 0.618,
    endpoints: [],
  };
  setArrowPoints(shape, ...args);
  attachArrowMethods(shape);
  shape.stroke = (...a) => { shape.setAttributeNS(null, "stroke", ...a); return shape; };
  shape.fill = (...a) => { shape.setAttributeNS(null, "fill", ...a); return shape; };
  shape.strokeWidth = (...a) => { shape.setAttributeNS(null, "stroke-width", ...a); return shape; };
  shape.setPoints = (...a) => setArrowPoints(shape, ...a);
  return shape;
};
const vertices_circle = function (graph, options) {
  if ("vertices_coords" in graph === false) {
    return [];
  }
  const radius = options && options.radius ? options.radius : 0.01;
  const svg_vertices = graph.vertices_coords
    .map(v => circle(v[0], v[1], radius));
  svg_vertices.forEach((c, i) => c.setAttribute("index", i));
  return svg_vertices;
};
const edges_assignment_names = {
  B: "boundary",
  b: "boundary",
  M: "mountain",
  m: "mountain",
  V: "valley",
  v: "valley",
  F: "mark",
  f: "mark",
  U: "unassigned",
  u: "unassigned",
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
const edges_coords = function ({ vertices_coords, edges_vertices }) {
  if (edges_vertices == null || vertices_coords == null) {
    return [];
  }
  return edges_vertices.map(ev => ev.map(v => vertices_coords[v]));
};
const edges_indices_classes = function ({ edges_assignment }) {
  const assignment_indices = { u:[], f:[], v:[], m:[], b:[] };
  edges_assignment.map(a => edges_assignment_to_lowercase[a])
    .forEach((a, i) => assignment_indices[a].push(i));
  return assignment_indices;
};
const make_edges_assignment_names = function (graph) {
  return (graph.edges_vertices == null || graph.edges_assignment == null
    || graph.edges_vertices.length !== graph.edges_assignment.length
    ? []
    : graph.edges_assignment.map(a => edges_assignment_names[a]));
};
const segment_to_path = function (s) {
  return `M${s[0][0]} ${s[0][1]}L${s[1][0]} ${s[1][1]}`;
};
const edges_path_data = function (graph) {
  const path_data = edges_coords(graph).map(segment => segment_to_path(segment)).join("");
  return path_data === "" ? undefined : path_data;
};
const edges_by_assignment_paths_data = function (graph) {
  if (graph.edges_vertices == null
    || graph.vertices_coords == null
    || graph.edges_assignment == null) {
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
  if (graph.edges_assignment == null) {
    const d = edges_path_data(graph);
    return d === undefined ? [] : [path(d)];
  }
  const ds = edges_by_assignment_paths_data(graph);
  return Object.keys(ds).map(assignment => {
    const p = path(ds[assignment]);
    p.setAttributeNS(null, "class", edges_assignment_names[assignment]);
    return p;
  });
};
const edges_line = function (graph) {
  const lines = edges_coords(graph).map(e => line(e[0][0], e[0][1], e[1][0], e[1][1]));
  lines.forEach((l, i) => l.setAttributeNS(null, "index", i));
  make_edges_assignment_names(graph)
    .forEach((a, i) => lines[i].setAttributeNS(null, "class", a));
  return lines;
};
const make_vertices_edges = function ({ edges_vertices }) {
  if (!edges_vertices) { return undefined; }
  const vertices_edges = [];
  edges_vertices.forEach((ev, i) => ev
    .forEach((v) => {
      if (vertices_edges[v] === undefined) {
        vertices_edges[v] = [];
      }
      vertices_edges[v].push(i);
    }));
  return vertices_edges;
};
const make_faces_faces = function ({ faces_vertices }) {
  if (!faces_vertices) { return undefined; }
  const nf = faces_vertices.length;
  const faces_faces = Array.from(Array(nf)).map(() => []);
  const edgeMap = {};
  faces_vertices.forEach((vertices_index, idx1) => {
    if (vertices_index === undefined) { return; }
    const n = vertices_index.length;
    vertices_index.forEach((v1, i, vs) => {
      let v2 = vs[(i + 1) % n];
      if (v2 < v1) { [v1, v2] = [v2, v1]; }
      const key = `${v1} ${v2}`;
      if (key in edgeMap) {
        const idx2 = edgeMap[key];
        faces_faces[idx1].push(idx2);
        faces_faces[idx2].push(idx1);
      } else {
        edgeMap[key] = idx1;
      }
    });
  });
  return faces_faces;
};
const make_vertex_pair_to_edge_map = function ({ edges_vertices }) {
  if (!edges_vertices) { return {}; }
  const map = {};
  edges_vertices
    .map(ev => ev.sort((a, b) => a - b).join(" "))
    .forEach((key, i) => { map[key] = i; });
  return map;
};
const make_face_walk_tree = function (graph, root_face = 0) {
  const edge_map = make_vertex_pair_to_edge_map(graph);
  const new_faces_faces = make_faces_faces(graph);
  if (new_faces_faces.length <= 0) {
    return [];
  }
  let visited = [root_face];
  const list = [[{
    face: root_face,
    parent: undefined,
    edge: undefined,
    level: 0,
  }]];
  do {
    list[list.length] = list[list.length - 1].map((current) => {
      const unique_faces = new_faces_faces[current.face]
        .filter(f => visited.indexOf(f) === -1);
      visited = visited.concat(unique_faces);
      return unique_faces.map((f) => {
        const edge_vertices = graph.faces_vertices[f]
          .filter(v => graph.faces_vertices[current.face].indexOf(v) !== -1)
          .sort((a, b) => a - b);
        const edge = edge_map[edge_vertices.join(" ")];
        return {
          face: f,
          parent: current.face,
          edge,
          edge_vertices,
        };
      });
    }).reduce((prev, curr) => prev.concat(curr), []);
  } while (list[list.length - 1].length > 0);
  if (list.length > 0 && list[list.length - 1].length === 0) { list.pop(); }
  return list;
};
const make_faces_coloring_from_faces_matrix = function (faces_matrix) {
  return faces_matrix
    .map(m => m[0] * m[3] - m[1] * m[2])
    .map(c => c >= 0);
};
const make_faces_coloring = function (graph, root_face = 0) {
  const coloring = [];
  coloring[root_face] = true;
  make_face_walk_tree(graph, root_face)
    .forEach((level, i) => level
      .forEach((entry) => { coloring[entry.face] = (i % 2 === 0); }));
  return coloring;
};
const faces_sorted_by_layer = function (faces_layer) {
  return faces_layer.map((layer, i) => ({ layer, i }))
    .sort((a, b) => a.layer - b.layer)
    .map(el => el.i);
};
const make_faces_sidedness = function (graph) {
  let coloring = graph["faces_re:coloring"];
  if (coloring == null) {
    coloring = ("faces_re:matrix" in graph)
      ? make_faces_coloring_from_faces_matrix(graph["faces_re:matrix"])
      : make_faces_coloring(graph, 0);
  }
  return coloring.map(c => (c ? "front" : "back"));
};
const finalize_faces = function (graph, svg_faces) {
  const isFoldedForm = typeof graph.frame_classes === "object"
    && graph.frame_classes !== null
    && !(graph.frame_classes.includes("creasePattern"));
  const orderIsCertain = graph["faces_re:layer"] != null
    && graph["faces_re:layer"].length === graph.faces_vertices.length;
  if (orderIsCertain && isFoldedForm) {
    make_faces_sidedness(graph)
      .forEach((side, i) => svg_faces[i].setAttribute("class", side));
  }
  return (orderIsCertain
    ? faces_sorted_by_layer(graph["faces_re:layer"]).map(i => svg_faces[i])
    : svg_faces);
};
const faces_vertices_polygon = function (graph) {
  if ("faces_vertices" in graph === false
    || "vertices_coords" in graph === false) {
    return [];
  }
  const svg_faces = graph.faces_vertices
    .map(fv => fv.map(v => graph.vertices_coords[v]))
    .map(face => polygon(face));
  svg_faces.forEach((face, i) => face.setAttribute("index", i));
  return finalize_faces(graph, svg_faces);
};
const faces_edges_polygon = function (graph) {
  if ("faces_edges" in graph === false
    || "edges_vertices" in graph === false
    || "vertices_coords" in graph === false) {
    return [];
  }
  const svg_faces = graph.faces_edges
    .map(face_edges => face_edges
      .map(edge => graph.edges_vertices[edge])
      .map((vi, i, arr) => {
        const next = arr[(i + 1) % arr.length];
        return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
      }).map(v => graph.vertices_coords[v]))
    .map(face => polygon(face));
  svg_faces.forEach((face, i) => face.setAttribute("index", i));
  return finalize_faces(graph, svg_faces);
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
const bounding_rect = function ({ vertices_coords }) {
  if (vertices_coords == null
    || vertices_coords.length <= 0) {
    return [0, 0, 0, 0];
  }
  const dimension = vertices_coords[0].length;
  const min = Array(dimension).fill(Infinity);
  const max = Array(dimension).fill(-Infinity);
  vertices_coords.forEach(v => v.forEach((n, i) => {
    if (n < min[i]) { min[i] = n; }
    if (n > max[i]) { max[i] = n; }
  }));
  return (isNaN(min[0]) || isNaN(min[1]) || isNaN(max[0]) || isNaN(max[1])
    ? [0, 0, 0, 0]
    : [min[0], min[1], max[0] - min[0], max[1] - min[1]]);
};
const get_boundary = function (graph) {
  if (graph.edges_assignment == null) { return { vertices: [], edges: [] }; }
  const edges_vertices_b = graph.edges_assignment
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
  vertex_walk.push(graph.edges_vertices[edgeIndex][0]);
  let nextVertex = graph.edges_vertices[edgeIndex][1];
  while (vertex_walk[0] !== nextVertex) {
    vertex_walk.push(nextVertex);
    edgeIndex = vertices_edges[nextVertex]
      .filter(v => edges_vertices_b[v])
      .shift();
    if (edgeIndex === undefined) { return { vertices: [], edges: [] }; }
    if (graph.edges_vertices[edgeIndex][0] === nextVertex) {
      [, nextVertex] = graph.edges_vertices[edgeIndex];
    } else {
      [nextVertex] = graph.edges_vertices[edgeIndex];
    }
    edges_vertices_b[edgeIndex] = false;
    edge_walk.push(edgeIndex);
  }
  return {
    vertices: vertex_walk,
    edges: edge_walk,
  };
};
const clone = function (o) {
  let newO;
  let i;
  if (typeof o !== "object") {
    return o;
  }
  if (!o) {
    return o;
  }
  if (Object.prototype.toString.apply(o) === "[object Array]") {
    newO = [];
    for (i = 0; i < o.length; i += 1) {
      newO[i] = clone(o[i]);
    }
    return newO;
  }
  newO = {};
  for (i in o) {
    if (o.hasOwnProperty(i)) {
      newO[i] = clone(o[i]);
    }
  }
  return newO;
};
const recursive_freeze = function (input) {
  Object.freeze(input);
  if (input === undefined) {
    return input;
  }
  Object.getOwnPropertyNames(input).filter(prop => input[prop] !== null
    && (typeof input[prop] === "object" || typeof input[prop] === "function")
    && !Object.isFrozen(input[prop]))
    .forEach(prop => recursive_freeze(input[prop]));
  return input;
};
const flatten_frame = function (fold_file, frame_num) {
  if ("file_frames" in fold_file === false
    || fold_file.file_frames.length < frame_num) {
    return fold_file;
  }
  const dontCopy = ["frame_parent", "frame_inherit"];
  const memo = { visited_frames: [] };
  const recurse = function (recurse_fold, frame, orderArray) {
    if (memo.visited_frames.indexOf(frame) !== -1) {
      throw new Error("encountered a cycle in file_frames. can't flatten.");
    }
    memo.visited_frames.push(frame);
    orderArray = [frame].concat(orderArray);
    if (frame === 0) { return orderArray; }
    if (recurse_fold.file_frames[frame - 1].frame_inherit
       && recurse_fold.file_frames[frame - 1].frame_parent != null) {
      return recurse(recurse_fold, recurse_fold.file_frames[frame - 1].frame_parent, orderArray);
    }
    return orderArray;
  };
  return recurse(fold_file, frame_num, []).map((frame) => {
    if (frame === 0) {
      const swap = fold_file.file_frames;
      fold_file.file_frames = null;
      const copy = clone(fold_file);
      fold_file.file_frames = swap;
      delete copy.file_frames;
      dontCopy.forEach(key => delete copy[key]);
      return copy;
    }
    const outerCopy = clone(fold_file.file_frames[frame - 1]);
    dontCopy.forEach(key => delete outerCopy[key]);
    return outerCopy;
  }).reduce((prev, curr) => Object.assign(prev, curr), {});
};
const all_classes = function (graph) {
  const file_classes = (graph.file_classes != null
    ? graph.file_classes : []).join(" ");
  const frame_classes = (graph.frame_classes != null
    ? graph.frame_classes : []).join(" ");
  return [file_classes, frame_classes]
    .filter(s => s !== "")
    .join(" ");
};
const { document } = win;
const svgNS$1 = "http://www.w3.org/2000/svg";
const shadow_defaults = Object.freeze({
  blur: 0.005,
  opacity: 0.3,
  color: "#000",
});
const shadowFilter = function (options = shadow_defaults) {
  const id_name = "shadow";
  if (typeof options !== "object" || options === null) { options = {}; }
  Object.keys(shadow_defaults)
    .filter(key => !(key in options))
    .forEach((key) => { options[key] = shadow_defaults[key]; });
  const filter = document.createElementNS(svgNS$1, "filter");
  filter.setAttribute("width", "200%");
  filter.setAttribute("height", "200%");
  filter.setAttribute("id", id_name);
  const blur = document.createElementNS(svgNS$1, "feGaussianBlur");
  blur.setAttribute("in", "SourceAlpha");
  blur.setAttribute("stdDeviation", options.blur);
  blur.setAttribute("result", "blur");
  const offset = document.createElementNS(svgNS$1, "feOffset");
  offset.setAttribute("in", "blur");
  offset.setAttribute("result", "offsetBlur");
  const flood = document.createElementNS(svgNS$1, "feFlood");
  flood.setAttribute("flood-color", options.color);
  flood.setAttribute("flood-opacity", options.opacity);
  flood.setAttribute("result", "offsetColor");
  const composite = document.createElementNS(svgNS$1, "feComposite");
  composite.setAttribute("in", "offsetColor");
  composite.setAttribute("in2", "offsetBlur");
  composite.setAttribute("operator", "in");
  composite.setAttribute("result", "offsetBlur");
  const merge = document.createElementNS(svgNS$1, "feMerge");
  const mergeNode1 = document.createElementNS(svgNS$1, "feMergeNode");
  const mergeNode2 = document.createElementNS(svgNS$1, "feMergeNode");
  mergeNode2.setAttribute("in", "SourceGraphic");
  merge.appendChild(mergeNode1);
  merge.appendChild(mergeNode2);
  filter.appendChild(blur);
  filter.appendChild(offset);
  filter.appendChild(flood);
  filter.appendChild(composite);
  filter.appendChild(merge);
  return filter;
};
const boundaries_polygon = function (graph) {
  if ("vertices_coords" in graph === false
    || "edges_vertices" in graph === false
    || "edges_assignment" in graph === false) {
    return [];
  }
  const boundary = get_boundary(graph)
    .vertices
    .map(v => graph.vertices_coords[v]);
  if (boundary.length === 0) { return []; }
  const p = polygon(boundary);
  p.setAttribute("class", "boundary");
  return [p];
};
const DIAGRAMS = "re:diagrams";
const DIAGRAM_LINES = "re:diagram_lines";
const DIAGRAM_LINE_CLASSES = "re:diagram_line_classes";
const DIAGRAM_LINE_COORDS = "re:diagram_line_coords";
const DIAGRAM_ARROWS = "re:diagram_arrows";
const DIAGRAM_ARROW_CLASSES = "re:diagram_arrow_classes";
const DIAGRAM_ARROW_COORDS = "re:diagram_arrow_coords";
function renderDiagrams (graph, options) {
  if (graph[DIAGRAMS] === undefined) { return; }
  if (graph[DIAGRAMS].length === 0) { return; }
  const diagrams = [];
  Array.from(graph[DIAGRAMS]).forEach((instruction) => {
    if (DIAGRAM_LINES in instruction === true) {
      instruction[DIAGRAM_LINES].forEach((crease) => {
        const creaseClasses = (DIAGRAM_LINE_CLASSES in crease)
          ? crease[DIAGRAM_LINE_CLASSES].join(" ")
          : "valley";
        const pts = crease[DIAGRAM_LINE_COORDS];
        if (pts !== undefined) {
          const l = line(pts[0][0], pts[0][1], pts[1][0], pts[1][1]);
          l.setAttribute("class", creaseClasses);
          diagrams.push(l);
        }
      });
    }
    if (DIAGRAM_ARROWS in instruction === true) {
      const r = bounding_rect(graph);
      const vmin = r[2] > r[3] ? r[3] : r[2];
      instruction[DIAGRAM_ARROWS].forEach((arrowObject) => {
        if (arrowObject[DIAGRAM_ARROW_COORDS].length === 2) {
          const p = arrowObject[DIAGRAM_ARROW_COORDS];
          let side = p[0][0] < p[1][0];
          if (Math.abs(p[0][0] - p[1][0]) < 0.1) {
            side = p[0][1] < p[1][1] ? p[0][0] < 0.5 : p[0][0] > 0.5;
          }
          if (Math.abs(p[0][1] - p[1][1]) < 0.1) {
            side = p[0][0] < p[1][0] ? p[0][1] > 0.5 : p[0][1] < 0.5;
          }
          const a = arrow(p[0], p[1])
            .stroke("black")
            .fill("black")
            .strokeWidth(vmin * 0.02)
            .head({ width: vmin * 0.035, height: vmin * 0.09 })
            .curve(side ? 0.3 : -0.3);
          const arrowClasses = (DIAGRAM_ARROW_CLASSES in arrowObject)
            ? ["arrow"].concat(arrowObject[DIAGRAM_ARROW_CLASSES]).join(" ")
            : "arrow";
          a.setAttribute("class", arrowClasses);
          diagrams.push(a);
        }
      });
    }
  });
  return diagrams;
}
const faces_draw_function = function (graph) {
  return graph.faces_vertices != null
    ? faces_vertices_polygon(graph)
    : faces_edges_polygon(graph);
};
const component_draw_function = {
  vertices: vertices_circle,
  edges: edges_path,
  faces: faces_draw_function,
  boundaries: boundaries_polygon,
  diagrams: renderDiagrams,
};
const makeDefaults = (vmin = 1) => recursive_freeze({
  input: "string",
  output: "string",
  padding: null,
  file_frame: null,
  stylesheet: null,
  shadows: null,
  diagrams: true,
  boundaries: true,
  faces: true,
  edges: true,
  vertices: false,
  attributes: {
    svg: {
      width: "500px",
      height: "500px",
      stroke: "black",
      fill: "none",
      "stroke-linejoin": "bevel",
      "stroke-width": vmin / 200,
    },
    boundaries: {
      fill: "white",
    },
    faces: {
      stroke: "none",
      front: { stroke: "black", fill: "gray" },
      back: { stroke: "black", fill: "white" },
    },
    edges: {
      boundary: {},
      mountain: { stroke: "red" },
      valley: { stroke: "blue" },
      mark: { stroke: "lightgray" },
      unassigned: { stroke: "lightgray" },
    },
    vertices: {
      stroke: "none",
      fill: "black",
      r: vmin / 200
    },
    diagrams: {
      lines: {
        valley: {
          stroke: "blue",
          "stroke-width": vmin / 100,
          "stroke-dasharray": `${vmin / 50} ${vmin / 100}`
        },
        mountain: {
          stroke: "red",
          "stroke-width": vmin / 100,
          "stroke-dasharray": `${vmin / 50} ${vmin / 100}`
        }
      },
      arrows: {
        valley: { stroke: "black", fill: "black" }
      }
    }
  }
});
const recursiveAssign = function (target, source) {
  Object.keys(source).forEach((key) => {
    if (typeof source[key] === "object" && source[key] !== null) {
      if (!(key in target)) { target[key] = {}; }
      recursiveAssign(target[key], source[key]);
    } else if (typeof target === "object" && !(key in target)) {
      target[key] = source[key];
    }
  });
};
const fold_to_svg = function (input, options = {}) {
  const graph = (typeof options.file_frame === "number"
    ? flatten_frame(input, options.file_frame)
    : input);
  const bounds = bounding_rect(graph);
  const vmin = Math.min(bounds[2], bounds[3]);
  recursiveAssign(options, makeDefaults(vmin));
  const svg$1 = svg();
  setViewBox(svg$1, ...bounds, options.padding);
  const classValue = all_classes(graph);
  if (classValue !== "") { svg$1.setAttribute("class", classValue); }
  Object.keys(options.attributes.svg)
    .forEach(style => svg$1.setAttribute(style, options.attributes.svg[style]));
  const defs$1 = (options.stylesheet != null || options.shadows != null
    ? defs(svg$1)
    : undefined);
  if (options.stylesheet != null) {
    const style$1 = style(defs$1);
    const strokeVar = options.attributes.svg["stroke-width"]
      ? options.attributes.svg["stroke-width"] : vmin / 200;
    const cdata = (new win.DOMParser())
      .parseFromString("<xml></xml>", "application/xml")
      .createCDATASection(`\n* { --stroke-width: ${strokeVar}; }\n${options.stylesheet}`);
    style$1.appendChild(cdata);
  }
  if (options.shadows != null) {
    const shadowOptions = (typeof options.shadows === "object" && options.shadows !== null
      ? options.shadows
      : { blur: vmin / 200 });
    defs$1.appendChild(shadowFilter(shadowOptions));
  }
  options.diagrams = !!(options.diagrams && (graph["re:diagrams"] != null));
  const groups = { };
  ["boundaries", "edges", "faces", "vertices", "diagrams"].filter(key => options[key] === true)
    .forEach((key) => {
      groups[key] = group();
      groups[key].setAttribute("class", key);
    });
  Object.keys(groups)
    .filter(key => component_draw_function[key] !== undefined)
    .forEach(key => component_draw_function[key](graph, options)
      .forEach(a => groups[key].appendChild(a)));
  Object.keys(groups)
    .filter(key => groups[key].childNodes.length > 0)
    .forEach(key => svg$1.appendChild(groups[key]));
  if (groups.edges) {
    const edgeClasses = ["unassigned", "mark", "valley", "mountain", "boundary"];
    Object.keys(options.attributes.edges)
      .filter(key => !edgeClasses.includes(key))
      .forEach(key => groups.edges.setAttribute(key, options.attributes.edges[key]));
    Array.from(groups.edges.childNodes)
      .forEach(child => Object.keys(options.attributes.edges[child.getAttribute("class")] || {})
        .forEach(key => child.setAttribute(key, options.attributes.edges[child.getAttribute("class")][key])));
  }
  if (groups.faces) {
    const faceClasses = ["front", "back"];
    Object.keys(options.attributes.faces)
      .filter(key => !faceClasses.includes(key))
      .forEach(key => groups.faces.setAttribute(key, options.attributes.faces[key]));
    Array.from(groups.faces.childNodes)
      .forEach(child => Object.keys(options.attributes.faces[child.getAttribute("class")] || {})
        .forEach(key => child.setAttribute(key, options.attributes.faces[child.getAttribute("class")][key])));
    if (options.shadows != null) {
      Array.from(groups.faces.childNodes).forEach(f => f.setAttribute("filter", "url(#shadow)"));
    }
  }
  if (groups.vertices) {
    Object.keys(options.attributes.vertices)
      .filter(key => key !== "r")
      .forEach(key => groups.vertices.setAttribute(key, options.attributes.vertices[key]));
    Array.from(groups.vertices.childNodes)
      .forEach(child => child.setAttribute("r", options.attributes.vertices.r));
  }
  if (groups.boundaries) {
    Object.keys(options.attributes.boundaries)
      .forEach(key => groups.boundaries.setAttribute(key, options.attributes.boundaries[key]));
  }
  if (groups.diagrams) {
    Object.keys(options.attributes.diagrams.lines).forEach(key =>
      Array.from(groups.diagrams.childNodes)
        .filter(el => el.tagName === "line")
        .filter(el => el.getAttribute("class").includes(key))
        .forEach(child => Object.keys(options.attributes.diagrams.lines[key])
          .forEach(attr => child.setAttribute(attr, options.attributes.diagrams.lines[key][attr]))));
    Object.keys(options.attributes.diagrams.arrows).forEach(key =>
      Array.from(groups.diagrams.childNodes)
        .filter(el => el.getAttribute("class").includes("arrow"))
        .filter(el => el.getAttribute("class").includes(key))
        .forEach(child => Object.keys(options.attributes.diagrams.arrows[key])
          .forEach(attr => child.setAttribute(attr, options.attributes.diagrams.arrows[key][attr]))));
  }
  if (options.output === "svg") { return svg$1; }
  const stringified = (new win.XMLSerializer()).serializeToString(svg$1);
  const beautified = vkXML(stringified);
  return beautified;
};
const getObject = function (input) {
  if (input == null) {
    return {};
  }
  if (typeof input === "object" && input !== null) {
    return input;
  }
  if (typeof input === "string" || input instanceof String) {
    try {
      const obj = JSON.parse(input);
      return obj;
    } catch (error) {
      throw error;
    }
  }
  throw new TypeError("required 'String' or 'Object'");
};
const FoldToSvg = function (input, options) {
  try {
    const fold = getObject(input);
    return fold_to_svg(fold, options);
  } catch (error) {
    throw error;
  }
};
FoldToSvg.vertices_circle = vertices_circle;
FoldToSvg.edges_path_data = edges_path_data;
FoldToSvg.edges_by_assignment_paths_data = edges_by_assignment_paths_data;
FoldToSvg.edges_path = edges_path;
FoldToSvg.edges_line = edges_line;
FoldToSvg.faces_vertices_polygon = faces_vertices_polygon;
FoldToSvg.faces_edges_polygon = faces_edges_polygon;
export default FoldToSvg;
