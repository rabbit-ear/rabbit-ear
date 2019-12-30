/**
 * this is a FOLD format that strictly enforces a non-stretching boundary
 *
 * useful for modeling origami paper.
 *
 */

/**
 * this will work in the browser, or in Node.js.
 * the front end is optional, webGL, svg.
 */

/**
 * MODIFIES IMPORTED FOLD OBJECTS. (does not modify original)
 *
 * whenever a FOLD object is brought in, or when called by the user,
 * parts are added and made sure exist.
 *
 * this is the difference between using Origami() vs. adding Prototype
 */

import drawFOLD from "../../include/fold-draw";
import math from "../../include/math";

import svgView from "../view-svg";
import glView from "../view-webgl";
import touchAndFold from "../view-svg/origami_touch_fold";
import convert from "../convert/convert";
import window from "../environment/window";
import Prototype from "./prototype";
import {
  isBrowser,
  isNode
} from "../environment/detect";
import {
  make_vertices_coords_folded,
  make_faces_matrix
} from "../FOLD/make";
import {
  possibleFoldObject,
} from "../FOLD/validate";
import {
  transpose_geometry_arrays,
  keys as foldKeys,
  future_spec as re
} from "../FOLD/keys";
import { square } from "../FOLD/create";
// import clean from "../FOLD/clean";


const DEFAULTS = Object.freeze({
  touchFold: false,
});

const parseOptions = function (...args) {
  const keys = Object.keys(DEFAULTS);
  const prefs = {};
  Array(...args)
    .filter(obj => typeof obj === "object")
    .forEach(obj => Object.keys(obj)
      .filter(key => keys.includes(key))
      .forEach((key) => { prefs[key] = obj[key]; }));
  return prefs;
};

const interpreter = {
  gl: "webgl",
  GL: "webgl",
  webGL: "webgl",
  WebGL: "webgl",
  webgl: "webgl",
  Webgl: "webgl",
  svg: "svg",
  SVG: "svg",
  "2d": "svg",
  "2D": "svg",
  "3d": "webgl",
  "3D": "webgl",
};

const parseOptionsForView = function (...args) {
  // ignores other objects, only ends up with one.
  const viewOptions = args
    .filter(a => typeof a === "object")
    .filter(a => "view" in a === true)
    .shift();
  if (viewOptions === undefined) {
    // do nothing
    if (isNode) { return undefined; }
    if (isBrowser) { return "svg"; }
  }
  return interpreter[viewOptions.view];
};

