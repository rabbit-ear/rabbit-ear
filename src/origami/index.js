/**
 * Origami - one of the main entry points for this library.
 * this will create a graph() object (FOLD format) and bind it to a view
 */

import math from "../../include/math";
import convert from "../convert/convert";
import { possibleFoldObject } from "../FOLD/validate";
import * as Create from "../FOLD/create";
import { keys, fold_keys, file_spec, file_creator } from "../FOLD/keys";
import { clone } from "../FOLD/object";
import { get_boundary } from "../FOLD/boundary";
import prototype from "../graph/prototype";
import MakeFold from "../fold-through-all/index";
import build_diagram_frame from "../diagram/diagram_frame";
import addEdge from "../FOLD/add_edge";
import isFoldedState from "../FOLD/folded";

import View from "./view";
import { get_assignment } from "./args";
import getBoundaries from "./boundaries";
import * as CreasePattern from "./creasePattern";
import setFoldedForm from "./fold";
import export_object from "./export";

const extensions = ["faces_re:matrix", "faces_re:layer"];

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
    Object.create(prototype()),
    args.filter(a => possibleFoldObject(a) > 0)
      .sort((a, b) => possibleFoldObject(b) - possibleFoldObject(a))
      .shift() || Create.square()
  );
  /**
   * @param {object} can be a FOLD object, SVG, Oripa file, any valid format.
   * @param {options}
   *   "append" import will first, clear FOLD keys. "append":true prevents this clearing
   */
  const load = function (object, options = {}) {
    const foldObject = convert(object).fold();
    if (options.append !== true) {
      keys.forEach(key => delete origami[key]);
      extensions.forEach(key => delete origami[key]);
    }
    // allow overwriting of file_spec and file_creator if included in import
    Object.assign(origami, { file_spec, file_creator }, clone(foldObject));
    origami.changed.update(origami.load);
  };
  /**
   * fold() with no arguments will perform a global collapse on all creases
   * and if and only if there are mountain valley assignments, it ignores marks
   */
  const crease = function (...methodArgs) {
    const objects = methodArgs.filter(p => typeof p === "object");
    const line = math.core.get_line(methodArgs);
    const assignment = get_assignment(...methodArgs) || "V";
    const face_index = methodArgs.filter(a => a !== null && !isNaN(a)).shift();
    if (!math.core.is_vector(line.origin) || !math.core.is_vector(line.vector)) {
      console.warn("fold was not supplied the correct parameters");
      return;
    }
    // if folding on a foldedForm do the below
    // if folding on a creasePattern, add these
    // let matrix = pattern.cp["faces_re:matrix"] !== null ? pattern.cp["faces_re:matrix"]

    // let mat_inv = matrix
    //  .map(mat => Geom.core.invert_matrix2(mat))
    //  .map(mat => Geom.core.multiply_matrix2_line2(mat, point, vector));

    const folded = MakeFold(origami,
      line.origin,
      line.vector,
      face_index,
      assignment);

    Object.keys(folded).forEach((key) => { origami[key] = folded[key]; });

    if ("re:construction" in origami === true) {
      if (objects.length > 0 && "axiom" in objects[0] === true) {
        origami["re:construction"].axiom = objects[0].axiom;
        origami["re:construction"].parameters = objects[0].parameters;
      }
      origami["re:diagrams"] = [
       build_diagram_frame(origami)
      ];
    }
    // todo, need to grab the crease somehow
    // const crease = component.crease(origami, [diff.edges_new[0] - edges_remove_count]);
    // didModifyGraph();
    // return crease;
  };

  const line = function (...methodArgs) {
    if (CreasePattern.line.call(origami, ...methodArgs)) {
      origami.changed.update(line);
    }
  }
  const ray = function (...methodArgs) {
    if (CreasePattern.ray.call(origami, ...methodArgs)) {
      origami.changed.update(ray);
    }
  }
  const segment = function (...methodArgs) {
    if (CreasePattern.segment.call(origami, ...methodArgs)) {
      origami.changed.update(segment);
    }
  }

  const fold = function (...methodArgs) {
    // do some specific fold operation
    if (methodArgs.length > 0) {
      crease(...methodArgs);
      origami.changed.update(origami.fold);
      return origami;
    } else {
      // collapse on all creases.
      setFoldedForm(origami, true);
      origami.changed.update(origami.fold);
      return origami;
    }
  };

  const unfold = function () {
    setFoldedForm(origami, false);
    // origami.didChange.forEach(f => f());
    origami.changed.update(origami.unfold);
    return origami;
  };

  // apply preferences
  const options = {};
  Object.assign(options, DEFAULTS);
  const userDefaults = parseOptions(...args);
  Object.keys(userDefaults)
    .forEach((key) => { options[key] = userDefaults[key]; });

  // attach methods
  // Object.defineProperty(origami, "options", { get: () => options });
  Object.defineProperty(origami, "boundaries", {
    get: () => getBoundaries.call(origami) });
  Object.defineProperty(origami, "load", { value: load });
  Object.defineProperty(origami, "isFolded", { get: () => isFoldedState(origami) });
  Object.defineProperty(origami, "fold", { value: fold });
  Object.defineProperty(origami, "unfold", { value: unfold });
  Object.defineProperty(origami, "export", { get: () => export_object(origami) });
  // crease pattern methods
  Object.defineProperty(origami, "line", { value: line });
  Object.defineProperty(origami, "ray", { value: ray });
  Object.defineProperty(origami, "segment", { value: segment });

  ///
  //  didDraw = function () {};  // callback after draw happened. lets you update your draw stuff.
  //

  // determine if it should have a view
  View(origami, ...args);

  return origami;
};

Origami.empty = (...args) => Origami(Create.empty(), ...args);
Origami.square = (...args) => Origami(Create.square(), ...args);
Origami.rectangle = (width, height, ...args) => Origami(Create.rectangle(width, height), ...args);
Origami.regularPolygon = (sides = 3, radius = 1, ...args) => Origami(Create.regular_polygon(sides, radius), ...args);

export default Origami;
