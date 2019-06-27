// MIT open source license, Robby Kraft

import math from "../../include/math";
import FOLDConvert from "../../include/fold/convert";

import { transpose_geometry_arrays } from "./spec";
import component from "./component";
import { clone } from "./object";
import { merge_frame } from "./file_frames";

import MakeFold from "../origami/fold";
import { kawasaki_collapse } from "../origami/kawasaki";

import addEdge from "../graph/add_edge";
import split_edge from "../graph/split_edge";
import split_face from "../graph/split_face";
import { rebuild, complete } from "../graph/rebuild";
import { remove_non_boundary_edges } from "../graph/remove";
import {
  get_boundary,
  nearest_vertex,
  nearest_edge,
  face_containing_point
} from "../graph/query";

const Prototype = function (proto = {}) {
  /** @return {string} a stringified-json representation of the FOLD object. */
  const json = function () {
    return FOLDConvert.toJSON(this);
  };
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

  proto.rebuild = function (epsilon = math.core.EPSILON) {
    rebuild(this, epsilon);
  };
  proto.complete = function () {
    complete(this);
  };
  /** @return {CreasePattern} a deep copy of this object. */
  proto.copy = function () {
    return Object.assign(Object.create(Prototype()), clone(this));
  };
  /**
   * this removes all geometry from the crease pattern and returns it
   * to its original state (and keeps the boundary edges if present)
   */
  proto.clear = function () {
    remove_non_boundary_edges(this);
    this.onchange.forEach(f => f());
  };
  proto.nearestVertex = function (...args) {
    return nearest_vertex(this, math.core.get_vector(...args));
  };
  proto.nearestEdge = function (...args) {
    return nearest_edge(this, math.core.get_vector(...args));
  };
  proto.nearestFace = function (...args) {
    return face_containing_point(this, math.core.get_vector(...args));
  };

  proto.foldedForm = function () {
    const foldedFrame = this.file_frames
      .filter(f => f.frame_classes.includes("foldedForm"))
      .filter(f => f.vertices_coords.length === this.vertices_coords.length)
      .shift();
    return foldedFrame != null
      ? merge_frame(this, foldedFrame)
      : undefined;
  };

  // updates
  const didModifyGraph = function () {
    // remove file_frames which were dependent on this geometry. we can
    // no longer guarantee they match. alternatively we could mark them invalid

    // this.file_frames = this.file_frames
    //  .filter(ff => !(ff.frame_inherit === true && ff.frame_parent === 0));

    // broadcast update to handler if attached
    this.onchange.forEach(f => f());
  };

  // geometry modifiers, fold operations
  proto.addVertexOnEdge = function (x, y, oldEdgeIndex) {
    split_edge(this, x, y, oldEdgeIndex);
    didModifyGraph.call(this);
  };

  proto.markFold = function (...args) {
    const objects = args.filter(p => typeof p === "object");
    const line = math.core.get_line(args);
    const face_index = args.filter(a => a !== null && !isNaN(a)).shift();
    if (!math.core.is_vector(line.point)
      || !math.core.is_vector(line.vector)) {
      console.warn("markFold was not supplied the correct parameters");
      return;
    }
    const folded = MakeFold(this,
      line.point,
      line.vector,
      face_index,
      "F");
    Object.keys(folded).forEach((key) => { this[key] = folded[key]; });
    if ("re:construction" in this === true) {
      if (objects.length > 0 && "axiom" in objects[0] === true) {
        this["re:construction"].axiom = objects[0].axiom;
        this["re:construction"].parameters = objects[0].parameters;
      }
    }
    delete this["faces_re:matrix"];
    didModifyGraph.call(this);
  };

  // fold methods
  proto.valleyFold = function (...args) { // point, vector, face_index) {
    const objects = args.filter(p => typeof p === "object");
    const line = math.core.get_line(args);
    const face_index = args.filter(a => a !== null && !isNaN(a)).shift();
    if (!math.core.is_vector(line.point) || !math.core.is_vector(line.vector)) {
      console.warn("valleyFold was not supplied the correct parameters");
      return;
    }
    // if folding on a foldedForm do the below
    // if folding on a creasePattern, add these
    // let matrix = pattern.cp["faces_re:matrix"] !== null ? pattern.cp["faces_re:matrix"]

    // let mat_inv = matrix
    //  .map(mat => Geom.core.make_matrix2_inverse(mat))
    //  .map(mat => Geom.core.multiply_line_matrix2(point, vector, mat));
    const folded = MakeFold(this,
      line.point,
      line.vector,
      face_index,
      "V");
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
    delete this["faces_re:matrix"];
    didModifyGraph.call(this);

    // todo, need to grab the crease somehow
    // const crease = component.crease(this, [diff.edges_new[0] - edges_remove_count]);
    // didModifyGraph();
    // return crease;
  };

  proto.creaseRay = function (...args) {
    const ray = math.ray(args);
    const faces = this.faces_vertices.map(fv => fv.map(v => this.vertices_coords[v]));
    const intersecting = faces
      .map((face, i) => (math.core.intersection
        .convex_poly_ray_exclusive(face, ray.point, ray.vector) === undefined
        ? undefined : i))
      .filter(a => a !== undefined)
      .sort((a, b) => b - a);

    console.log(faces, intersecting);

    intersecting.forEach(index => split_face(
      this, index, ray.point, ray.vector, "F"
    ));
  };

  proto.creaseSegment = function (...args) {
    const diff = addEdge(this, ...args);
    if (diff === undefined) { return undefined; }
    if (diff.edges_index_map != null) {
      Object.keys(diff.edges_index_map)
        .forEach((i) => {
          this.edges_assignment[i] = this
            .edges_assignment[diff.edges_index_map[i]];
        });
    }
    const edges_remove_count = (diff.edges_to_remove != null)
      ? diff.edges_to_remove.length : 0;
    if (diff.edges_to_remove != null) {
      diff.edges_to_remove.slice()
        .sort((a, b) => b - a) // reverse order
        .forEach((i) => {
          this.edges_vertices.splice(i, 1);
          this.edges_assignment.splice(i, 1);
        });
    }
    // this.edges_assignment.push("F");
    const crease = component.crease(this, [diff.edges_new[0] - edges_remove_count]);
    didModifyGraph.call(this);
    return crease;
  };

  // proto.creaseThroughLayers = function (point, vector, face) {
  //   RabbitEar.fold.origami.crease_folded(this, point, vector, face);
  //   didModifyGraph();
  // };

  proto.kawasaki = function (...args) {
    const crease = component.crease(this, kawasaki_collapse(this, ...args));
    didModifyGraph.call(this);
    return crease;
  };

  Object.defineProperty(proto, "boundaries", { get: getBoundaries });
  Object.defineProperty(proto, "vertices", { get: getVertices });
  Object.defineProperty(proto, "edges", { get: getEdges });
  Object.defineProperty(proto, "faces", { get: getFaces });
  Object.defineProperty(proto, "json", { get: json });

  // callbacks for when the crease pattern has been altered
  proto.onchange = [];

  proto.__rabbit_ear = RabbitEar;

  return Object.freeze(proto);
};

export default Prototype;
