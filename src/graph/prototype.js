// MIT open source license, Robby Kraft

import {
  transpose_geometry_arrays,
  transpose_geometry_array_at_index,
  fold_keys,
  keys,
} from "../FOLD/keys";
import addEdge from "../FOLD/add_edge";
import fragment from "../FOLD/fragment";
import clean from "../FOLD/clean";
import {
  rebuild,
  complete
} from "../FOLD/rebuild";
import {
  nearest_vertex,
  nearest_edge,
  face_containing_point
} from "../FOLD/query";
import { clone } from "../FOLD/object";
import { transform_scale } from "../FOLD/affine";
import remove from "../FOLD/remove";
import * as Collinear from "../FOLD/collinear";
import * as Isolated from "../FOLD/isolated";

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
    const that = this;
    const vertices = transpose_geometry_arrays(this, "vertices");
    vertices.forEach((v, i) => {
      v.adjacent = {};
      Object.defineProperty(v.adjacent, "vertices", {
        get: () => {
          if (that.vertices_vertices != null && that.vertices_vertices[i] != null) {
            return that.vertices_vertices[i];
          }
          // find adjacent vertex
          return i;
        }
      });
      Object.defineProperty(v.adjacent, "edges", { get: () => i });
    });
    return vertices;
  };
  const getEdges = function () {
    return transpose_geometry_arrays(this, "edges");
  };
  const getFaces = function () {
    return transpose_geometry_arrays(this, "faces");
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
    const cleaned = clean(this);
    Object.keys(cleaned).forEach((key) => { this[key] = cleaned[key]; });
    // all vertices
    if (Collinear.remove_all_collinear_vertices(this)) {
      const cleaned2 = clean(this);
      Object.keys(cleaned2).forEach((key) => { this[key] = cleaned2[key]; });
    }
    remove(this, "vertices", Isolated.find_isolated_vertices(this));
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
  proto.scale = function (...args) {
    transform_scale(this, ...args);
  };
  proto.addVertex = function () {

  };
  /**
   * add a line segment to the graph.
   * if endpoints lie on an existing vertex this will reuse vertices.
   * this triggers a rebuild on all arrays
   *
   * @param {number[]} segment defined by two points [x, y]
   * @param {string} optional "M" "V" "F" "U" crease assignment. default is "F"
   */
  proto.addEdge = function (...args) {
    // get arguments. 2 endpoints. optional crease assignment
    const s = math.core.get_vector_of_vectors(...args);
    const options = get_mark_options(...args);
    const assignment = get_assignment(...args) || "F";
    // add segment, rebuild all arrays
    addEdge(this, s[0][0], s[0][1], s[1][0], s[1][1], assignment).apply();
    if (options.rebuild) { rebuild(this); }
  };

  Object.defineProperty(proto, "vertices", { get: getVertices });
  Object.defineProperty(proto, "edges", { get: getEdges });
  Object.defineProperty(proto, "faces", { get: getFaces });
  return Object.freeze(proto);
};

export default Prototype;
