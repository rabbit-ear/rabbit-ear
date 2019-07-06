import Prototype from "../fold/prototype";
import load_file from "../files/load_sync";
import { make_vertices_coords_folded, make_faces_matrix } from "../fold/make";
import { possibleFoldObject } from "../fold/validate";
import * as Create from "../fold/create";
import { keys as foldKeys } from "../fold/keys";
import { clone } from "../fold/object";

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

const Origami = function (...args) {
  /** */
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

  const fold = function (stationary_face = 0) {
    if ("faces_re:matrix" in this === false) {
      this["faces_re:matrix"] = make_faces_matrix(this, stationary_face);
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

export default Origami;
