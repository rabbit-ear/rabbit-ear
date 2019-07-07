/**
 * origami will be the typical entry-point for most users. it can take different
 * forms: webGL, svg, no-frontend node.
 */

import svgView from "./views/svgView";
import glView from "./views/glView";

import {
  isBrowser,
  isNode,
  // isWebWorker,
} from "../include/svg/src/environment/detect";

import Prototype from "./fold/prototype";
import load_file from "./files/load_sync";
import { make_vertices_coords_folded, make_faces_matrix } from "./fold/make";
import { possibleFoldObject } from "./fold/validate";
import * as Create from "./fold/create";
import { keys as foldKeys } from "./fold/keys";
import { clone } from "./fold/object";

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

const getView = function (...args) {
  const typeOptions = args.filter(a => "type" in a === true).shift();
  if (typeOptions !== undefined) {
    switch (typeOptions.type) {
      case "gl":
      case "GL":
      case "webGL":
      case "WebGL":
        return { canvas: glView(...args) };
      case "svg":
      case "SVG":
        return { svg: svgView(...args) };
      default:
        break;
    }
  }
  return {};
};

const Origami = function (...args) {
  /**
   *
   *
   */
  const foldObjs = args
    .filter(el => typeof el === "object" && el !== null)
    .filter(el => possibleFoldObject(el));
    // .filter(el => el.vertices_coords != null);
  // unit square is the default base if nothing else is provided
  const origami = Object.assign(
    Object.create(Prototype()),
    foldObjs.shift() || Create.square()
  );

  const preferences = {};
  Object.assign(preferences, DEFAULTS);
  const userDefaults = parsePreferences(...args);
  Object.keys(userDefaults)
    .forEach((key) => { preferences[key] = userDefaults[key]; });

  const setFoldedForm = function (isFolded = true) {
    const remove = isFolded ? "creasePattern" : "foldedForm";
    const add = isFolded ? "foldedForm" : "creasePattern";
    while (this.frame_classes.indexOf(remove) !== -1) {
      this.frame_classes.splice(this.frame_classes.indexOf(remove), 1);
    }
    if (this.frame_classes.indexOf(add) === -1) {
      this.frame_classes.push(add);
    }
  };

  const fold = function (options = {}) {
    if ("faces_re:matrix" in this === false) {
      this["faces_re:matrix"] = make_faces_matrix(this, options.face);
    }
    if ("vertices_re:foldedCoords" in this === false) {
      this["vertices_re:foldedCoords"] = make_vertices_coords_folded(this, null, this["faces_re:matrix"]);
    }
    setFoldedForm(true);
  };

  /**
   * @param {file} is a FOLD object.
   * @param {prevent_wipe} if true import will skip clearing
   */
  const load = function (input, prevent_wipe) { // epsilon
    const loaded_file = load_file(input);
    if (prevent_wipe == null || prevent_wipe !== true) {
      foldKeys.forEach(key => delete this[key]);
    }
    Object.assign(this, clone(loaded_file));
  };

  Object.defineProperty(origami, "fold", { value: fold });
  Object.defineProperty(origami, "load", { value: load });

  return origami;
};

const init = function (...args) {
  const origami = Origami(...args);
  if (isNode) {
    // do nothing
  } else if (isBrowser) {
    // hack. encourage them to have a view
    const typeOptions = args.filter(a => "type" in a === true).shift();
    if (typeOptions !== undefined && typeOptions.type === undefined) {
      typeOptions.type = "svg";
    } else if (typeOptions === undefined) {
      args.push({ type: "svg" });
    }
  }
  Object.assign(origami, getView(...args));
  return origami;
};

export default init;
