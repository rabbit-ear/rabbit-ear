// MIT open source license, Robby Kraft

import math from "../../include/math";
import prototype from "../graph/prototype";
import { make_boundary } from "../FOLD/boundary";
import add_edge from "../FOLD/add_edge";
import {
  get_graph_keys_with_prefix,
  transpose_graph_array_at_index
} from "../FOLD/keys";
import crop from "../FOLD/crop";

const makeExistArray = (obj, key) => {
  if (obj[key] === undefined) { obj[key] = []; }
};

const makeCrease = (graph, a, b, c, d, options) => {
  ["vertices_coords",
    "edges_vertices",
    "edges_assignment"].forEach(key => makeExistArray(graph, key));
  // if (args.length === 4 && typeof args[0] === "number") {
  const p = math.core.get_vector_of_vectors([a, b], [c, d]);
  if (p.length === 2) {
    graph.isClean = false;
    return add_edge(graph, p[0][0], p[0][1], p[1][0], p[1][1], options);
  }
  return undefined;
};

const CPProto = Object.create(prototype);

let isClean = true;

Object.defineProperty(CPProto, "isClean", {
  get: () => isClean,
  set: (c) => { isClean = c; },
  enumerable: false
});

["circle", "ellipse", "rect", "polygon"].forEach((fName) => {
  CPProto[fName] = function () {
    const obj = math[fName](...arguments);
    if (!obj) { return; }
    const s = obj.segments();
    s.forEach(seg => this.mountain(
      seg[0][0],
      seg[0][1],
      seg[1][0],
      seg[1][1]
    ));
  };
});

["line", "ray", "segment"].forEach((fName) => {
  CPProto[fName] = function () {
    if (!this.clip && (fName === "line" || fName === "ray")) {
      console.warn("line and ray are infinite and require a boundary to clip.");
      return;
    }
    const obj = math[fName](...arguments);
    if (!obj) { return; }
    const s = obj.segments();
    s.forEach(seg => this.mountain(
      seg[0][0],
      seg[0][1],
      seg[1][0],
      seg[1][1]
    ));
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

CPProto.mountain = function (a, b, c, d) {
  const crease = makeCrease(this, a, b, c, d, {
    edges_assignment: "M",
    edges_foldAngle: -180
  });
  const that = this;
  return crease.new.edges.map((e) => {
    const res = transpose_graph_array_at_index(this, "edges", e.index);
    return new Proxy(res, {
      set: function set(target, property, value, receiver) {
        target[property] = value;
        that[`edges_${property}`][e.index] = value;
        return true;
      }
    });
  }).shift();
  // console.log(info);
  // return info;
  // this.changed.update(this.clear);
};

CPProto.valley = function (a, b, c, d) {
  const crease = makeCrease(this, a, b, c, d, {
    edges_assignment: "V",
    edges_foldAngle: 180
  });
  const that = this;
  return crease.new.edges.map((e) => {
    const res = transpose_graph_array_at_index(this, "edges", e.index);
    return new Proxy(res, {
      set: function set(target, property, value, receiver) {
        target[property] = value;
        that[`edges_${property}`][e.index] = value;
        return true;
      }
    });
  }).shift();
  // this.changed.update(this.clear);
};

CPProto.mark = function (a, b, c, d) {
  return makeCrease(this, a, b, c, d, { edges_assignment: "F", edges_foldAngle: 0 });
  // this.changed.update(this.clear);
};

CPProto.crop = function (polygon) {
  crop(this, polygon);
  this.isClean = false;
  this.clean();
};
// GraphProto.nearestVertex = function (...args) {
//   const index = nearest_vertex(this, math.core.get_vector(...args));
//   const result = transpose_graph_array_at_index(this, "vertices", index);
//   setup_vertex.call(this, result, index);
//   result.index = index;
//   return result;
// };


/**
 * export
 * @returns {this} a deep copy of this object
 */
// CPProto.copy = function () {
//   return Object.assign(Object.create(Prototype()), clone(this));
// };

// Object.defineProperty(CPProto, "bounds", { get: getBounds });

// export default Object.freeze(CPProto);
export default CPProto;
