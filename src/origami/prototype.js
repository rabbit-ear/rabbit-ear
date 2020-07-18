// MIT open source license, Robby Kraft
import math from "../../include/math";

import prototype from "../graph/prototype";

import MakeFold from "../fold-through-all/index";
import addEdge from "../core/add_edge";
import split_face from "../core/split_face";
import rebuild from "../core/rebuild";
import { clone } from "../core/object";
import { kawasaki_collapse } from "../kawasaki/index";
import { get_assignment } from "./args";

import * as Collinear from "../core/collinear";
import Edges from "./edges";

const MARK_DEFAULTS = {
  rebuild: true,
  change: true,
};

export const possible_mark_object = function (o) {
  if (typeof o !== "object" || o === null) { return false; }
  const argKeys = Object.keys(o);
  const defaultKeys = Object.keys(MARK_DEFAULTS);
  for (let i = 0; i < argKeys.length; i += 1) {
    if (defaultKeys.includes(argKeys[i])) { return true; }
  }
  return false;
};

const get_mark_options = function (...args) {
  const options = args.filter(o => typeof o === "object")
    .filter(o => possible_mark_object(o))
    .shift();
  return options === undefined
    ? clone(MARK_DEFAULTS)
    : Object.assign(clone(MARK_DEFAULTS), options);
};



// proto.segment = function (...args) {
//   // get segment
//   const s = math.core.flatten_input(...args)
//     .filter(n => typeof n === "number");
//   // clip in boundary
//   const boundary = getBoundaries.call(this);
//   const c = boundary.clipSegment([s[0], s[1]], [s[2], s[3]]);
//   // get arguments: two endpoints, optional crease assignment
//   const assignment = get_assignment(...args) || "F";
//   addEdge(this, c[0], c[1], c[2], c[3], assignment);
//   rebuild(this);
//   const edges = Collinear.collinear_edges(this, [c[0], c[1]], [c[2] - c[0], c[3] - c[1]]);
//   return Edges(this, edges);
// };

// proto.line = function (...args) {
//   // get segment
//   const l = math.core.flatten_input(...args)
//     .filter(n => typeof n === "number");
//   // clip in boundary
//   const boundary = getBoundaries.call(this);
//   const s = boundary.clipLine([l[0], l[1]], [l[2], l[3]]);
//   // get arguments: two endpoints, optional crease assignment
//   const assignment = get_assignment(...args) || "F";
//   addEdge(this, s[0], s[1], s[2], s[3], assignment);
//   rebuild(this);
//   const edges = Collinear.collinear_edges(this, [s[0], s[1]], [s[2] - s[0], s[3] - s[1]]);
//   return Edges(this, edges);
// };

// proto.axiom = function (...args) {
//   RabbitEar.axiom(2, start[0], start[1], end[0], end[1])
//     .solutions
//     .forEach(s => app.origami.line(s[0][0], s[0][1], s[1][0], s[1][1]));
//   // fragment(this);

//   // get segment
//   const l = math.core.flatten_input(...args)
//     .filter(n => typeof n === "number");
//   // clip in boundary
//   const boundary = getBoundaries.call(this);
//   const s = boundary.clipLine([l[0], l[1]], [l[2], l[3]]);
//   // get arguments: two endpoints, optional crease assignment
//   const assignment = get_assignment(...args) || "F";
//   addEdge(this, s[0], s[1], s[2], s[3], assignment);
//   rebuild(this);
//   const edges = Collinear.collinear_edges(this, [s[0], s[1]], [s[2] - s[0], s[3] - s[1]]);
//   return Edges(this, edges);
// };

/**
 * add a line segment to the graph.
 * if endpoints lie on an existing vertex this will reuse vertices.
 * this triggers a rebuild on all arrays
 *
 * @param {number[]} segment defined by two points [x, y]
 * @param {string} optional "M" "V" "F" "U" crease assignment. default is "F"
 */
// proto.mark = function (...args) {
//   // get arguments. 2 endpoints. optional crease assignment
//   const s = math.core.get_vector_of_vectors(...args);
//   const options = get_mark_options(...args);
//   const assignment = get_assignment(...args) || "F";
//   // add segment, rebuild all arrays
//   addEdge(this, s[0][0], s[0][1], s[1][0], s[1][1], assignment);
//   if (options.rebuild) { rebuild(this); }
//   // make a record documenting how we got here
//   // axiom1(s[0], s[1]);
//   // madeBy().axiom1(s[0], s[1]);
//   this.didChange.forEach(f => f());
// };

// fold methods
proto.crease = function (...args) { // point, vector, face_index) {
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

  const folded = MakeFold(this,
    line.origin,
    line.vector,
    face_index,
    assignment);

  Object.keys(folded).forEach((key) => { this[key] = folded[key]; });

  if ("re:construction" in this === true) {
    if (objects.length > 0 && "axiom" in objects[0] === true) {
      this["re:construction"].axiom = objects[0].axiom;
      this["re:construction"].parameters = objects[0].parameters;
    }
    // this["re:diagrams"] = [
    //  Diagram.build_diagram_frame(this)
    // ];
  }
  // todo, need to grab the crease somehow
  // const crease = component.crease(this, [diff.edges_new[0] - edges_remove_count]);
  // didModifyGraph();
  // return crease;
};

// proto.creaseRay = function (...args) {
//   const ray = math.ray(args);
//   const faces = this.faces_vertices.map(fv => fv.map(v => this.vertices_coords[v]));
//   const intersecting = faces
//     .map((face, i) => (math.core.intersection
//       .convex_poly_ray_exclusive(face, ray.origin, ray.vector) === undefined
//       ? undefined : i))
//     .filter(a => a !== undefined)
//     .sort((a, b) => b - a);

//   intersecting.forEach(index => split_face(
//     this, index, ray.origin, ray.vector, "F"
//   ));
// };

// proto.kawasaki = function (...args) {
//   const crease = kawasaki_collapse(this, ...args);
//   return crease;
// };
