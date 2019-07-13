/**
 * origami will be the typical entry-point for most users. it can take different
 * forms: webGL, svg, no-frontend node.
 */

import svgView from "./views/svg/view";
import glView from "./views/webgl/view";

import {
  isBrowser,
  isNode
} from "../include/svg/src/environment/detect";

import Prototype from "./fold/prototype";
import load_file from "./files/load_sync";
import { make_vertices_coords_folded, make_faces_matrix } from "./fold/make";
import { possibleFoldObject } from "./fold/validate";
import * as Create from "./fold/create";
import { transpose_geometry_arrays, keys as foldKeys } from "./fold/keys";
import { clone } from "./fold/object";

import touchAndFold from "./origami_touch_fold";

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

const getView = function (that, ...args) {
  const viewOptions = args.filter(a => "view" in a === true).shift();
  if (viewOptions !== undefined) {
    switch (viewOptions.view) {
      case "gl":
      case "GL":
      case "webGL":
      case "WebGL":
        return { canvas: glView(that, ...args) };
      case "svg":
      case "SVG":
        const view = svgView(that, ...args);
        that.didChange.push(view.draw);
        return { svg: view };
      default:
        break;
    }
  }
  return {};
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
  /**
   *
   *
   */
  const setFoldedForm = function (isFolded) {
    const remove = isFolded ? "creasePattern" : "foldedForm";
    const add = isFolded ? "foldedForm" : "creasePattern";
    const to = isFolded ? "vertices_re:foldedCoords" : "vertices_re:unfoldedCoords";
    const from = isFolded ? "vertices_re:unfoldedCoords" : "vertices_re:foldedCoords";
    if (origami.frame_classes == null) {
      origami.frame_classes = [];
    } else {
      while (origami.frame_classes.indexOf(remove) !== -1) {
        origami.frame_classes.splice(origami.frame_classes.indexOf(remove), 1);
      }
    }
    if (origami.frame_classes.indexOf(add) === -1) {
      origami.frame_classes.push(add);
    }
    // unsure if it works
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
    setFoldedForm.call(origami, true);
    return origami;
  };

  const unfold = function () {
    setFoldedForm.call(origami, false);
    return origami;
  };

  /**
   * @param {file} is a FOLD object.
   * @param {prevent_wipe} if true import will skip clearing
   */
  const load = function (input, prevent_wipe) { // epsilon
    const loaded_file = load_file(input);
    if (prevent_wipe == null || prevent_wipe !== true) {
      foldKeys.forEach(key => delete origami[key]);
    }
    Object.assign(origami, clone(loaded_file));
    origami.didChange.forEach(f => f());
    return origami;
  };

  // const prepareSVGForExport = function (svgElement) {
  //   svgElement.setAttribute("x", "0px");
  //   svgElement.setAttribute("y", "0px");
  //   svgElement.setAttribute("width", "600px");
  //   svgElement.setAttribute("height", "600px");
  //   return svgElement;
  // };

  // Object.defineProperty(svg, "export", {
  //   value: (...exportArgs) => save(prepareSVGForExport(svg.cloneNode(true)), ...exportArgs)
  // });

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
    return a;
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
  Object.defineProperty(origami, "load", { value: load });

  // overwriting prototype methods
  Object.defineProperty(origami, "vertices", { get: () => get.call(origami, "vertices") });
  Object.defineProperty(origami, "edges", { get: () => get.call(origami, "edges") });
  Object.defineProperty(origami, "faces", { get: () => get.call(origami, "faces") });

  return origami;
};

const init = function (...args) {
  const origami = Origami(...args);
  if (isNode) {
    // do nothing
  } else if (isBrowser) {
    // hack. encourage them to have a view
    const viewOptions = args.filter(a => "view" in a === true).shift();
    if (viewOptions !== undefined && viewOptions.view === undefined) {
      viewOptions.view = "svg";
    } else if (viewOptions === undefined) {
      args.push({ view: "svg" });
    }
  }
  Object.assign(origami, getView(origami, ...args));
  // origami.prototype.svg = getView(origami, ...args).svg;
  // if view exists, call first draw

  // attach additional methods
  touchAndFold(origami, origami.svg);

  if (origami.svg) {
    origami.svg.fit();
    origami.svg.draw();
  }
  return origami;
};

export default init;
