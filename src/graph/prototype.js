// MIT open source license, Robby Kraft

import {
  transpose_geometry_arrays,
  transpose_geometry_array_at_index,
  fold_keys,
  keys,
} from "../FOLD/keys";
import fragment from "../FOLD/fragment";
import clean from "../FOLD/clean";
import {
  rebuild,
  complete
} from "../FOLD/rebuild";
import {
  nearest_vertex,
  nearest_edge,
  face_containing_point,
  implied_vertices_count
} from "../FOLD/query";
import { clone } from "../FOLD/object";

const adjacencyProperty = function (arrays, key, that) {
  arrays.forEach((el, i) => {
    Object.defineProperty(el, "adjacent", {
      get: () => ({
        vertices: that[`${key}_vertices`] == null ? null : that[`${key}_vertices`][i],
        edges: that[`${key}_edges`] == null ? null : that[`${key}_edges`][i],
        faces: that[`${key}_faces`] == null ? null : that[`${key}_faces`][i]
      })
    });
  });
  return arrays;
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
   * getters, setters
   */
  const getVertices = function () {
    const transposed = transpose_geometry_arrays(this, "vertices");
    const vertices = transposed.length !== 0
      ? transposed
      : Array.from(Array(implied_vertices_count(this))).map(() => ({}));
    return adjacencyProperty(vertices, "vertices", this);
  };
  const getEdges = function () {
    return adjacencyProperty(transpose_geometry_arrays(this, "edges"),
      "edges", this);
  };
  const getFaces = function () {
    return adjacencyProperty(transpose_geometry_arrays(this, "faces"),
      "faces", this);
  };
  /**
   * modifiers
   */
  proto.fragment = function (epsilon = 1e-6) {
    fragment(this, epsilon);
  };
  proto.complete = function () {
    complete(this);
  };
  proto.rebuild = function (epsilon = 1e-6) {
    rebuild(this, epsilon);
  };
  proto.clean = function () {
    clean(this);
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
    Object.assign(this, clone(object));
    if (this.file_creator == null) { this.file_creator = "Rabbit Ear"; }
    if (this.file_spec == null) { this.file_spec = 1.1; }
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
    result.index = index;
    return result;
  };
  proto.nearestEdge = function (...args) {
    const index = nearest_edge(this, math.core.get_vector(...args));
    const result = transpose_geometry_array_at_index(this, "edges", index);
    result.index = index;
    return result;
  };
  proto.nearestFace = function (...args) {
    const index = face_containing_point(this, math.core.get_vector(...args));
    if (index === undefined) { return undefined; }
    // todo, if point isn't inside a face, there can still exist a nearest face
    const result = transpose_geometry_array_at_index(this, "faces", index);
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
