// MIT open source license, Robby Kraft

import math from "../../include/math";
import {
  transpose_graph_arrays,
  transpose_graph_array_at_index,
  fold_keys,
  keys,
  file_spec,
  file_creator
} from "../core/keys";
import fragment from "../core/fragment";
import clean from "../core/clean";
import join from "../core/join";
import rebuild from "../core/rebuild";
import populate from "../core/populate";
import {
  bounding_rect,
  get_boundary,
} from "../core/boundary";
import * as Transform from "../core/affine";
import {
  nearest_vertex,
  nearest_edge,
  face_containing_point,
  implied_vertices_count
} from "../core/query";
import { clone } from "../core/object";
import changed from "./changed";

const vertex_degree = function (v, i) {
  const graph = this;
  Object.defineProperty(v, "degree", {
    get: () => (graph.vertices_vertices && graph.vertices_vertices[i]
      ? graph.vertices_vertices[i].length
      : null)
  });
};

const edge_coords = function (e, i) {
  const graph = this;
  Object.defineProperty(e, "coords", {
    get: () => {
      if (!graph.edges_vertices
        || !graph.edges_vertices[i]
        || !graph.vertices_coords) {
        return undefined;
      }
      return graph.edges_vertices[i].map(v => graph.vertices_coords[v]);
    }
  });
};

const face_simple = function (f, i) {
  const graph = this;
  Object.defineProperty(f, "simple", {
    get: () => {
      if (!graph.faces_vertices || !graph.faces_vertices[i]) { return null; }
      for (let j = 0; j < f.length - 1; j += 1) {
        for (let k = j + 1; k < f.length; k += 1) {
          if (graph.faces_vertices[i][j] === graph.faces_vertices[i][k]) {
            return false;
          }
        }
      }
      return true;
    }
  });
};

const face_coords = function (f, i) {
  const graph = this;
  Object.defineProperty(f, "coords", {
    get: () => {
      if (!graph.faces_vertices
        || !graph.faces_vertices[i]
        || !graph.vertices_coords) {
        return undefined;
      }
      return graph.faces_vertices[i].map(v => graph.vertices_coords[v]);
    }
  });
};

const setup_vertex = function (v, i) {
  vertex_degree.call(this, v, i);
};

const setup_edge = function (e, i) {
  edge_coords.call(this, e, i);
};

const setup_face = function (f, i) {
  face_simple.call(this, f, i);
  face_coords.call(this, f, i);
};

const GraphProto = {};
GraphProto.changed = changed();
/**
 * @param {object} is a FOLD object.
 * @param {options}
 *   "append" import will first, clear FOLD keys. "append":true prevents this clearing
 */
GraphProto.load = function (object, options = {}) {
  if (typeof object !== "object") { return; }
  if (options.append !== true) {
    keys.forEach(key => delete this[key]);
  }
  // allow overwriting of file_spec and file_creator if included in import
  Object.assign(this, { file_spec, file_creator }, clone(object));
  this.changed.update(this.load);
};
/**
 * this performs a planar join, merging the two graphs, fragmenting, cleaning.
 */
GraphProto.join = function (object, epsilon) {
  join(this, object, epsilon);
  this.changed.update(this.join);
};
/**
 * this clears all components from the graph, leaving other keys untouched.
 */
GraphProto.clear = function () {
  fold_keys.graph.forEach(key => delete this[key]);
  fold_keys.orders.forEach(key => delete this[key]);
  this.changed.update(this.clear);
};
/**
 * export
 * @returns {this} a deep copy of this object
 */
GraphProto.copy = function () {
  return Object.assign(Object.create(GraphProto), clone(this));
};
/**
 * modifiers
 */
GraphProto.clean = function (options) {
  clean(this, options);
  this.changed.update(this.clean);
};
GraphProto.populate = function () {
  populate(this);
  this.changed.update(this.populate);
};
// GraphProto.fragment = function (epsilon = math.core.EPSILON) {
//   fragment(this, epsilon);
//   this.changed.update(this.fragment);
// };
GraphProto.fragment = function (edges, epsilon = math.core.EPSILON) {
  fragment(this, edges, epsilon);
  this.changed.update(this.fragment);
};
GraphProto.rebuild = function (epsilon = math.core.EPSILON) {
  rebuild(this, epsilon);
  this.changed.update(this.rebuild);
};
/**
 * transformations
 */
GraphProto.translate = function (...args) {
  Transform.transform_translate(this, ...args);
  this.changed.update(this.translate);
};
// GraphProto.rotate = function (...args) {
//   Transform.transform_rotate(this, ...args);
// };
GraphProto.scale = function (...args) {
  Transform.transform_scale(this, ...args);
  this.changed.update(this.scale);
};
/**
 * graph components
 */
const getVertices = function () {
  const transposed = transpose_graph_arrays(this, "vertices");
  const vertices = transposed.length !== 0
    ? transposed
    : Array.from(Array(implied_vertices_count(this))).map(() => ({}));
  vertices.forEach(setup_vertex.bind(this));
  return vertices;
};
const getEdges = function () {
  // left off here
  const edgesT = transpose_graph_arrays(this, "edges");
  const edges = edgesT.map(e => math.segment(e));
  edges.forEach(setup_edge.bind(this));
  return edges;
};
const getFaces = function () {
  const faces = transpose_graph_arrays(this, "faces");
  faces.forEach(setup_face.bind(this));
  return faces;
};
const getBoundary = function () {
  return math.polygon(
    get_boundary(this).vertices.map(i => this.vertices_coords[i])
  );
};
const getBounds = function () {
  return math.rect(...bounding_rect(this));
};
/**
 * graph components based on Euclidean distance
 */
GraphProto.nearestVertex = function (...args) {
  const index = nearest_vertex(this, math.core.get_vector(...args));
  const result = transpose_graph_array_at_index(this, "vertices", index);
  setup_vertex.call(this, result, index);
  result.index = index;
  return result;
};
GraphProto.nearestEdge = function (...args) {
  const index = nearest_edge(this, math.core.get_vector(...args));
  const result = transpose_graph_array_at_index(this, "edges", index);
  setup_edge.call(this, result, index);
  result.index = index;
  return result;
};
GraphProto.nearestFace = function (...args) {
  const index = face_containing_point(this, math.core.get_vector(...args));
  if (index === undefined) { return undefined; }
  // todo, if point isn't inside a face, there can still exist a nearest face
  const result = transpose_graph_array_at_index(this, "faces", index);
  setup_face.call(this, result, index);
  result.index = index;
  return result;
};
GraphProto.nearest = function (...args) {
  const target = math.core.get_vector(...args);
  const nears = {
    vertex: this.nearestVertex(this, target),
    edge: this.nearestEdge(this, target),
    face: this.nearestFace(this, target)
  };
  Object.keys(nears)
    .filter(key => nears[key] == null)
    .forEach(key => delete nears[key]);
  return nears;
};

Object.defineProperty(GraphProto, "vertices", { get: getVertices });
Object.defineProperty(GraphProto, "edges", { get: getEdges });
Object.defineProperty(GraphProto, "faces", { get: getFaces });
Object.defineProperty(GraphProto, "boundary", { get: getBoundary });
Object.defineProperty(GraphProto, "bounds", { get: getBounds });

// Object.freeze(GraphProto);

export default GraphProto;
