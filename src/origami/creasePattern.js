import math from "../../include/math";
import { get_boundary } from "../FOLD/boundary";
import fragment from "../FOLD/fragment";
import populate from "../FOLD/populate";

const FACES_MATRIX = "faces_re:matrix";
const FACES_LAYER = "faces_re:layer";

const removeLayerInformation = function (graph) {
  if (graph[FACES_LAYER]) { delete graph[FACES_LAYER]; }
  if (graph[FACES_MATRIX]) { delete graph[FACES_MATRIX]; }
};

const get_assignment = function (...args) {
  return args.filter(a => typeof a === "string")
    .filter(a => a.length === 1)
    .shift();
};

let lastTriggerUpdate = (new Date()).getTime();
let triggerUpdateTimer;
const triggerUpdate = () => {
  const now = (new Date()).getTime();
  if (now - lastTriggerUpdate < 100) {
    // too soon
    lastTriggerUpdate = now;
    // setup timeout in case this was the last call
    if (triggerUpdateTimer === undefined);
    triggerUpdateTimer = setTimeout(triggerUpdate, 200);
    clearTimeout(triggerUpdateTimer);
  } else {

  }
};

// const addLineType = function (getFunc, clipFunc, ...args) {
//   console.log("addLineType, this", this);
//   const l = getFunc(...args);
//   const assignment = get_assignment(...args) || "F";
//   // clip in boundary
//   const poly = get_boundary(this).vertices.map(v => this.vertices_coords[v]);
//   const c = clipFunc(poly, l);
//   addEdge(this, c[0], c[1], c[2], c[3], assignment).apply();
//   fragment(this);
//   populate(this);
//   // get arguments: two endpoints, optional crease assignment
//   // const edges = Collinear.collinear_edges(this, [c[0], c[1]], [c[2] - c[0], c[3] - c[1]]);
//   // return Edges(this, edges);
// };

const addLineType = function (getFunc, clipFunc, ...args) {
  const l = getFunc(...args);
  const assignment = get_assignment(...args) || "F";
  // clip in boundary
  const poly = get_boundary(this).vertices.map(v => this.vertices_coords[v]);
  const c = clipFunc(poly, l);
  // addEdge(this, c[0], c[1], c[2], c[3], assignment).apply();
  this.vertices_coords.push(c[0], c[1]);
  this.edges_vertices.push([this.vertices_coords.length - 2, this.vertices_coords.length - 1]);
  this.edges_assignment.push(assignment);
  if (triggerUpdate()) { return false; }
  fragment(this);
  populate(this);
  removeLayerInformation(this);
  return true;
};

export const segment = function (...args) {
  return addLineType.call(this,
    math.core.get_segment,
    (poly, l) => math.core.intersection.convex_poly_segment(poly, l[0], l[1]),
    ...args);
};

export const ray = function (...args) {
  return addLineType.call(this,
    math.core.get_line,
    (poly, r) => math.core.intersection.convex_poly_ray(poly, r.origin, r.vector),
    ...args);
};

export const line = function (...args) {
  return addLineType.call(this,
    math.core.get_line,
    (poly, l) => math.core.intersection.convex_poly_line(poly, l.origin, l.vector),
    ...args);
};