const Origami = function (...args) {
  /**
   * create the object. process initialization arguments
   * by default this will load a unit square graph.
   */
  const origami = Object.assign(
    Object.create(Prototype()),
    args.filter(el => possibleFoldObject(el)).shift() || square()
  );
  // validate and add anything missing.
  // validate(origami);
  origami.clean();
  /**
   * setting the "folded state" does two things:
   * - assign the class of this object to be "foldedForm" or "creasePattern"
   * - move (and cache) foldedCoords or unfoldedCoords into vertices_coords
   */
  const setFoldedForm = function (isFolded) {
    const wasFolded = origami.isFolded();
    const remove = isFolded ? "creasePattern" : "foldedForm";
    const add = isFolded ? "foldedForm" : "creasePattern";
    if (origami.frame_classes == null) { origami.frame_classes = []; }
    while (origami.frame_classes.indexOf(remove) !== -1) {
      origami.frame_classes.splice(origami.frame_classes.indexOf(remove), 1);
    }
    if (origami.frame_classes.indexOf(add) === -1) {
      origami.frame_classes.push(add);
    }
    // move unfolded_coords or folded_coords into the main vertices_coords spot
    const to = isFolded ? "vertices_re:foldedCoords" : "vertices_re:unfoldedCoords";
    const from = isFolded ? "vertices_re:unfoldedCoords" : "vertices_re:foldedCoords";
    if (to in origami === true) {
      origami[from] = origami.vertices_coords;
      origami.vertices_coords = origami[to];
      delete origami[to];
    }
    origami.didChange.forEach(f => f());
  };
  /**
   * @param {file} is a FOLD object.
   * @param {prevent_clear} if true import will skip clearing
   */
  const load = function (data, options) {
  // const load = function (data, prevent_clear) {
    // if (prevent_clear == null || prevent_clear !== true) {
    foldKeys.forEach(key => delete origami[key]);
    // }
    const fold_file = convert(data).fold(options);
    Object.assign(origami, fold_file);
    origami.clean();
    // placeholderFoldedForm(_origami);
    origami.didChange.forEach(f => f());
  };

  const collapse = function (options = {}) {
    if ("faces_re:matrix" in origami === false) {
      origami["faces_re:matrix"] = make_faces_matrix(origami, options.face);
    }
    if ("vertices_re:foldedCoords" in origami === false) {
      origami["vertices_re:foldedCoords"] = make_vertices_coords_folded(origami, null, origami["faces_re:matrix"]);
    }
    setFoldedForm(true);
    return origami;
  };

  const flatten = function () {
    setFoldedForm(false);
    return origami;
  };

  const fold = function (...args) {
    return origami;
  };

  const unfold = function () {
    // get history
    return origami;
  };

  // probably not needed
  // const calculateAdjacent = function (component, index) {
  //   return [1, 5, 2];
  // };

  const get = function (component) {
    const a = transpose_geometry_arrays(origami, component);
    const view = origami.svg || origami.gl;
    Object.defineProperty(a, "visible", {
      get: () => view.options[component],
      set: (v) => {
        view.options[component] = !!v;
        origami.didChange.forEach(f => f());
      },
    });
    // this should be covered in the flat arrays, and automatically migrate over due to transpose_geometry_arrays
    // a.forEach(el => Object.defineProperty(el, "adjacent"));

    if (origami.svg != null) {
      a.forEach((el, i) => {
        el.svg = origami.svg.groups[component].childNodes[i];
      });
    }
    // todo make this not an exception
    if (component === "edges") {
      a.forEach((e) => {
        e.vector = (() => {
          const pA = origami.vertices_coords[e.vertices[0]];
          const pB = origami.vertices_coords[e.vertices[1]];
          return [pB[0] - pA[0], pB[1] - pA[1]];
        });
      });
    }
    return a;
  };

  /**
   * How does this view process a request for nearest components to a target?
   * (2D), furthermore, attach view objects (SVG) to the nearest value data.
   */
  const nearest = function (...args2) {
    const plural = {
      vertex: "vertices",
      edge: "edges",
      face: "faces",
    };
    const target = math.core.get_vector(...args2);
    const nears = {
      vertex: origami.nearestVertex(origami, target),
      edge: origami.nearestEdge(origami, target),
      face: origami.nearestFace(origami, target)
    };
    Object.keys(nears)
      .filter(key => nears[key] == null)
      .forEach(key => delete nears[key]);
    if (origami.svg != null) {
      Object.keys(nears).forEach((key) => {
        nears[key].svg = origami.svg.groups[plural[key]].childNodes[nears[key].index];
      });
    }
    // todo make this not an exception
    if (nears.edge != null) {
      nears.edge.vector = (() => {
        const pA = origami.vertices_coords[nears.edge.vertices[0]];
        const pB = origami.vertices_coords[nears.edge.vertices[1]];
        return [pB[0] - pA[0], pB[1] - pA[1]];
      });
    }
    return nears;
  };

  // apply preferences
  const options = {};
  Object.assign(options, DEFAULTS);
  const userDefaults = parseOptions(...args);
  Object.keys(userDefaults)
    .forEach((key) => { options[key] = userDefaults[key]; });

  // attach methods
  Object.defineProperty(origami, "load", { value: load });
  Object.defineProperty(origami, "collapse", { value: collapse });
  Object.defineProperty(origami, "flatten", { value: flatten });
  Object.defineProperty(origami, "fold", { value: fold });
  Object.defineProperty(origami, "unfold", { value: unfold });

  // overwriting prototype methods
  Object.defineProperty(origami, "nearest", { value: nearest });
  Object.defineProperty(origami, "vertices", { get: () => get.call(origami, "vertices") });
  Object.defineProperty(origami, "edges", { get: () => get.call(origami, "edges") });
  Object.defineProperty(origami, "faces", { get: () => get.call(origami, "faces") });
  // Object.defineProperty(origami, "export", {
  //   value: (...exportArgs) => {
  //     if (exportArgs.length <= 0) {
  //       return JSON.stringify(origami);
  //     }
  //     switch (exportArgs[0]) {
  //       case "svg":
  //         // should we prepare the svg for export? set "width", "height"
  //         if (origami.svg != null) {
  //           return (new window.XMLSerializer()).serializeToString(origami.svg);
  //         }
  //         return drawFOLD.svg(origami);
  //       case "fold":
  //       case "json":
  //       default: return JSON.stringify(origami);
  //     }
  //   }
  // });

  const exportObject = function () { return JSON.stringify(origami); };
  exportObject.json = function () { return JSON.stringify(origami); };
  exportObject.fold = function () { return JSON.stringify(origami); };
  // this is not ready yet. bug when value is undefined
  // exportObject.fold = function () { return FOLDConvert.toJSON(origami); };
  exportObject.svg = function () {
    if (origami.svg != null) {
      return (new window.XMLSerializer()).serializeToString(origami.svg);
    }
    return drawFOLD.svg(origami);
  };

  // Object.defineProperty(origami, "clean", { value: () => clean(origami) });
  Object.defineProperty(origami, "snapshot", { get: () => exportObject });
  Object.defineProperty(origami, "export", { get: () => exportObject });
  Object.defineProperty(origami, "options", { get: () => options });

  return origami;
};


// Prototype.empty = function () {
//   return Prototype(Create.empty());
// };

// Prototype.square = function () {
//   return Prototype(Create.rectangle(1, 1));
// };

// Prototype.rectangle = function (width = 1, height = 1) {
//   return Prototype(Create.rectangle(width, height));
// };

// Prototype.regularPolygon = function (sides, radius = 1) {
//   if (sides == null) {
//     console.warn("regularPolygon requires number of sides parameter");
//   }
//   return Prototype(Create.regular_polygon(sides, radius));
// };


const init = function (...args) {
  const origami = Origami(...args);

  // assign a view, if requested
  let view;
  switch (parseOptionsForView(...args)) {
    case "svg":
      view = svgView(origami, ...args);
      origami.didChange.push(view.draw);
      Object.defineProperty(origami, "svg", { get: () => view });
      // attach additional methods
      if (origami.options.touchFold === true) {
        touchAndFold(origami, origami.svg);
      }
      // view specific initializers
      origami.svg.fit();
      origami.svg.draw();
      break;
    case "webgl":
      view = glView(origami, ...args);
      Object.defineProperty(origami, "canvas", { get: () => view });
      break;
    default: break;
  }

  return origami;
};

export default init;
