// MIT open source license, Robby Kraft

import math from "../../include/math";
import FOLDConvert from "../../include/fold/convert";

import * as Create from "./create";
import {
  transpose_geometry_arrays,
  transpose_geometry_array_at_index,
  keys as foldKeys
} from "./keys";
import { clone } from "./object";
import addEdge from "./add_edge";
import split_edge from "./split_edge";
import split_face from "./split_face";
import { rebuild, complete } from "./rebuild";
import fragment from "./fragment";
import { remove_non_boundary_edges } from "./remove";
import {
  get_boundary,
  nearest_vertex,
  nearest_edge,
  face_containing_point
} from "./query";
import { scale } from "./affine";

import MakeFold from "../origami/fold";
import { kawasaki_collapse } from "../origami/kawasaki";
import { axiom } from "../origami/axioms";
import { apply_axiom_in_fold } from "../origami/axioms_test";

const Prototype = function (proto = {}) {
  /**
   * export
   */
  /** @return {this} a deep copy of this object. */
  proto.copy = function () {
    return Object.assign(Object.create(Prototype()), clone(this));
  };
  /** @return {string} a stringified-json representation of the FOLD object. */
  const json = function () {
    return FOLDConvert.toJSON(this);
  };
  // const svg = function (cssRules) {
    // return Convert.fold_to_svg(_this, cssRules);
  // };
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
  /**  get the folded state by checking the top level classes */
  const isFolded = function () {
    if ("frame_classes" in this === false) { return undefined; }
    const cpIndex = this.frame_classes.indexOf("creasePattern");
    const foldedIndex = this.frame_classes.indexOf("foldedForm");
    if (cpIndex === -1 && foldedIndex === -1) { return undefined; }
    if (cpIndex !== -1 && foldedIndex !== -1) { return undefined; }
    return (foldedIndex !== -1);
  };

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
  const clean = function (epsilon = math.core.EPSILON) {
    const valid = ("vertices_coords" in this && "vertices_vertices" in this
      && "edges_vertices" in this && "edges_assignment" in this
      && "faces_vertices" in this && "faces_edges" in this);
    if (!valid) {
      console.log("load() crease pattern missing geometry arrays. rebuilding. geometry indices will change");
      // clean(epsilon);
    }
  };
  /**
   * @param {file} is a FOLD object.
   * @param {prevent_wipe} if true import will skip clearing
   */
  const load = function (file, prevent_wipe) {
    if (prevent_wipe == null || prevent_wipe !== true) {
      foldKeys.forEach(key => delete this[key]);
    }
    Object.assign(this, JSON.parse(JSON.stringify(file)));
    clean();
    // placeholderFoldedForm(_this);
  };
  /**
   * this removes all geometry from the crease pattern and returns it
   * to its original state (and keeps the boundary edges if present)
   */
  proto.clear = function () {
    remove_non_boundary_edges(this);
    this.didChange.forEach(f => f());
  };
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
    const result = transpose_geometry_array_at_index(this, "faces", index);
    result.index = index;
    return result;
  };
  /**
   * How does this view process a request for nearest components to a target?
   * (2D), furthermore, attach view objects (SVG) to the nearest value data.
   */
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
    scale(this, ...args);
  };

  // proto.foldedForm = function () {
  //   const foldedFrame = this.file_frames
  //     .filter(f => f.frame_classes.includes("foldedForm"))
  //     .filter(f => f.vertices_coords.length === this.vertices_coords.length)
  //     .shift();
  //   return foldedFrame != null
  //     ? merge_frame(this, foldedFrame)
  //     : undefined;
  // };

  // updates
  const didModifyGraph = function () {
    // remove file_frames which were dependent on this geometry. we can
    // no longer guarantee they match. alternatively we could mark them invalid

    // this.file_frames = this.file_frames
    //  .filter(ff => !(ff.frame_inherit === true && ff.frame_parent === 0));

    // broadcast update to handler if attached
    this.didChange.forEach(f => f());
  };

  // geometry modifiers, fold operations
  proto.addVertexOnEdge = function (x, y, oldEdgeIndex) {
    split_edge(this, x, y, oldEdgeIndex);
    didModifyGraph.call(this);
  };

  proto.axiom = function (...args) {
    const solutions = axiom(...args);
    apply_axiom_in_fold(solutions, this);
    return solutions;
    // console.log("axiom");
    // console.log("solutions", solutions);
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

    const ObjectKeys = Object.keys(folded).filter(key => key !== "svg");
    ObjectKeys.forEach((key) => { this[key] = folded[key]; });

    if ("re:construction" in this === true) {
      if (objects.length > 0 && "axiom" in objects[0] === true) {
        this["re:construction"].axiom = objects[0].axiom;
        this["re:construction"].parameters = objects[0].parameters;
      }
      // this["re:diagrams"] = [
      //  Diagram.build_diagram_frame(this)
      // ];
    }

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
    // const crease = component.crease(this, [diff.edges_new[0] - edges_remove_count]);
    const crease = [diff.edges_new[0] - edges_remove_count];
    didModifyGraph.call(this);
    return crease;
  };

  // proto.creaseThroughLayers = function (point, vector, face) {
  //   RabbitEar.fold.origami.crease_folded(this, point, vector, face);
  //   didModifyGraph();
  // };

  proto.kawasaki = function (...args) {
    const crease = kawasaki_collapse(this, ...args);
    didModifyGraph.call(this);
    return crease;
  };

  Object.defineProperty(proto, "load", { value: load });
  Object.defineProperty(proto, "boundaries", { get: getBoundaries });
  Object.defineProperty(proto, "vertices", { get: getVertices });
  Object.defineProperty(proto, "edges", { get: getEdges });
  Object.defineProperty(proto, "faces", { get: getFaces });
  Object.defineProperty(proto, "isFolded", { value: isFolded });
  Object.defineProperty(proto, "json", { value: json });
  // Object.defineProperty(proto, "svg", { value: svg });

  // callbacks for when the crease pattern has been altered
  proto.didChange = [];

  // proto.__rabbit_ear = RabbitEar;

  return Object.freeze(proto);
};

Prototype.empty = function () {
  return Prototype(Create.empty());
};

Prototype.square = function () {
  return Prototype(Create.rectangle(1, 1));
};

Prototype.rectangle = function (width = 1, height = 1) {
  return Prototype(Create.rectangle(width, height));
};

Prototype.regularPolygon = function (sides, radius = 1) {
  if (sides == null) {
    console.warn("regularPolygon requires number of sides parameter");
  }
  return Prototype(Create.regular_polygon(sides, radius));
};

export default Prototype;
