/**
 * Origami - one of the main entry points for this library.
 * this will create a graph() object (FOLD format) and bind it to a view
 */

import FoldToSvg from "../../include/fold-to-svg";

import View from "./view";
import Prototype from "./prototype";

import convert from "../convert/convert";
import {
  make_vertices_coords_folded,
  make_faces_matrix
} from "../FOLD/make";
import { possibleFoldObject } from "../FOLD/validate";
import {
  keys as foldKeys,
  future_spec as re
} from "../FOLD/keys";
import { square } from "../FOLD/create";

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
  origami.populate();
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

  // apply preferences
  const options = {};
  Object.assign(options, DEFAULTS);
  const userDefaults = parseOptions(...args);
  Object.keys(userDefaults)
    .forEach((key) => { options[key] = userDefaults[key]; });

  // attach methods
  Object.defineProperty(origami, "collapse", { value: collapse });
  Object.defineProperty(origami, "flatten", { value: flatten });
  Object.defineProperty(origami, "fold", { value: fold });
  Object.defineProperty(origami, "unfold", { value: unfold });

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
  //         return FoldToSvg(origami);
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
    return FoldToSvg(origami);
  };

  Object.defineProperty(origami, "snapshot", { get: () => exportObject });
  Object.defineProperty(origami, "export", { get: () => exportObject });
  Object.defineProperty(origami, "options", { get: () => options });

  // determine if it should have a view
  View(origami, ...args);

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

export default Origami;
