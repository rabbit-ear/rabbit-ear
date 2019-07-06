/** FOLD file viewer
 * this is an SVG based front-end for the FOLD file format
 *  (FOLD file spec: https://github.com/edemaine/fold)
 *
 *  View constructor arguments:
 *   - FOLD file
 *   - DOM object, or "string" DOM id to attach to
 */

import math from "../../include/math";
import { setViewBox } from "../../include/svg/src/viewBox";
import SVGImage from "../../include/svg/src/image";
import FOLD_SVG from "../../include/fold-svg";

import { build_folded_frame } from "../frames/folded_frame";
// import fold_through from "../origami/fold";
import { flatten_frame } from "../fold/file_frames";
import load_file from "../files/loader";
import CreasePattern from "../fold/CreasePattern";
import {
  faces_containing_point,
  topmost_face,
  bounding_rect,
  get_boundary,
} from "../fold/query";
import { transpose_geometry_array_at_index } from "../fold/keys";

const DEFAULTS = Object.freeze({
  autofit: true,
  debug: false,
  folding: false,
  padding: 0,
  shadows: false,
  labels: false,
  diagram: false,
  // added recently
  styleSheet: undefined,
  arrowColor: undefined,
});

const DISPLAY_NAME = {
  vertices: "vertices",
  edges: "creases",
  faces: "faces",
  boundaries: "boundaries",
};

const drawComponent = {
  vertices: FOLD_SVG.components.vertices,
  edges: FOLD_SVG.components.edges,
  faces: FOLD_SVG.components.faces,
  boundaries: FOLD_SVG.components.boundaries,
};

const shadowFilter = function (id_name = "shadow") {
  const svgNS = "http://www.w3.org/2000/svg";
  const defs = document.createElementNS(svgNS, "defs");

  const filter = document.createElementNS(svgNS, "filter");
  filter.setAttribute("width", "200%");
  filter.setAttribute("height", "200%");
  filter.setAttribute("id", id_name);

  const blur = document.createElementNS(svgNS, "feGaussianBlur");
  blur.setAttribute("in", "SourceAlpha");
  blur.setAttribute("stdDeviation", "0.01");
  blur.setAttribute("result", "blur");

  const offset = document.createElementNS(svgNS, "feOffset");
  offset.setAttribute("in", "blur");
  offset.setAttribute("result", "offsetBlur");

  const flood = document.createElementNS(svgNS, "feFlood");
  flood.setAttribute("flood-color", "#000");
  flood.setAttribute("flood-opacity", "0.4");
  flood.setAttribute("result", "offsetColor");

  const composite = document.createElementNS(svgNS, "feComposite");
  composite.setAttribute("in", "offsetColor");
  composite.setAttribute("in2", "offsetBlur");
  composite.setAttribute("operator", "in");
  composite.setAttribute("result", "offsetBlur");

  const merge = document.createElementNS(svgNS, "feMerge");
  const mergeNode1 = document.createElementNS(svgNS, "feMergeNode");
  const mergeNode2 = document.createElementNS(svgNS, "feMergeNode");
  mergeNode2.setAttribute("in", "SourceGraphic");
  merge.appendChild(mergeNode1);
  merge.appendChild(mergeNode2);

  defs.appendChild(filter);

  filter.appendChild(blur);
  filter.appendChild(offset);
  filter.appendChild(flood);
  filter.appendChild(composite);
  filter.appendChild(merge);
  return defs;
};

const parsePreferences = function (...args) {
  const keys = Object.keys(DEFAULTS);
  const prefs = {};
  Array(...args)
    .filter(obj => typeof obj === "object")
    .forEach(obj => Object.keys(obj)
      .filter(key => keys.includes(key))
      .forEach((key) => { prefs[key] = obj[key]; }));
  return prefs;
};

