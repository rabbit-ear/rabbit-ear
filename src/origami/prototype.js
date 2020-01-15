// MIT open source license, Robby Kraft

/**
*
*
*
*
* "fast" init param
*  divide each function into fast and slow
*
*/

import math from "../../include/math";

import prototype from "../graph/prototype";

import MakeFold from "../fold-through-all/index";
import * as Create from "../FOLD/create";
import addEdge from "../FOLD/add_edge";
import split_face from "../FOLD/split_face";
import fragment from "../FOLD/fragment";
// import madeBy from "../frames/madeBy";
import clean from "../FOLD/clean";
import {
  file_spec,
  file_creator,
  keys as foldKeys,
  future_spec as re
} from "../FOLD/keys";
import rebuild from "../FOLD/rebuild";
import {
  make_faces_matrix
} from "../FOLD/make";
import {
  get_boundary,
  remove_non_boundary_edges
} from "../FOLD/boundary";
import { clone } from "../FOLD/object";
import { kawasaki_collapse } from "../kawasaki/index";
import { get_assignment } from "./args";

import remove from "../FOLD/remove";

import * as Collinear from "../FOLD/collinear";
import * as Isolated from "../FOLD/isolated";
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
        p = [l.origin, l.vector];
        break;
    }
    const func = {
      line: math.core.intersection.convex_poly_line,
      ray: math.core.intersection.convex_poly_ray,
      edge: math.core.intersection.convex_poly_segment
    };
    return boundaries
      .map(b => b.vertices.map(v => that.vertices_coords[v]))
      .map(b => func[type](b, ...p))
      .filter(segment => segment !== undefined);
  };
  boundaries.clipLine = function (...args) { return clip("line", ...args); };
  boundaries.clipRay = function (...args) { return clip("ray", ...args); };
  boundaries.clipSegment = function (...args) { return clip("edge", ...args); };
  return boundaries;
};

const Prototype = function (superProto = {}) {
  const proto = Object.assign(
    Object.create(prototype()),
    Create.empty(),
    superProto,
    { file_spec, file_creator }
  );

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

  // Prototype.empty = function () {
  //   return Prototype(Create.empty());
  // };
  // Prototype.square = function () {
  //   return Prototype(Create.rectangle(1, 1));
  // };
  // Prototype.rectangle = function (width = 1, height = 1) {
  //   return Prototype(Create.rectangle(width, height));
  // };
  // Prototype.regularPolygon = function (sides, radius = 1) {
  //   if (sides == null) {
  //     console.warn("regularPolygon requires number of sides parameter");
  //   }
  //   return Prototype(Create.regular_polygon(sides, radius));
  // };

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

  proto.clean2 = function () {
    clean(this, {collinear: true, isolated: true});
    // extra
    // this["re:delaunay_vertices"] = make_delaunay_vertices(this);
    this["faces_re:matrix"] = make_faces_matrix(this);
    if (this[re.FACES_LAYER] != null && this.faces_vertices != null) {
      if (this[re.FACES_LAYER].length !== this.faces_vertices.length) {
        delete this[re.FACES_LAYER];
      }
    }
  };
  /**
   * @param {file} is a FOLD object.
   * @param {prevent_clear} if true import will skip clearing
   */
  // proto.load = function (file, prevent_clear) {
  //   if (prevent_clear == null || prevent_clear !== true) {
  //     foldKeys.forEach(key => delete this[key]);
  //   }
  //   Object.assign(this, clone(file));
  //   this.clean2();
  //   // clean.call(this);
  //   // placeholderFoldedForm(_this);
  //   this.didChange.forEach(f => f());
  // };
  /**
   * this removes all geometry from the crease pattern and returns it
   * to its original state (and keeps the boundary edges if present)
   */
  const clear = function () {
  // proto.clear = function () {
    remove_non_boundary_edges(this);
    Object.keys(this)
      .filter(s => s.includes("re:"))
      .forEach(key => delete this[key]);
    delete this.vertices_vertices;
    delete this.vertices_faces;
    delete this.edges_faces;
    this.didChange.forEach(f => f());
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
    // get segment
    const s = math.core.flatten_input(...args)
      .filter(n => typeof n === "number");
    // clip in boundary
    const boundary = getBoundaries.call(this);
    const c = boundary.clipSegment([s[0], s[1]], [s[2], s[3]]);
    // get arguments: two endpoints, optional crease assignment
    const assignment = get_assignment(...args) || "F";
    addEdge(this, c[0], c[1], c[2], c[3], assignment).apply();
    rebuild(this);
    didModifyGraph.call(this);
    const edges = Collinear.collinear_edges(this, [c[0], c[1]], [c[2] - c[0], c[3] - c[1]]);
    return Edges(this, edges);
  };

  proto.line = function (...args) {
    // get segment
    const l = math.core.flatten_input(...args)
      .filter(n => typeof n === "number");
    // clip in boundary
    const boundary = getBoundaries.call(this);
    const s = boundary.clipLine([l[0], l[1]], [l[2], l[3]]);
    // get arguments: two endpoints, optional crease assignment
    const assignment = get_assignment(...args) || "F";
    addEdge(this, s[0], s[1], s[2], s[3], assignment).apply();
    rebuild(this);
    didModifyGraph.call(this);
    const edges = Collinear.collinear_edges(this, [s[0], s[1]], [s[2] - s[0], s[3] - s[1]]);
    return Edges(this, edges);
  };

  proto.axiom = function (...args) {
    RabbitEar.axiom(2, start[0], start[1], end[0], end[1])
      .solutions
      .forEach(s => app.origami.line(s[0][0], s[0][1], s[1][0], s[1][1]));
    fragment(this);
    this.clean2();

    // get segment
    const l = math.core.flatten_input(...args)
      .filter(n => typeof n === "number");
    // clip in boundary
    const boundary = getBoundaries.call(this);
    const s = boundary.clipLine([l[0], l[1]], [l[2], l[3]]);
    // get arguments: two endpoints, optional crease assignment
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
    if (!math.core.is_vector(line.origin) || !math.core.is_vector(line.vector)) {
      console.warn("fold was not supplied the correct parameters");
      return;
    }
    // if folding on a foldedForm do the below
    // if folding on a creasePattern, add these
    // let matrix = pattern.cp["faces_re:matrix"] !== null ? pattern.cp["faces_re:matrix"]

    // let mat_inv = matrix
    //  .map(mat => Geom.core.invert_matrix2(mat))
    //  .map(mat => Geom.core.multiply_matrix2_line2(mat, point, vector));

    const folded = MakeFold(this,
      line.origin,
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
        .convex_poly_ray_exclusive(face, ray.origin, ray.vector) === undefined
        ? undefined : i))
      .filter(a => a !== undefined)
      .sort((a, b) => b - a);

    intersecting.forEach(index => split_face(
      this, index, ray.origin, ray.vector, "F"
    ));
  };

  proto.kawasaki = function (...args) {
    const crease = kawasaki_collapse(this, ...args);
    didModifyGraph.call(this);
    return crease;
  };

  Object.defineProperty(proto, "boundaries", { get: getBoundaries });
  Object.defineProperty(proto, "isFolded", { value: isFolded });
  Object.defineProperty(proto, "clear", { value: clear });

  // callbacks for when the crease pattern has been altered
  proto.didChange = [];

  // return Object.freeze(proto);
  return proto;
};

export default Prototype;
