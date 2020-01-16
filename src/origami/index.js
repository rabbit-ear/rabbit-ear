/**
 * Origami - one of the main entry points for this library.
 * this will create a graph() object (FOLD format) and bind it to a view
 */

import math from "../../include/math";
import View from "./view";
import convert from "../convert/convert";
import { possibleFoldObject } from "../FOLD/validate";
import * as Create from "../FOLD/create";
import populate from "../FOLD/populate";
import { keys, fold_keys, file_spec, file_creator } from "../FOLD/keys";
import { clone } from "../FOLD/object";
import {
  make_vertices_coords_folded,
  make_faces_matrix
} from "../FOLD/make";
import prototype from "../graph/prototype";
import { get_assignment } from "./args";
import MakeFold from "../fold-through-all/index";

const FOLDED_FORM = "foldedForm";
const CREASE_PATTERN = "creasePattern";
const VERTICES_FOLDED_COORDS = "vertices_re:foldedCoords";
const VERTICES_UNFOLDED_COORDS = "vertices_re:unfoldedCoords";
const FACES_MATRIX = "faces_re:matrix";

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

/**
 * @returns {boolean} is the graph in a folded form? undefined if there is no indication either way.
 */
const isOrigamiFolded = function (graph) {
  if (graph == null || graph.frame_classes == null) { return undefined; }
  if (graph.frame_classes.includes(FOLDED_FORM)) { return true; }
  if (graph.frame_classes.includes(CREASE_PATTERN)) { return false; }
  // inconclusive
  return undefined;
};

/**
 * setting the "folded state" does two things:
 * - assign the class of this object to be FOLDED_FORM or CREASE_PATTERN
 * - move (and cache) foldedCoords or unfoldedCoords into vertices_coords
 */
const setFoldedForm = function (graph, isFolded) {
  if (graph.frame_classes == null) { graph.frame_classes = []; }
  const wasFolded = isOrigamiFolded(graph);
  if (isFolded === wasFolded) { return; } // graph is already folded / unfolded
  // update frame_classes
  graph.frame_classes = graph.frame_classes
    .filter(c => !([CREASE_PATTERN, FOLDED_FORM].includes(c)))
    .concat([isFolded ? FOLDED_FORM : CREASE_PATTERN]);
  // move unfolded_coords or folded_coords into the main vertices_coords spot
  if (isFolded) {
    // if folded coords do not exist, we need to build them.
    if (!(VERTICES_FOLDED_COORDS in graph)) {
      if (graph.faces_vertices == null) { populate(graph); }
      graph[FACES_MATRIX] = make_faces_matrix(graph, 0);
      graph[VERTICES_FOLDED_COORDS] = make_vertices_coords_folded(graph, null, graph[FACES_MATRIX]);
    }
    graph[VERTICES_UNFOLDED_COORDS] = graph.vertices_coords;
    graph.vertices_coords = graph[VERTICES_FOLDED_COORDS];
    delete graph[VERTICES_FOLDED_COORDS];
  } else {
    if (graph[VERTICES_UNFOLDED_COORDS] == null) { return; }
    // if unfolded coords do not exist, we need to build unfolded coords from a folded state?
    graph[VERTICES_FOLDED_COORDS] = graph.vertices_coords;
    graph.vertices_coords = graph[VERTICES_UNFOLDED_COORDS];
    delete graph[VERTICES_UNFOLDED_COORDS];
  }
};

const Origami = function (...args) {
  /**
   * create the object. process initialization arguments
   * by default this will load a unit square graph.
   */
  const origami = Object.assign(
    Object.create(prototype()),
    args.filter(a => possibleFoldObject(a) > 0.1)
      .sort((a, b) => possibleFoldObject(b) - possibleFoldObject(a))
      .shift() || Create.square()
  );
  /**
   * fold() with no arguments will perform a global collapse on all creases
   * and if and only if there are mountain valley assignments, it ignores marks
   */
  const crease = function (...args) {
    const objects = args.filter(p => typeof p === "object");
    const line = math.core.get_line(args);
    const assignment = get_assignment(...args) || "V";
    const face_index = args.filter(a => a !== null && !isNaN(a)).shift();
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

    // if ("re:construction" in origami === true) {
    //   if (objects.length > 0 && "axiom" in objects[0] === true) {
    //     origami["re:construction"].axiom = objects[0].axiom;
    //     origami["re:construction"].parameters = objects[0].parameters;
    //   }
      // origami["re:diagrams"] = [
      //  Diagram.build_diagram_frame(origami)
      // ];
    // }
    // todo, need to grab the crease somehow
    // const crease = component.crease(origami, [diff.edges_new[0] - edges_remove_count]);
    // didModifyGraph();
    // return crease;
  };

  const fold = function (...args) {
    // do some specific fold operation
    if (args.length > 0) {
      crease(...args);
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
  /**
   * @param {object} can be a FOLD object, SVG, Oripa file, any valid format.
   * @param {options}
   *   "append" import will first, clear FOLD keys. "append":true prevents this clearing
   */
  const load = function (object, options = {}) {
    const foldObject = convert(object).fold();
    if (options.append !== true) {
      keys.forEach(key => delete origami[key]);
    }
    // allow overwriting of file_spec and file_creator if included in import
    Object.assign(origami, { file_spec, file_creator }, clone(foldObject));
    origami.changed.update(origami.load);
  };

  // apply preferences
  const options = {};
  Object.assign(options, DEFAULTS);
  const userDefaults = parseOptions(...args);
  Object.keys(userDefaults)
    .forEach((key) => { options[key] = userDefaults[key]; });

  // attach methods
  // Object.defineProperty(origami, "options", { get: () => options });
  Object.defineProperty(origami, "load", { value: load });
  Object.defineProperty(origami, "isFolded", { get: () => isOrigamiFolded(origami) });
  Object.defineProperty(origami, "fold", { value: fold });
  Object.defineProperty(origami, "unfold", { value: unfold });
  Object.defineProperty(origami, "export", { get: (...args) => {
    const f = function (...o) {
      if (o.length === 0) { return JSON.stringify(origami); }
      switch (o[0]) {
        case "oripa": return convert(origami, "fold").oripa();
        case "svg": return convert(origami, "fold").svg();
        default: return JSON.stringify(origami);
      }
    };
    f.json = function () { return JSON.stringify(origami); };
    f.fold = function () { return JSON.stringify(origami); };
    f.svg = function () { return convert(origami, "fold").svg(); };
    f.oripa = function () { return convert(origami, "fold").oripa(); };
    return f;
  }});

  // determine if it should have a view
  View(origami, ...args);

  return origami;
};

Origami.empty = () => Origami(Create.empty());
Origami.square = () => Origami(Create.square());
Origami.rectangle = (width, height) => Origami(Create.rectangle(width, height));
Origami.regularPolygon = (sides = 3, radius = 1) => Origami(Create.regular_polygon(sides, radius));

export default Origami;
