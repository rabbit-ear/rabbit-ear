/**
 * Origami - one of the main entry points for this library.
 * this will create a graph() object (FOLD format) and bind it to a view
 */

import View from "./view";
import Prototype from "./prototype";
import convert from "../convert/convert";
import { possibleFoldObject } from "../FOLD/validate";
import { square } from "../FOLD/create";
import {
  make_vertices_coords_folded,
  make_faces_matrix
} from "../FOLD/make";

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

const isOrigamiFolded = function(graph) {
  if (graph == undefined || graph.frame_classes == undefined) { return false; }
  let frame_classes = graph.frame_classes;
  if (frame > 0 &&
     graph.file_frames[frame - 1] != undefined &&
     graph.file_frames[frame - 1].frame_classes != undefined) {
    frame_classes = graph.file_frames[frame - 1].frame_classes;
  }
  // try to discern folded state
  if (frame_classes.includes("foldedForm")) {
    return true;
  }
  if (frame_classes.includes("creasePattern")) {
    return false;
  }
  // inconclusive
  return false;
};

// fold() should fold everything "collapse" if there are no arguments.
// if there are no mountain valley assignments, it should fold on all marks
// otherwise it should ignore marks.

/**
 * setting the "folded state" does two things:
 * - assign the class of this object to be "foldedForm" or "creasePattern"
 * - move (and cache) foldedCoords or unfoldedCoords into vertices_coords
 */
const setFoldedForm = function (graph, isFolded) {
  const wasFolded = isOrigamiFolded(graph);
  const remove = isFolded ? "creasePattern" : "foldedForm";
  const add = isFolded ? "foldedForm" : "creasePattern";
  if (graph.frame_classes == null) { graph.frame_classes = []; }
  while (graph.frame_classes.indexOf(remove) !== -1) {
    graph.frame_classes.splice(graph.frame_classes.indexOf(remove), 1);
  }
  if (graph.frame_classes.indexOf(add) === -1) {
    graph.frame_classes.push(add);
  }
  // move unfolded_coords or folded_coords into the main vertices_coords spot
  const to = isFolded ? "vertices_re:foldedCoords" : "vertices_re:unfoldedCoords";
  const from = isFolded ? "vertices_re:unfoldedCoords" : "vertices_re:foldedCoords";
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
  // validate and add anything missing.
  // validate(origami);
  // origami.clean();
  // origami.populate();

  const collapse = function (options = {}) {
    if ("faces_re:matrix" in origami === false) {
      origami["faces_re:matrix"] = make_faces_matrix(origami, options.face);
    }
    if ("vertices_re:foldedCoords" in origami === false) {
      origami["vertices_re:foldedCoords"] = make_vertices_coords_folded(origami, null, origami["faces_re:matrix"]);
    }
    setFoldedForm(origami, true);
    origami.didChange.forEach(f => f());
    return origami;
  };

  const flatten = function () {
    setFoldedForm(origami, false);
    origami.didChange.forEach(f => f());
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
  // Object.defineProperty(origami, "options", { get: () => options });
  Object.defineProperty(origami, "collapse", { value: collapse });
  Object.defineProperty(origami, "flatten", { value: flatten });
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
