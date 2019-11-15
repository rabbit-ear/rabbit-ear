// MIT open source license, Robby Kraft

import math from "../../include/math";
import addEdge from "../FOLD/add_edge";
import fragment from "../FOLD/fragment";

import {
  transpose_geometry_arrays,
  transpose_geometry_array_at_index,
} from "../FOLD/keys";
import {
  rebuild,
  complete
} from "../FOLD/rebuild";
import {
  get_boundary,
  remove_non_boundary_edges
} from "../FOLD/boundary";
import clean from "../FOLD/clean";
import {
  nearest_vertex,
  nearest_edge,
  face_containing_point
} from "../FOLD/query";
import { clone } from "../FOLD/object";
import { transform_scale } from "../FOLD/affine";
import { get_assignment } from "./args";

const Prototype = function (proto = {}) {

  proto.vertices_didChange = function () { };
  proto.edges_didChange = function () { };
  proto.faces_didChange = function () { };

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
  // todo: memo these. they're created each time, even if the CP hasn't changed
  const getVertices = function () {
    return transpose_geometry_arrays(this, "vertices");
  };
  const getEdges = function () {
    return transpose_geometry_arrays(this, "edges");
  };
  const getFaces = function () {
    return transpose_geometry_arrays(this, "faces");
  };
  const getBoundaries = function () {
    // todo: this only works for unfolded flat crease patterns
    // todo: this doesn't get multiple boundaries yet
    return [get_boundary(this)];
  };
  /**
   * queries
   */
  /**
   * modifiers
   */
  proto.rebuild = function (epsilon = math.core.EPSILON) {
    rebuild(this, epsilon);
  };
  proto.complete = function () {
    complete(this);
  };
  proto.fragment = function (epsilon = math.core.EPSILON) {
    fragment(this, epsilon);
  };
  proto.clean = function () { // epsilon = math.core.EPSILON) {
    const valid = ("vertices_coords" in this && "vertices_vertices" in this
      && "edges_vertices" in this && "edges_assignment" in this
      && "faces_vertices" in this && "faces_edges" in this);
    if (!valid) {
      clean(this);
    }
  };
  /**
   * this removes all geometry from the crease pattern and returns it
   * to its original state (and keeps the boundary edges if present)
   */
  proto.clear = function () {
    remove_non_boundary_edges(this);
    Object.keys(this)
      .filter(s => s.includes("re:"))
      .forEach(key => delete this[key]);
    delete this.vertices_vertices;
    delete this.vertices_faces;
    delete this.edges_faces;
  };

  proto.nearestVertex = function (...args) {

    // if vertices_voronoi doesn't exist, build it
    // check the voronoi for this space.

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
  /**
   * How does this view process a request for nearest components to a target?
   * (2D), furthermore, attach view objects (SVG) to the nearest value data.
   */
  proto.nearest = function (...args) {
    // build
    // vertices_re:voronoi
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

  /**
   * add a line segment to the graph.
   * if endpoints lie on an existing vertex this will reuse vertices.
   * this triggers a rebuild on all arrays
   *
   * @param {number[]} segment defined by two points [x, y]
   * @param {string} optional "M" "V" "F" "U" crease assignment. default is "F"
   */
  proto.segment = function (...args) {
    // get arguments: two endpoints, optional crease assignment
    const s = math.core.flatten_input(...args)
      .filter(n => typeof n === "number");
    const assignment = get_assignment(...args) || "F";
    addEdge(this, s[0], s[1], s[2], s[3], assignment).apply();
    rebuild(this);
  };

  Object.defineProperty(proto, "boundaries", { get: getBoundaries });
  Object.defineProperty(proto, "vertices", { get: getVertices });
  Object.defineProperty(proto, "edges", { get: getEdges });
  Object.defineProperty(proto, "faces", { get: getFaces });

  return Object.freeze(proto);
};

export default Prototype;
