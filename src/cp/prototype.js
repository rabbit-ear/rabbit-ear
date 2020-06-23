// MIT open source license, Robby Kraft

import math from "../../include/math";
import prototype from "../graph/prototype";
import { make_boundary } from "../FOLD/boundary";
import add_edge from "../FOLD/add_edge";

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
  return makeCrease(this, a, b, c, d, { edges_assignment: "M", edges_foldAngle: -180 });
  // console.log(info);
  // return info;
  // this.changed.update(this.clear);
};

CPProto.valley = function (a, b, c, d) {
  return makeCrease(this, a, b, c, d, { edges_assignment: "V", edges_foldAngle: 180 });
  // this.changed.update(this.clear);
};

CPProto.mark = function (a, b, c, d) {
  return makeCrease(this, a, b, c, d, { edges_assignment: "F", edges_foldAngle: 0 });
  // this.changed.update(this.clear);
};

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
