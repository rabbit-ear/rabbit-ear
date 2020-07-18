// MIT open source license, Robby Kraft

import math from "../../include/math";
import prototype from "../graph/prototype";
import { make_boundary } from "../core/boundary";
import add_edge from "../core/add_edge";
import {
  get_graph_keys_with_prefix,
  transpose_graph_array_at_index
} from "../core/keys";
import crop from "../core/crop";

const defaultSegment = {
  edges_assignment: "F",
  edges_foldAngle: 0
};

const makeSureKeyArray = (obj, key) => {
  if (obj[key] === undefined) { obj[key] = []; }
};
const makeSureKeysArray = (obj, keys) => keys
  .forEach(key => makeSureKeyArray(obj, key));

const NewSegmentsProto = {};
NewSegmentsProto.prototype = Array.prototype;
NewSegmentsProto.prototype.constructor = NewSegmentsProto;
const eachAssign = (arr, assignment, foldAngle) => arr
  .forEach((c) => {
    c.assignment = assignment;
    c.foldAngle = foldAngle;
  });
NewSegmentsProto.prototype.mountain = function (degrees = -180) {
  eachAssign(this, "M", degrees > 0 ? -degrees : degrees);
  return this;
};
NewSegmentsProto.prototype.valley = function (degrees = 180) {
  eachAssign(this, "V", degrees);
  return this;
};
NewSegmentsProto.prototype.mark = function () {
  eachAssign(this, "F", 0);
  return this;
};
NewSegmentsProto.prototype.cut = function () {
  eachAssign(this, "B", 0);
  return this;
};
NewSegmentsProto.prototype.boundary = function () {
  eachAssign(this, "B", 0);
  return this;
};

const creaseSegment = function (graph, segment, options) {
  graph.isClean = false;
  makeSureKeysArray(graph, ["vertices_coords", "edges_vertices", "edges_assignment"]);
  const addEdgeResult = add_edge(graph,
    segment[0][0], segment[0][1], segment[1][0], segment[1][1],
    options);
  const newEdge = addEdgeResult.new.edges[0];
  const res = transpose_graph_array_at_index(graph, "edges", newEdge.index);
  return new Proxy(res, {
    set: (target, property, value) => {
      target[property] = value;
      const key = `edges_${property}`;
      makeSureKeyArray(graph, key);
      graph[key][newEdge.index] = value;
      return true;
    }
  });
};

const creaseSegments = (graph, segments, options) => {
  const creases = Object.create(NewSegmentsProto.prototype);
  creases.length = segments.length;
  segments.forEach((s, i) => {
    creases[i] = creaseSegment(graph, s, options);
  });
  return creases;
};

let isClean = true;
let clipping = false;
let arcSegments = 32;

const CPProto = Object.create(prototype);

Object.defineProperty(CPProto, "isClean", {
  get: () => isClean,
  set: (c) => { isClean = c; },
  enumerable: false
});
Object.defineProperty(CPProto, "clipping", {
  get: () => clipping,
  set: (c) => { clipping = c; },
  enumerable: false
});
Object.defineProperty(CPProto, "arcSegments", {
  get: () => arcSegments,
  set: (c) => { arcSegments = c; },
  enumerable: false
});

["circle", "ellipse", "rect", "polygon"].forEach((fName) => {
  CPProto[fName] = function () {
    const primitive = math[fName](...arguments);
    if (!primitive) { return creaseSegments(this, [], defaultSegment); }
    let s = primitive.segments(this.arcSegments);
    if (this.clipping) {
      console.log("before clip #", s.length);
      s = s.map(seg => this.boundary.clipSegment(seg))
        .filter(a => a !== undefined);
      console.log("after clip #", s.length);
    }
    return creaseSegments(this, s, defaultSegment);
  };
});

const boundaryClip = (cp, fName, primitive) => (fName === "line"
  ? cp.boundary.clipLine(primitive)
  : cp.boundary.clipRay(primitive));

["line", "ray", "segment"].forEach((fName) => {
  CPProto[fName] = function () {
    const primitive = math[fName](...arguments);
    if (!primitive) { return creaseSegments(this, [], defaultSegment); }
    const seg = (fName === "line" || fName === "ray")
      ? boundaryClip(this, fName, primitive)
      : primitive;
    return creaseSegments(this, [seg], defaultSegment);
  };
});

CPProto.makeBoundary = function () {
  if (!this.isClean) { this.clean(); }
  const boundary = make_boundary(this);
  boundary.edges.forEach((edge) => {
    this.edges_assignment[edge] = "B";
    this.edges_foldAngle[edge] = 0;
  });
};

CPProto.clean = function (epsilon = math.core.EPSILON) {
  this.fragment(epsilon);
  this.populate();
  this.isClean = true;
};

// CPProto.mountain = function (shape) {
//   const crease = addEdge(this, shape);
//   {
//     edges_assignment: "M",
//     edges_foldAngle: -180
//   }
//   // this.changed.update(this.clear);
// };

CPProto.crop = function (polygon) {
  crop(this, polygon);
  this.isClean = false;
  this.clean();
};

/**
 * export
 * @returns {this} a deep copy of this object
 */
// CPProto.copy = function () {
//   return Object.assign(Object.create(Prototype()), clone(this));
// };

// export default Object.freeze(CPProto);
export default CPProto;
