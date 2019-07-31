// MIT open source license, Robby Kraft

import math from "../../include/math";

import MakeFold from "../origami/fold";
import * as Create from "./create";
import addEdge from "./add_edge";
import split_face from "./split_face";
import fragment from "./fragment";
import madeBy from "../frames/madeBy";
import {
  transpose_geometry_arrays,
  transpose_geometry_array_at_index,
  keys as foldKeys
} from "./keys";
import {
  rebuild,
  complete
} from "./rebuild";
import {
  clean as protoClean,
  remove_non_boundary_edges
} from "./clean";
import {
  get_boundary,
  nearest_vertex,
  nearest_edge,
  face_containing_point
} from "./query";
import { clone } from "./object";
import { scale } from "./affine";
import { kawasaki_collapse } from "../origami/kawasaki";
import { axiom } from "../origami/axioms";
import { apply_axiom_in_fold } from "../origami/axioms_test";
import { get_assignment } from "./args";

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
    scale(this, ...args);
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
    const assignment = get_assignment(...args) || "F";
    // add segment, rebuild all arrays
    addEdge(this, s[0][0], s[0][1], s[1][0], s[1][1], assignment).apply();
    rebuild(this);
    // make a record documenting how we got here
    madeBy().axiom1(s[0], s[1]);
    this.didChange.forEach(f => f());
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

    console.log("============== bug here");
    Object.keys(folded).forEach((key) => { console.log(key); this[key] = folded[key]; });
    console.log(this, "+++++++++++++++++ end bug");

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
