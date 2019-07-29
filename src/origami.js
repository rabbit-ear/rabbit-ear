/**
 * origami will be the typical entry-point for most users.
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

import svgView from "./views/svg/view";
import glView from "./views/webgl/view";
import drawFOLD from "../include/fold-draw";
import math from "../include/math";

import {
  isBrowser,
  isNode
} from "../include/svg/src/environment/detect";

import Prototype from "./fold/prototype";
// import load_file from "./convert/load_sync";
import { make_vertices_coords_folded, make_faces_matrix } from "./fold/make";
import {
  possibleFoldObject,
  validate
} from "./fold/validate";
import * as Create from "./fold/create";
import { transpose_geometry_arrays, keys as foldKeys } from "./fold/keys";
import { clone } from "./fold/object";
import { clean } from "./fold/clean";

import touchAndFold from "./views/svg/origami_touch_fold";

const DEFAULTS = Object.freeze({
  folding: false,
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
    args.filter(el => possibleFoldObject(el)).shift() || Create.square()
  );
  // validate and add anything missing.
  validate(origami);
  clean(origami);
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

  const fold = function (options = {}) {
    if ("faces_re:matrix" in origami === false) {
      origami["faces_re:matrix"] = make_faces_matrix(origami, options.face);
    }
    if ("vertices_re:foldedCoords" in origami === false) {
      origami["vertices_re:foldedCoords"] = make_vertices_coords_folded(origami, null, origami["faces_re:matrix"]);
    }
    setFoldedForm(true);
    return origami;
  };

  const unfold = function () {
    setFoldedForm(false);
    return origami;
  };

  /**
   * @param {file} is a FOLD object.
   * @param {prevent_wipe} if true import will skip clearing
   */
  // const load = function (input, prevent_wipe) { // epsilon
  //   const loaded_file = load_file(input);
  //   if (prevent_wipe == null || prevent_wipe !== true) {
  //     foldKeys.forEach(key => delete origami[key]);
  //   }
  //   Object.assign(origami, clone(loaded_file));
  //   origami.didChange.forEach(f => f());
  //   clean(origami);
  //   return origami;
  // };

  // Object.defineProperty(svg, "frames", {
  //   get: () => {
  //     if (prop.cp.file_frames === undefined) {
  //       return [JSON.parse(JSON.stringify(prop.cp))];
  //     }
  //     const frameZero = JSON.parse(JSON.stringify(prop.cp));
  //     delete frameZero.file_frames;
  //     const frames = JSON.parse(JSON.stringify(prop.cp.file_frames));
  //     return [frameZero].concat(frames);
  //   },
  // });

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
    if (origami.svg != null) {
      a.forEach((el, i) => {
        el.svg = origami.svg.groups[component].childNodes[i];
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
    return nears;
  };

  // apply preferences
  const options = {};
  Object.assign(options, DEFAULTS);
  const userDefaults = parseOptions(...args);
  Object.keys(userDefaults)
    .forEach((key) => { options[key] = userDefaults[key]; });

  // attach methods
  Object.defineProperty(origami, "fold", { value: fold });
  Object.defineProperty(origami, "unfold", { value: unfold });
  // Object.defineProperty(origami, "load", { value: load });

  // overwriting prototype methods
  Object.defineProperty(origami, "nearest", { value: nearest });
  Object.defineProperty(origami, "vertices", { get: () => get.call(origami, "vertices") });
  Object.defineProperty(origami, "edges", { get: () => get.call(origami, "edges") });
  Object.defineProperty(origami, "faces", { get: () => get.call(origami, "faces") });
  Object.defineProperty(origami, "export", {
    value: (...exportArgs) => {
      if (exportArgs.length <= 0) {
        return origami.json();
      }
      switch (exportArgs[0]) {
        case "svg":
          // should we prepare the svg for export? set "width", "height"
          if (origami.svg != null) {
            return (new window.XMLSerializer()).serializeToString(origami.svg);
          }
          return drawFOLD.svg(origami);
        case "fold":
        case "json":
        default: return origami.json();
      }
    }
  });

  return origami;
};

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
      touchAndFold(origami, origami.svg);
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