export default function (...args) {
  const _this = SVGImage(...args);
  _this.appendChild(shadowFilter("faces_shadow"));

  // make SVG groups, containers for the crease pattern parts
  const groups = {};
  ["boundaries", "faces", "edges", "vertices"].forEach((key) => {
    groups[key] = _this.group();
    groups[key].setAttribute("class", DISPLAY_NAME[key]);
    // the SVG should get touches. faces/creases otherwise intercept events
    groups[key].setAttribute("pointer-events", "none");
    _this.appendChild(groups[key]);
  });
  // additional diagram layer on top. for folding diagram arrows, etc...
  groups.diagram = _this.group();
  groups.diagram.setAttribute("pointer-events", "none");
  // by default show these layers
  const visible = {
    boundaries: true,
    faces: true,
    edges: true,
    vertices: false,
  };
  // container for labels and any top-level detail
  const groupLabels = _this.group();

  const isClean = true;
  const prop = {
    cp: undefined,
    frame: undefined,
    style: {
      vertex_radius: 0.01, // percent of page
    },
  };

  const preferences = {};
  Object.assign(preferences, DEFAULTS);
  const userDefaults = parsePreferences(...args);
  Object.keys(userDefaults)
    .forEach((key) => { preferences[key] = userDefaults[key]; });

  /**
   * if the user passes in an already initialized CreasePattern object
   * (this class), no deep copy will occur.
   */
  const setCreasePattern = function (cp, frame = undefined) {
    // key indicates the object is already a CreasePattern type
    prop.cp = (cp.__rabbit_ear != null)
      ? cp
      : CreasePattern(cp);
    prop.frame = frame;
    draw();
    // two levels of autofit going on here
    if (!preferences.autofit) { updateViewBox(); }
    prop.cp.onchange.push(draw);
  };

  const updateFromCPOnChange = function () {
    // get last update time
    // 1. if timeout is still running ignore it.
    // 2. if update time passes 1/30th of a second force a call
  };

  const isFolded = function (graph) {
    // this is a heuristic function.
    // need best practices for detecting folded state
    if (graph.frame_classes == null) { return false; }
    return graph.frame_classes.includes("foldedForm");
  };

  /**
   * This converts the FOLD object into an SVG, showing only one file_frame at a time
   * (1) flattens the frame if one is selected (recursively if needed)
   * (2) identifies whether the frame is creasePattern or folded form
   */
  const draw = function () {
    // flatten if necessary
    const graph = prop.frame
      ? flatten_frame(prop.cp, prop.frame)
      : prop.cp;

    // copy file/frame classes to top level
    const file_classes = (graph.file_classes != null
      ? graph.file_classes : []).join(" ");
    const frame_classes = graph.frame_classes != null
      ? graph.frame_classes : [].join(" ");
    const top_level_classes = [file_classes, frame_classes]
      .filter(s => s !== "")
      .join(" ");
    _this.setAttribute("class", top_level_classes);

    // visible = isFolded(graph)
    //  ? ["faces", "edges"]
    //  : ["boundaries", "faces", "edges"];

    Object.keys(groups).forEach(key => groups[key].removeChildren());
    groupLabels.removeChildren();

    // draw geometry into groups
    Object.keys(groups)
      .filter(key => visible[key])
      .forEach(key => drawComponent[key](graph)
        .forEach(o => groups[key].appendChild(o)));

    if (preferences.debug) { drawDebug(graph); }
    if (preferences.labels) { drawLabels(graph); }
    if (preferences.autofit) { updateViewBox(); }
    if (preferences.diagram) { drawDiagram(graph); }
    if (preferences.shadows) {
      Array.from(groups.faces.childNodes).forEach(f =>
        f.setAttribute("filter", "url(#faces_shadow)"));
    }
    // let r = bounding_rect(graph);
    // let vmin = r[2] > r[3] ? r[3] : r[2];
    // _this.style = "--crease-width: " + vmin*0.005 + ";"
    // styleElement.innerHTML = "#creases line {" + creaseStyle + "}";

    // stroke width
    let styleElement = _this.querySelector("style");

    if (styleElement == null) {
      const svgNS = "http://www.w3.org/2000/svg";
      styleElement = document.createElementNS(svgNS, "style");
      _this.appendChild(styleElement);
    }
    const r = bounding_rect(graph);
    // --crease-width: 5;
    const vmin = r[2] > r[3] ? r[3] : r[2];
    const creaseStyle = `stroke-width:${vmin * 0.01}`;
    styleElement.innerHTML = `.creases line {${creaseStyle}}`;

    if (preferences.styleSheet) {
      styleElement.innerHTML += preferences.styleSheet;
    }
    // groups.creases.setAttribute("style", "stroke-width:"+vmin*0.005);
  };

  const drawLabels = function (graph) {
    if ("faces_vertices" in graph === false
    || "edges_vertices" in graph === false
    || "vertices_coords" in graph === false) { return; }
    const r = bounding_rect(graph);
    const vmin = r[2] > r[3] ? r[3] : r[2];
    const fSize = vmin * 0.04;
    const labels_style = {
      vertices: `fill:#27b;font-family:sans-serif;font-size:${fSize}px;`,
      edges: `fill:#e53;font-family:sans-serif;font-size:${fSize}px;`,
      faces: `fill:black;font-family:sans-serif;font-size:${fSize}px;`,
    };
    const m = [fSize * 0.33, fSize * 0.4];
    // vertices
    graph.vertices_coords
      .map((c, i) => groupLabels.text(`${i}`, c[0] - m[0], c[1] + m[1]))
      .forEach(t => t.setAttribute("style", labels_style.vertices));
    // edges
    graph.edges_vertices
      .map(ev => ev.map(v => graph.vertices_coords[v]))
      .map(verts => math.core.average(verts))
      .map((c, i) => groupLabels.text(`${i}`, c[0] - m[0], c[1] + m[1]))
      .forEach(t => t.setAttribute("style", labels_style.edges));
    // faces
    graph.faces_vertices
      .map(fv => fv.map(v => graph.vertices_coords[v]))
      .map(verts => math.core.average(verts))
      .map((c, i) => groupLabels.text(`${i}`, c[0] - m[0], c[1] + m[1]))
      .forEach(t => t.setAttribute("style", labels_style.faces));
  };

  const drawDebug = function (graph) {
    const r = bounding_rect(graph);
    const vmin = r[2] > r[3] ? r[3] : r[2];
    const strokeW = vmin * 0.005;
    const debug_style = {
      faces_vertices: `fill:#555;stroke:none;stroke-width:${strokeW};`,
      faces_edges: `fill:#aaa;stroke:none;stroke-width:${strokeW};`,
    };
    graph.faces_vertices
      .map(fv => fv.map(v => graph.vertices_coords[v]))
      .map(face => math.convexPolygon(face).scale(0.666).points)
      .map(points => groupLabels.polygon(points))
      .forEach(poly => poly.setAttribute("style", debug_style.faces_vertices));
    graph.faces_edges
      .map(face_edges => face_edges
        .map(edge => graph.edges_vertices[edge])
        .map((vi, i, arr) => {
          const next = arr[(i + 1) % arr.length];
          return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
        }).map(v => graph.vertices_coords[v]))
      .map(face => math.convexPolygon(face).scale(0.333).points)
      .map(points => groupLabels.polygon(points))
      .forEach(poly => poly.setAttribute("style", debug_style.faces_edges));
  };

  const drawDiagram = function (graph) {
    const r = bounding_rect(graph);
    const vmin = r[2] > r[3] ? r[3] : r[2];
    const diagrams = graph["re:diagrams"];
    if (diagrams == null) { return; }
    diagrams
      .map(d => d["re:diagram_arrows"])
      .filter(a => a != null)
      .forEach(arrow => arrow
        .map(a => a["re:diagram_arrow_coords"])
        .filter(a => a.length > 0)
        .map(p => {
          // console.log("arrow", p);
          // learn arrow so the arc is always "up". if the two X parameters
          // are too close to each other, lean the arrow to center of paper.
          let side = p[0][0] < p[1][0];
          if (Math.abs(p[0][0] - p[1][0]) < 0.1) { // xs are ~ the same
            side = p[0][1] < p[1][1]
              ? p[0][0] < 0.5
              : p[0][0] > 0.5;
          }
          if (Math.abs(p[0][1] - p[1][1]) < 0.1) { // if ys are the same
            side = p[0][0] < p[1][0]
              ? p[0][1] > 0.5
              : p[0][1] < 0.5;
          }
          let prefs = {
            side,
            length: vmin*0.09,
            width: vmin*0.035,
            strokeWidth: vmin*0.02,
          };
          if (preferences.arrowColor) { prefs.color = preferences.arrowColor;}
          // todo, those parameters aren't generalized beyond a unit square
          return groups.diagram.arcArrow(p[0], p[1], prefs);
        })
      );
  };
  // if ("re:construction" in graph === false) { return; }
  // let construction = graph["re:construction"];
  // let diagram = constructon_to_diagram(construction);

  const updateViewBox = function () {
    const graph = prop.frame
      ? flatten_frame(prop.cp, prop.frame)
      : prop.cp;
    const r = bounding_rect(graph);
    const vmin = r[2] > r[3] ? r[3] : r[2];
    setViewBox(_this, r[0], r[1], r[2], r[3], preferences.padding * vmin);
  };

  /**
   * How does this view process a request for nearest components to a target?
   * (2D), furthermore, attach view objects (SVG) to the nearest value data.
   */

  const nearest = function (...methodArgs) {
    const p = math.vector(methodArgs);
    const plural = { vertex: "vertices", edge: "edges", face: "faces" };
    // run these methods, store the results in their place in the same object
    const nears = {
      vertex: prop.cp.nearestVertex,
      edge: prop.cp.nearestEdge,
      face: prop.cp.nearestFace,
    };
    Object.keys(nears)
      .forEach((key) => { nears[key] = nears[key].apply(prop.cp, p); });
    Object.keys(nears).filter(key => nears[key] == null).forEach(key => delete nears[key]);
    Object.keys(nears).forEach((key) => {
      const index = nears[key];
      nears[key] = transpose_geometry_array_at_index(prop.cp, plural[key], index);
      nears[key].svg = groups[plural[key]].childNodes[index];
    });
    return nears;
  };

  const visibleVerticesGetterSetter = {
    get: () => visible.vertices,
    set: (v) => { visible.vertices = !!v; draw(); },
  };
  const visibleEdgesGetterSetter = {
    get: () => visible.creases,
    set: (v) => { visible.creases = !!v; draw(); },
  };
  const visibleFacesGetterSetter = {
    get: () => visible.faces,
    set: (v) => { visible.faces = !!v; draw(); },
  };
  const visibleBoundaryGetterSetter = {
  };

  const getVertices = function () {
    const { vertices } = prop.cp;
    vertices.forEach((v, i) => { v.svg = groups.vertices.childNodes[i]; });
    // console.log("vertices", vertices);
    Object.defineProperty(vertices, "visible", visibleVerticesGetterSetter);
    return vertices;
  };

  const getEdges = function () {
    const { edges } = prop.cp;
    edges.forEach((v, i) => { v.svg = groups.edges.childNodes[i]; });
    Object.defineProperty(edges, "visible", visibleEdgesGetterSetter);
    return edges;
  };

  const getFaces = function () {
    const { faces } = prop.cp;
    const sortedFaces = Array.from(groups.faces.childNodes).slice()
      .sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
    faces.forEach((v, i) => { v.svg = sortedFaces[i]; });
    Object.defineProperty(faces, "visible", visibleFacesGetterSetter);
    return faces;
    // return prop.cp.faces
    //  .map((v,i) => Object.assign(groups.face.children[i], v));
  };

  const getBoundary = function () {
    const graph = prop.frame
      ? flatten_frame(prop.cp, prop.frame)
      : prop.cp;
    return math.polygon(get_boundary(graph).vertices
      .map(v => graph.vertices_coords[v]));
    // let boundary = prop.cp.boundary;
    // boundary.forEach((v,i) => v.svg = groups.boundaries.children[i])
    // return boundary;
  };

  const load = function (input, callback) { // epsilon
    load_file(input, (fold) => {
      setCreasePattern(CreasePattern(fold));
      if (callback != null) { callback(); }
    });
  };

  const fold = function (face) {
    // 1. check if a folded frame already exists (and it's valid)
    // 2. if not, build one
    // if (prop.cp.file_frames.length > 0)
    // if (face == null) { face = 0; }

    if (prop.cp.file_frames != null
      && prop.cp.file_frames.length > 0
      && prop.cp.file_frames[0]["faces_re:matrix"] != null
      && prop.cp.file_frames[0]["faces_re:matrix"].length
        === prop.cp.faces_vertices.length) {
      // well.. do nothing. we're good
    } else {
      // for the moment let's assume it's just 1 layer. face = 0
      if (face == null) { face = 0; }
      const file_frame = build_folded_frame(prop.cp, face);
      if (prop.cp.file_frames == null) { prop.cp.file_frames = []; }
      prop.cp.file_frames.unshift(file_frame);
    }
    prop.frame = 1;
    draw();
  };

  const foldWithoutLayering = function (face) {
    const folded = {};
    folded.frame_classes = ["foldedForm"];
    folded.vertices_coords = make.make_vertices_coords_folded(prop.cp, face);

    setCreasePattern(CreasePattern(folded));
    Array.from(groups.faces.children).forEach(f => f.setClass("face"));
  };

  Object.defineProperty(_this, "frames", {
    get: () => {
      if (prop.cp.file_frames === undefined) {
        return [JSON.parse(JSON.stringify(prop.cp))];
      }
      const frameZero = JSON.parse(JSON.stringify(prop.cp));
      delete frameZero.file_frames;
      const frames = JSON.parse(JSON.stringify(prop.cp.file_frames));
      return [frameZero].concat(frames);
    },
  });
  Object.defineProperty(_this, "frame", {
    get: () => prop.frame,
    set: (newValue) => {
      // check bounds of frames
      prop.frame = newValue;
      draw();
    },
  });

  const prepareSVGForExport = function (svgElement) {
    svgElement.setAttribute("x", "0px");
    svgElement.setAttribute("y", "0px");
    svgElement.setAttribute("width", "600px");
    svgElement.setAttribute("height", "600px");
    return svgElement;
  };

  Object.defineProperty(_this, "export", {
    value: (...exportArgs) => SVG
      .save(prepareSVGForExport(_this.cloneNode(true)), ...exportArgs)
  });

  Object.defineProperty(_this, "cp", {
    get: () => prop.cp,
    set: (cp) => { setCreasePattern(cp); },
  });
  Object.defineProperty(_this, "frameCount", {
    get: () => (prop.cp.file_frames ? prop.cp.file_frames.length : 0),
  });
  // Object.defineProperty(_this, "frame", {
  //  set: function (f) { prop.frame = f; draw(); },
  //  get: function () { return prop.frame; }
  // });

  // attach CreasePattern methods
  // "axiom", "axiom1", "axiom2", "axiom3", "axiom4", "axiom5", "axiom6", "axiom7",
  let cpSharedMethods = ["crease"];
  cpSharedMethods.forEach(method => Object.defineProperty(_this, method, {
    value: () => prop.cp[method](...arguments),
  }));
  // attach CreasePattern getters
  // ["boundary", "vertices", "edges", "faces",
  // ["isFolded"]
  //  .forEach(method => Object.defineProperty(_this, method, {
  //    get: function (){ return prop.cp[method]; }
  //  }));

  Object.defineProperty(_this, "nearest", { value: nearest });
  Object.defineProperty(_this, "vertices", {
    get: () => getVertices(),
  });
  Object.defineProperty(_this, "edges", {
    get: () => getEdges(),
  });
  Object.defineProperty(_this, "faces", {
    get: () => getFaces(),
  });
  Object.defineProperty(_this, "boundary", {
    get: () => getBoundary(),
  });
  Object.defineProperty(_this, "draw", { value: draw });
  Object.defineProperty(_this, "fold", { value: fold });
  Object.defineProperty(_this, "foldWithoutLayering", {
    value: foldWithoutLayering,
  });
  Object.defineProperty(_this, "load", { value: load });
  Object.defineProperty(_this, "folded", {
    set: (f) => {
      prop.cp.frame_classes = prop.cp.frame_classes
        .filter(a => a !== "creasePattern");
      prop.cp.frame_classes = prop.cp.frame_classes
        .filter(a => a !== "foldedForm");
      prop.cp.frame_classes.push(f ? "foldedForm" : "creasePattern");
      draw();
    },
  });
  Object.defineProperty(_this, "updateViewBox", { value: updateViewBox });
  Object.defineProperty(_this, "setViewBox", {
    value: (x, y, w, h, padding) => setViewBox(_this, x, y, w, h, padding)
  });
  _this.preferences = preferences;
  // _this.groups = groups;

  // boot
  setCreasePattern(CreasePattern(...arguments), 1);

  let prevCP, prevCPFolded, touchFaceIndex;
  _this.events.addEventListener("onMouseDown", function (mouse) {
    if (preferences.folding) {
      try {
        prevCP = JSON.parse(JSON.stringify(prop.cp));
        if (prop.frame == null
          || prop.frame === 0
          || prevCP.file_frames == null) {
          let file_frame = build_folded_frame(prevCP, 0);
          if (prevCP.file_frames == null) { prevCP.file_frames = []; }
          prevCP.file_frames.unshift(file_frame);
        }
        prevCPFolded = flatten_frame(prevCP, 1);
        let faces_containing = faces_containing_point(prevCPFolded, mouse);
        let top_face = topmost_face(prevCPFolded, faces_containing);
        touchFaceIndex = (top_face == null)
          ? 0 // get bottom most face
          : top_face;
      } catch(error) {
        console.warn("problem loading the last fold step", error);
      }
    }
  });
  _this.events.addEventListener("onMouseMove", function (mouse) {
    if (preferences.folding && mouse.isPressed) {
      prop.cp = CreasePattern(prevCP);
      let points = [math.vector(mouse.pressed), math.vector(mouse.position)];
      let midpoint = points[0].midpoint(points[1]);
      let vector = points[1].subtract(points[0]);
      // console.log("valley", midpoint, vector.rotateZ90(), touchFaceIndex);
      prop.cp.valleyFold(midpoint, vector.rotateZ90(), touchFaceIndex);
      fold();
    }
  });

  return _this;
};
