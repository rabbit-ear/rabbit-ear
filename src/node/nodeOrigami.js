import CreasePattern from "../fold/CreasePattern";
import { build_folded_frame } from "../frames/folded_frame";
import load_file from "../files/loader";
import { make_vertices_coords_folded } from "../fold/make";

const DEFAULTS = Object.freeze({ });

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

const Origami = function (...args) {
  const origami = Object.create(CreasePattern());

  // make SVG groups, containers for the crease pattern parts
  // const isClean = true;
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
    // draw();
    // two levels of autofit going on here
    // if (!preferences.autofit) { updateViewBox(); }
    // prop.cp.onchange.push(draw);
  };

  // /**
  //  * How does this view process a request for nearest components to a target?
  //  * (2D), furthermore, attach view objects (SVG) to the nearest value data.
  //  */

  // const nearest = function (...methodArgs) {
  //   const p = math.vector(methodArgs);
  //   const plural = { vertex: "vertices", edge: "edges", face: "faces" };
  //   // run these methods, store the results in their place in the same object
  //   const nears = {
  //     vertex: prop.cp.nearestVertex,
  //     edge: prop.cp.nearestEdge,
  //     face: prop.cp.nearestFace,
  //   };
  //   Object.keys(nears)
  //     .forEach((key) => { nears[key] = nears[key].apply(prop.cp, p); });
  //   Object.keys(nears).filter(key => nears[key] == null).forEach(key => delete nears[key]);
  //   Object.keys(nears).forEach((key) => {
  //     const index = nears[key];
  //     nears[key] = transpose_geometry_array_at_index(prop.cp, plural[key], index);
  //     nears[key].svg = groups[plural[key]].childNodes[index];
  //   });
  //   return nears;
  // };

  // const getVertices = function () {
  //   const { vertices } = prop.cp;
  //   vertices.forEach((v, i) => { v.svg = groups.vertices.childNodes[i]; });
  //   // console.log("vertices", vertices);
  //   Object.defineProperty(vertices, "visible", visibleVerticesGetterSetter);
  //   return vertices;
  // };

  // const getEdges = function () {
  //   const { edges } = prop.cp;
  //   edges.forEach((v, i) => { v.svg = groups.edges.childNodes[i]; });
  //   Object.defineProperty(edges, "visible", visibleEdgesGetterSetter);
  //   return edges;
  // };

  // const getFaces = function () {
  //   const { faces } = prop.cp;
  //   const sortedFaces = Array.from(groups.faces.childNodes).slice()
  //     .sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
  //   faces.forEach((v, i) => { v.svg = sortedFaces[i]; });
  //   Object.defineProperty(faces, "visible", visibleFacesGetterSetter);
  //   return faces;
  //   // return prop.cp.faces
  //   //  .map((v,i) => Object.assign(groups.face.children[i], v));
  // };

  // const getBoundary = function () {
  //   const graph = prop.frame
  //     ? flatten_frame(prop.cp, prop.frame)
  //     : prop.cp;
  //   return math.polygon(get_boundary(graph).vertices
  //     .map(v => graph.vertices_coords[v]));
  //   // let boundary = prop.cp.boundary;
  //   // boundary.forEach((v,i) => v.svg = groups.boundaries.children[i])
  //   // return boundary;
  // };

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
    // draw();
  };

  const foldWithoutLayering = function (face) {
    const folded = {};
    folded.frame_classes = ["foldedForm"];
    folded.vertices_coords = make_vertices_coords_folded(prop.cp, face);

    setCreasePattern(CreasePattern(folded));
    // Array.from(groups.faces.children).forEach(f => f.setClass("face"));
  };

  Object.defineProperty(origami, "frames", {
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
  Object.defineProperty(origami, "frame", {
    get: () => prop.frame,
    set: (newValue) => {
      // check bounds of frames
      prop.frame = newValue;
      // draw();
    },
  });

  // Object.defineProperty(origami, "export", {
  //   value: (...exportArgs) => SVG
  //     .save(prepareSVGForExport(origami.cloneNode(true)), ...exportArgs)
  // });

  Object.defineProperty(origami, "cp", {
    get: () => prop.cp,
    set: (cp) => { setCreasePattern(cp); },
  });
  Object.defineProperty(origami, "frameCount", {
    get: () => (prop.cp.file_frames ? prop.cp.file_frames.length : 0),
  });
  // Object.defineProperty(_this, "frame", {
  //  set: function (f) { prop.frame = f; draw(); },
  //  get: function () { return prop.frame; }
  // });

  // attach CreasePattern methods
  // "axiom", "axiom1", "axiom2", "axiom3", "axiom4", "axiom5", "axiom6", "axiom7",
  // let cpSharedMethods = ["crease"];
  // cpSharedMethods.forEach(method => Object.defineProperty(_this, method, {
  //   value: () => prop.cp[method](...arguments),
  // }));
  // attach CreasePattern getters
  // ["boundary", "vertices", "edges", "faces",
  // ["isFolded"]
  //  .forEach(method => Object.defineProperty(_this, method, {
  //    get: function (){ return prop.cp[method]; }
  //  }));

  // Object.defineProperty(origami, "nearest", { value: nearest });
  // Object.defineProperty(origami, "vertices", { get: () => getVertices() });
  // Object.defineProperty(origami, "edges", { get: () => getEdges() });
  // Object.defineProperty(origami, "faces", { get: () => getFaces() });
  // Object.defineProperty(origami, "boundary", { get: () => getBoundary() });
  Object.defineProperty(origami, "fold", { value: fold });
  Object.defineProperty(origami, "foldWithoutLayering", {
    value: foldWithoutLayering,
  });
  Object.defineProperty(origami, "load", { value: load });

  origami.preferences = preferences;
  // _this.groups = groups;

  // boot
  setCreasePattern(CreasePattern(...args), 1);

  return origami;
};

export default Origami;
