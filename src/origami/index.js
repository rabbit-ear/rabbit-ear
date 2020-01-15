/**
 * Origami - one of the main entry points for this library.
 * this will create a graph() object (FOLD format) and bind it to a view
 */

import View from "./view";
import Prototype from "./prototype";
import convert from "../convert/convert";
import { possibleFoldObject } from "../FOLD/validate";
import { square } from "../FOLD/create";
import populate from "../FOLD/populate";
import {
  make_vertices_coords_folded,
  make_faces_matrix
} from "../FOLD/make";

const FOLDED_FORM = "foldedForm";
const CREASE_PATTERN = "creasePattern";
const VERTICES_FOLDED_COORDS = "vertices_re:foldedCoords"
const VERTICES_UNFOLDED_COORDS = "vertices_re:unfoldedCoords"
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
const isOrigamiFolded = function(graph) {
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
      // build folded coords
      if (!(FACES_MATRIX in graph)) {
        // if faces do not exist, rebuild faces_vertices
        if (graph.faces_vertices == null) { populate(graph); }
        // graph[FACES_MATRIX] = make_faces_matrix(graph, options.face);
        graph[FACES_MATRIX] = make_faces_matrix(graph, 0);
      }
      if (!(VERTICES_FOLDED_COORDS in graph)) {
        graph[VERTICES_FOLDED_COORDS] = make_vertices_coords_folded(graph, null, graph[FACES_MATRIX]);
      }
    }
  } else {
    // if unfolded coords do not exist, we need to build unfolded coords from a folded state?
  }
  const to = isFolded ? VERTICES_FOLDED_COORDS : VERTICES_UNFOLDED_COORDS;
  const from = isFolded ? VERTICES_UNFOLDED_COORDS : VERTICES_FOLDED_COORDS;
  if (to in graph === true) {
    graph[from] = graph.vertices_coords;
    graph.vertices_coords = graph[to];
    delete graph[to];
  }
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
  /**
   * fold() with no arguments will perform a global collapse on all creases
   * and if and only if there are mountain valley assignments, it ignores marks
   */
  const fold = function (...args) {
    if (args.length === 0) {
      // collapse on all creases.
      setFoldedForm(origami, true);
      origami.didChange.forEach(f => f());
    } else {
      // do some specific fold operation
    }
    return origami;
  };

  const unfold = function () {
    setFoldedForm(origami, false);
    origami.didChange.forEach(f => f());
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

export default Origami;
