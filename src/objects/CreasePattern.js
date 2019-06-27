import math from "../../include/math";
import Prototype from "../fold/prototype";
import * as Create from "../fold/create";
import { possibleFoldObject } from "../fold/validate";
import { keys as foldKeys } from "../fold/spec";
import { rebuild as clean } from "../graph/rebuild";
// import * as Diagram from "../frames/diagram_frame";

const prepareGraphModify = function (graph) {
  delete graph["re:construction"];
};

/**
 * an important thing this class offers: this component array
 * each object matches 1:1 a component in the FOLD graph.
 * when a graph component gets removed, its corresponding object deletes
 * itself so even if the user holds onto it, it no longer points to anything.
 * each component brings extra functionality to these edges/faces/vertices.
 * take great care to make sure they are always matching 1:1.
 * keys are each component's UUID for speedy lookup.
 */

/** A graph is a set of nodes and edges connecting them */
const CreasePattern = function (...args) {
  // const proto = Prototype();
  // const graph = Object.create(proto);
  // proto.bind(graph);
  // parse arguments, look for an input .fold file
  // todo: which key should we check to verify .fold? coords /=/ abstract CPs
  const foldObjs = args
    .filter(el => typeof el === "object" && el !== null)
    .filter(el => possibleFoldObject(el));
    // .filter(el => el.vertices_coords != null);
  // unit square is the default base if nothing else is provided
  // load((foldObjs.shift() || Create.square()));

  const graph = Object.assign(
    Object.create(Prototype()),
    foldObjs.shift() || Create.square()
  );

  /**
   * what counts as a valid crease pattern? it contains:
   * vertices_coords, vertices_vertices
   * edges_vertices, edges_assignment
   * faces_vertices, faces_edges
   */
  const validate_and_clean = function (epsilon = math.core.EPSILON) {
    const valid = ("vertices_coords" in this && "vertices_vertices" in this
      && "edges_vertices" in this && "edges_assignment" in this
      && "faces_vertices" in this && "faces_edges" in this);
    if (!valid) {
      console.log("load() crease pattern missing geometry arrays. rebuilding. geometry indices will change");
      clean(epsilon);
    }
  };

  const svg = function (cssRules) {
    // return Convert.fold_to_svg(_this, cssRules);
  };

  /**
   * @param {file} is a FOLD object.
   * @param {prevent_wipe} if true import will skip clearing
   */
  const load = function (file, prevent_wipe) {
    if (prevent_wipe == null || prevent_wipe !== true) {
      foldKeys.forEach(key => delete this[key]);
    }
    Object.assign(this, JSON.parse(JSON.stringify(file)));
    validate_and_clean();
    // placeholderFoldedForm(_this);
  };

  Object.defineProperty(graph, "load", { value: load });
  Object.defineProperty(graph, "svg", { value: svg });

  return graph;
};

CreasePattern.square = function () {
  return CreasePattern(Create.rectangle(1, 1));
};

CreasePattern.rectangle = function (width = 1, height = 1) {
  return CreasePattern(Create.rectangle(width, height));
};

CreasePattern.regularPolygon = function (sides, radius = 1) {
  if (sides == null) {
    console.warn("regularPolygon requires number of sides parameter");
  }
  return CreasePattern(Create.regular_polygon(sides, radius));
};

export default CreasePattern;
