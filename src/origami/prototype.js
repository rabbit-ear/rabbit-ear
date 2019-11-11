// MIT open source license, Robby Kraft

/**
*
*
*
*
*      "fast" init param
8       divide each function into fast and slow











*
*/

import math from "../../include/math";

import MakeFold from "../fold-through-all";
import * as Create from "../FOLD/create";
import addEdge from "../FOLD/add_edge";
import split_face from "../FOLD/split_face";
import fragment from "../FOLD/fragment";
// import madeBy from "../frames/madeBy";
import protoClean from "../FOLD/clean";
import {
  transpose_geometry_arrays,
  transpose_geometry_array_at_index,
  keys as foldKeys
} from "../FOLD/keys";
import {
  rebuild,
  complete
} from "../FOLD/rebuild";
import {
  get_boundary,
  remove_non_boundary_edges
} from "../FOLD/boundary";
import {
  nearest_vertex,
  nearest_edge,
  face_containing_point
} from "../FOLD/query";
import { clone } from "../FOLD/object";
import { transform_scale } from "../FOLD/affine";
import { kawasaki_collapse } from "../kawasaki";
import { axiom } from "../axioms";
import { apply_axiom_in_fold } from "../axioms/validate";
import { get_assignment } from "./args";

import * as Collinear from "../FOLD/collinear";
import Edges from "./edges";

const MARK_DEFAULTS = {
  rebuild: true,
  change: true,
};

export const possible_mark_object = function (o) {
  if (typeof o !== "object" || o === null) { return false; }
  const argKeys = Object.keys(o);
  const defaultKeys = Object.keys(MARK_DEFAULTS);
  for (let i = 0; i < argKeys.length; i += 1) {
    if (defaultKeys.includes(argKeys[i])) { return true; }
  }
  return false;
};


const get_mark_options = function (...args) {
  const options = args.filter(o => typeof o === "object")
    .filter(o => possible_mark_object(o))
    .shift();
  return options === undefined
    ? clone(MARK_DEFAULTS)
    : Object.assign(clone(MARK_DEFAULTS), options);
};

const boundary_methods = function (boundaries) {
  const that = this;
  const clip = function (type, ...args) {
    let p;
    let l;
    switch (type) {
      case "edge": p = math.core.get_vector_of_vectors(...args); break;
      default: // ray and line use the same
        l = math.core.get_line(...args);
        p = [l.point, l.vector];
        break;
    }
    const func = {
      line: math.core.intersection.convex_poly_line,
      ray: math.core.intersection.convex_poly_ray,
      edge: math.core.intersection.convex_poly_edge
    };
    return boundaries
      .map(b => b.vertices.map(v => that.vertices_coords[v]))
      .map(b => func[type](b, ...p))
      .filter(segment => segment !== undefined);
  };
  boundaries.clipLine = function (...args) { return clip("line", ...args); };
  boundaries.clipRay = function (...args) { return clip("ray", ...args); };
  boundaries.clipEdge = function (...args) { return clip("edge", ...args); };
  return boundaries;
};

const Prototype = function (proto = {}) {
  proto.square = function () {
    Object.keys(this).forEach(key => delete this[key]);
    const rect = Create.rectangle(1, 1);
    Object.keys(rect).forEach((key) => { this[key] = rect[key]; });
  };
  proto.regularPolygon = function (sides = 3, radius = 1) {
    Object.keys(this).forEach(key => delete this[key]);
    const rect = Create.regular_polygon(sides, radius);
    Object.keys(rect).forEach((key) => { this[key] = rect[key]; });
  };

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
    return boundary_methods.call(this, [get_boundary(this)]);
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
      protoClean(this);
    }
  };
  /**
   * @param {file} is a FOLD object.
   * @param {prevent_clear} if true import will skip clearing
   */
  proto.load = function (file, prevent_clear) {
    if (prevent_clear == null || prevent_clear !== true) {
      foldKeys.forEach(key => delete this[key]);
    }
    Object.assign(this, clone(file));
    clean.call(this);
    // placeholderFoldedForm(_this);
    this.didChange.forEach(f => f());
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
  // proto.axiom = function (...args) {
  //   const solutions = axiom(...args);
  //   apply_axiom_in_fold(solutions, this);
  //   return solutions;
  // };

  proto.segment = function (...args) {
    // get arguments: two endpoints, optional crease assignment
    const s = math.core.flatten_input(...args)
      .filter(n => typeof n === "number");
    const assignment = get_assignment(...args) || "F";
    addEdge(this, s[0], s[1], s[2], s[3], assignment).apply();
    rebuild(this);
    didModifyGraph.call(this);
    const edges = Collinear.collinear_edges(this, [s[0], s[1]], [s[2] - s[0], s[3] - s[1]]);
    return Edges(this, edges);
  };

  /**
   * add a line segment to the graph.
   * if endpoints lie on an existing vertex this will reuse vertices.
   * this triggers a rebuild on all arrays
   *
   * @param {number[]} segment defined by two points [x, y]
   * @param {string} optional "M" "V" "F" "U" crease assignment. default is "F"
   */
  proto.mark = function (...args) {
    // get arguments. 2 endpoints. optional crease assignment
    const s = math.core.get_vector_of_vectors(...args);
    const options = get_mark_options(...args);
    const assignment = get_assignment(...args) || "F";
    // add segment, rebuild all arrays
    addEdge(this, s[0][0], s[0][1], s[1][0], s[1][1], assignment).apply();
    if (options.rebuild) { rebuild(this); }
    // make a record documenting how we got here
    // axiom1(s[0], s[1]);
    // madeBy().axiom1(s[0], s[1]);
    if (options.change) { this.didChange.forEach(f => f()); }
  };

  // fold methods
  proto.crease = function (...args) { // point, vector, face_index) {
    const objects = args.filter(p => typeof p === "object");
    const line = math.core.get_line(args);
    const assignment = get_assignment(...args) || "V";
    const face_index = args.filter(a => a !== null && !isNaN(a)).shift();
    if (!math.core.is_vector(line.point) || !math.core.is_vector(line.vector)) {
      console.warn("fold was not supplied the correct parameters");
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
      assignment);

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

    intersecting.forEach(index => split_face(
      this, index, ray.point, ray.vector, "F"
    ));
  };

  proto.kawasaki = function (...args) {
    const crease = kawasaki_collapse(this, ...args);
    didModifyGraph.call(this);
    return crease;
  };

  Object.defineProperty(proto, "boundaries", { get: getBoundaries });
  Object.defineProperty(proto, "vertices", { get: getVertices });
  Object.defineProperty(proto, "edges", { get: getEdges });
  Object.defineProperty(proto, "faces", { get: getFaces });
  Object.defineProperty(proto, "isFolded", { value: isFolded });

  // callbacks for when the crease pattern has been altered
  proto.didChange = [];

  // return Object.freeze(proto);
  return proto;
};

export default Prototype;
