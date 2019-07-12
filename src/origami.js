/**
 * origami will be the typical entry-point for most users. it can take different
 * forms: webGL, svg, no-frontend node.
 */

import svgView from "./views/svgView";
import glView from "./views/glView";

import {
  isBrowser,
  isNode
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

const getView = function (that, ...args) {
  const typeOptions = args.filter(a => "type" in a === true).shift();
  if (typeOptions !== undefined) {
    switch (typeOptions.type) {
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
   *
   *
   */
  const setFoldedForm = function (isFolded) {
    const remove = isFolded ? "creasePattern" : "foldedForm";
    const add = isFolded ? "foldedForm" : "creasePattern";
    const to = isFolded ? "vertices_re:foldedCoords" : "vertices_re:unfoldedCoords";
    const from = isFolded ? "vertices_re:unfoldedCoords" : "vertices_re:foldedCoords";
    while (this.frame_classes.indexOf(remove) !== -1) {
      this.frame_classes.splice(this.frame_classes.indexOf(remove), 1);
    }
    if (this.frame_classes.indexOf(add) === -1) {
      this.frame_classes.push(add);
    }
    // unsure if it works
    if (to in this === true) {
      this[from] = this.vertices_coords;
      this.vertices_coords = this[to];
      delete this[to];
    }
    this.didChange.forEach(f => f());
  };

  const fold = function (options = {}) {
    if ("faces_re:matrix" in this === false) {
      this["faces_re:matrix"] = make_faces_matrix(this, options.face);
    }
    if ("vertices_re:foldedCoords" in this === false) {
      this["vertices_re:foldedCoords"] = make_vertices_coords_folded(this, null, this["faces_re:matrix"]);
    }
    setFoldedForm.call(this, true);
    return this;
  };

  const unfold = function () {
    setFoldedForm.call(this, false);
    return this;
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
    this.didChange.forEach(f => f());
    return this;
  };
  /**
   * create the object. process initialization arguments
   * by default this will load a unit square graph.
   */
  const origami = Object.assign(
    Object.create(Prototype()),
    args.filter(el => possibleFoldObject(el)).shift() || Create.square()
  );
  // apply preferences
  const preferences = {};
  Object.assign(preferences, DEFAULTS);
  const userDefaults = parsePreferences(...args);
  Object.keys(userDefaults)
    .forEach((key) => { preferences[key] = userDefaults[key]; });
  // attach methods
  Object.defineProperty(origami, "fold", { value: fold });
  Object.defineProperty(origami, "unfold", { value: unfold });
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
  Object.assign(origami, getView(origami, ...args));
  // origami.prototype.svg = getView(origami, ...args).svg;
  // if view exists, call first draw
  if (origami.svg) { origami.svg.draw(); }
  return origami;
};

export default init;
