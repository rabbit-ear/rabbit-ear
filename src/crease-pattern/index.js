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

import drawFOLD from "../../include/fold-draw";
import math from "../../include/math";

import svgView from "../view-svg/index";
import glView from "../view-webgl/index";
import touchAndFold from "../view-svg/origami_touch_fold";
import window from "../environment/window";
import Prototype from "./prototype";
import {
  isBrowser,
  isNode
} from "../environment/detect";
import {
  possibleFoldObject,
} from "../FOLD/validate";
import {
  transpose_geometry_arrays,
} from "../FOLD/keys";
import { square } from "../FOLD/create";
import clean from "../FOLD/clean";


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
  clean(origami);

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

  // overwriting prototype methods
  Object.defineProperty(origami, "nearest", { value: nearest });
  Object.defineProperty(origami, "vertices", { get: () => get.call(origami, "vertices") });
  Object.defineProperty(origami, "edges", { get: () => get.call(origami, "edges") });
  Object.defineProperty(origami, "faces", { get: () => get.call(origami, "faces") });

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

  Object.defineProperty(origami, "clean", { value: () => clean(origami) });
  Object.defineProperty(origami, "snapshot", { get: () => exportObject });
  Object.defineProperty(origami, "export", { get: () => exportObject });
  Object.defineProperty(origami, "options", { get: () => options });

  return origami;
};

const init = function (...args) {
  const origami = Origami(...args);

  // assign a view, if requested
  let view;
  switch (parseOptionsForView(...args)) {
    case "svg":
      view = svgView(origami, ...args);
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
