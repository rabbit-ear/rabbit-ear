// MIT open source license, Robby Kraft

import math from "../../include/math";
import {
  transpose_geometry_arrays,
  transpose_geometry_array_at_index,
  fold_keys,
  keys,
  file_spec,
  file_creator
} from "../FOLD/keys";
import fragment from "../FOLD/fragment";
import clean from "../FOLD/clean";
import join from "../FOLD/join";
import rebuild from "../FOLD/rebuild";
import populate from "../FOLD/populate";
import {
  nearest_vertex,
  nearest_edge,
  face_containing_point,
  implied_vertices_count
} from "../FOLD/query";
import { clone } from "../FOLD/object";

const vertex_degree = function (v, i, graph) {
  Object.defineProperty(v, "degree", {
    get: () => (graph.vertices_vertices && graph.vertices_vertices[i]
      ? graph.vertices_vertices[i].length
      : null)
  });
};

const face_simple = function (f, i, graph) {
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

const setup_vertex = function (v, i, graph) {
  vertex_degree(v, i, graph);
};

const setup_edge = function () { // (e, i, graph) {

};

const setup_face = function (f, i, graph) {
  face_simple(f, i, graph);
};

const Prototype = function (proto = {}) {
  /**
   * export
   */
  /** @return {this} a deep copy of this object. */
  proto.copy = function () {
    return Object.assign(Object.create(Prototype()), clone(this));
  };
  /**
   * graph components
   */
  const getVertices = function () {
    const transposed = transpose_geometry_arrays(this, "vertices");
    const vertices = transposed.length !== 0
      ? transposed
      : Array.from(Array(implied_vertices_count(this))).map(() => ({}));
    vertices.forEach((v, i) => setup_vertex(v, i, this));
    return vertices;
  };
  const getEdges = function () {
    return transpose_geometry_arrays(this, "edges");
  };
  const getFaces = function () {
    const faces = transpose_geometry_arrays(this, "faces");
    faces.forEach((f, i) => setup_face(f, i, this));
    return faces;
  };
  /**
   * modifiers
   */
  proto.clean = function () {
    clean(this);
  };
  proto.populate = function () {
    populate(this);
  };
  proto.fragment = function (epsilon = 1e-6) {
    fragment(this, epsilon);
  };
  proto.rebuild = function (epsilon = 1e-6) {
    rebuild(this, epsilon);
  };
  /**
   * @param {object} is a FOLD object.
   * @param {options}
   *  - "append": true
   *    by default all FOLD spec keys will be cleared. setting this to true
   *    prevents this clearing
   */
  proto.load = function (object, options = {}) {
    if (options.append !== true) {
      keys.forEach(key => delete this[key]);
    }
    // allow load() to overwrite file_spec and file_creator
    Object.assign(this, { file_spec, file_creator }, clone(object));
  };
  proto.join = function (object, options = {}) {
    if (options.append !== true) { }
    join(this, object);
  };
  /**
   * this clears all components from the graph
   */
  proto.clear = function () {
    fold_keys.graph.forEach(key => delete this[key]);
  };
  /**
   * How does this view process a request for nearest components to a target?
   * (2D), furthermore, attach view objects (SVG) to the nearest value data.
   */
  proto.nearestVertex = function (...args) {
    const index = nearest_vertex(this, math.core.get_vector(...args));
    const result = transpose_geometry_array_at_index(this, "vertices", index);
    setup_vertex(result, index, this);
    result.index = index;
    return result;
  };
  proto.nearestEdge = function (...args) {
    const index = nearest_edge(this, math.core.get_vector(...args));
    const result = transpose_geometry_array_at_index(this, "edges", index);
    setup_edge(result, index, this);
    result.index = index;
    return result;
  };
  proto.nearestFace = function (...args) {
    const index = face_containing_point(this, math.core.get_vector(...args));
    if (index === undefined) { return undefined; }
    // todo, if point isn't inside a face, there can still exist a nearest face
    const result = transpose_geometry_array_at_index(this, "faces", index);
    setup_face(result, index, this);
    result.index = index;
    return result;
  };
  proto.nearest = function (...args) {
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
  /**
   * transformations
   */
  // proto.scale = function (...args) {
  //   transform_scale(this, ...args);
  // };

  Object.defineProperty(proto, "vertices", { get: getVertices });
  Object.defineProperty(proto, "edges", { get: getEdges });
  Object.defineProperty(proto, "faces", { get: getFaces });
  return Object.freeze(proto);
};

export default Prototype;
