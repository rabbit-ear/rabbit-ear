// MIT open source license, Robby Kraft

import math from "../../include/math";
// import * as Make from "../graph/make";
import {
  get_boundary,
  nearest_vertex,
  nearest_edge,
  face_containing_point
} from "../graph/query";

import * as Create from "./create";
import * as Frames from "./file_frames";
import * as Validate from "./validate";
import * as Diagram from "../frames/diagram_frame";
import CreaseThrough from "../origami/fold";
import * as Spec from "./spec";
import * as Kawasaki from "../origami/kawasaki";
import addEdge from "../graph/add_edge";
import * as Rebuild from "../graph/rebuild";
import component from "./component";

import add_vertex_on_edge from "../graph/addVertexOld";

import {
  remove_non_boundary_edges,
} from "../graph/remove";

/**
 * an important thing this class offers: this component array
 * each object matches 1:1 a component in the FOLD graph.
 * when a graph component gets removed, its corresponding object deletes
 * itself so even if the user holds onto it, it no longer points to anything.
 * each component brings extra functionality to these edges/faces/vertices.
 * take great care to make sure they are always matching 1:1.
 * keys are each component's UUID for speedy lookup.
 */

// const placeholderFoldedForm = function (graph) {
//  // todo, better checking for specifically a "foldedForm" frame
//  if (graph.file_frames == null || graph.file_frames.length === 0) {
//    if (graph.faces_vertices != null) {
//      let faces_array = Array.from(Array(graph.faces_vertices.length));
//      graph.file_frames = [{
//        frame_classes: ["foldedForm"],
//        frame_inherit: true,
//        frame_parent: 0,
//        "faces_re:layer": faces_array.map((_,i) => i),
//        "faces_re:matrix": faces_array.map(_ => [1,0,0,1,0,0])
//      }];
//    }
//  }
// }


const prepareGraphModify = function (graph) {
  delete graph["re:construction"];
};

const Prototype = function (proto) {
  if (proto == null) {
    proto = {};
  }

  const components = {
    vertices: [],
    edges: [],
    faces: [],
    // boundary: {},
  };

  let _this;

  const bind = function (that) {
    _this = that;
  };

  const clean = function (epsilon = math.core.EPSILON) {
    Rebuild.clean(_this, epsilon);
  };

  /**
   * @param {file} is a FOLD object.
   * @param {prevent_wipe} true and it will import without first clearing
   */
  const load = function (file, prevent_wipe) {
    if (prevent_wipe == null || prevent_wipe !== true) {
      Spec.keys.forEach(key => delete _this[key]);
    }
    Object.assign(_this, JSON.parse(JSON.stringify(file)));
    // placeholderFoldedForm(_this);
  };
  /**
   * @return {CreasePattern} a deep copy of this object.
   */
  const copy = function () {
    return CreasePattern(JSON.parse(JSON.stringify(_this)));
  };
  /**
   * this removes all geometry from the crease pattern and returns it
   * to its original state (and keeps the boundary edges if present)
   */
  const clear = function () {
    remove_non_boundary_edges(_this);
    _this.onchange.forEach(f => f());
  };
  /**
   * @return {Object} a deep copy of this object in the FOLD format.
   */
  const json = function () {
    // let non_copy_keys = ["__rabbit_ear"];
    // let backup = {};
    // non_copy_keys.forEach(key => {
    //  backup[key] = _this[key];
    //  delete _this[key];
    // });
    // let json = FOLDConvert.toJSON(_this);
    // non_copy_keys.forEach(key => _this[key] = backup[key]);
    // return json;
    return FOLDConvert.toJSON(_this);
  };

  const svg = function (cssRules) {
    // return Convert.fold_to_svg(_this, cssRules);
  };

  // const wipe = function () {
  //  Graph.all_keys.filter(a => _m[a] != null)
  //    .forEach(key => delete _m[key]);
  //  _this.onchange.forEach(f => f());
  // }

  // todo: memo these. they're created each time, even if the CP hasn't changed
  const getVertices = function () {
    return (_this.vertices_coords || []).map((_, i) => ({ index: i }));
    // components.vertices
    //   .filter(v => v.disable !== undefined)
    //   .forEach(v => v.disable());
    // components.vertices = (_this.vertices_coords || [])
    //   .map((_, i) => component.vertex(_this, i));
    // return components.vertices;
  };
  const getEdges = function () {
    return (_this.edges_vertices || []).map((_, i) => ({ index: i }));
    // components.edges
    //   .filter(e => e.disable !== undefined)
    //   .forEach(e => e.disable());
    // components.edges = (_this.edges_vertices || [])
    //   .map((_, i) => component.edge(_this, i));
    // return components.edges;
    // // return (this.edges_vertices || [])
    // //    .map(e => e.map(ev => this.vertices_coords[ev]))
    // //    .map(e => Geometry.Edge(e));
  };
  const getFaces = function () {
    return (_this.faces_vertices || []).map((_, i) => ({ index: i }));
    // components.faces
    //   .filter(f => f.disable !== undefined)
    //   .forEach(f => f.disable());
    // components.faces = (_this.faces_vertices || [])
    //   .map((_, i) => component.face(_this, i));
    // return components.faces;
    // // return (this.faces_vertices || [])
    // //    .map(f => f.map(fv => this.vertices_coords[fv]))
    // //    .map(f => Polygon(f));
  };
  const getBoundary = function () {
    // todo: test this for another reason anyway
    // todo: this only works for unfolded flat crease patterns
    return math.polygon(
      get_boundary(_this).vertices
        .map(v => _this.vertices_coords[v])
    );
  };
  const nearestVertex = function (x, y, z = 0) {
    const index = nearest_vertex(_this, [x, y, z]);
    return { index };
    // return (index != null) ? component.vertex(_this, index) : undefined;
  };
  const nearestEdge = function (x, y, z = 0) {
    const index = nearest_edge(_this, [x, y, z]);
    return { index };
    // return (index != null) ? component.edge(_this, index) : undefined;
  };
  const nearestFace = function (x, y, z = 0) {
    const index = face_containing_point(_this, [x, y, z]);
    return { index };
    // return (index != null) ? component.face(_this, index) : undefined;
  };

  const getFacesAtPoint = function (x, y, z = 0) {

  };

  const getFoldedFacesAtPoint = function () {
    const point = math.core.get_vector(...arguments);
    return getFoldedForm().faces_vertices
      .map((fv, i) => ({face: fv.map(v => folded.vertices_coords[v]), i}))
      .filter((f, i) => Geom.core.point_in_poly(point, f.face))
      .map(f => f.i);
  };

  const getTopFoldedFaceAtPoint = function () {
    const faces = getFoldedFacesAtPoint(...arguments);
    return topmost_face(_this, faces);
  };

  const getFoldedForm = function () {
    const foldedFrame = _this.file_frames
      .filter(f => f.frame_classes.includes("foldedForm"))
      .filter(f => f.vertices_coords.length === _this.vertices_coords.length)
      .shift();
    return foldedFrame != null
      ? Frames.merge_frame(_this, foldedFrame)
      : undefined;
  };
  // updates
  const didModifyGraph = function () {
    // remove file_frames which were dependent on this geometry. we can
    // no longer guarantee they match. alternatively we could mark them invalid

    // _this.file_frames = _this.file_frames
    //  .filter(ff => !(ff.frame_inherit === true && ff.frame_parent === 0));

    // broadcast update to handler if attached
    _this.onchange.forEach(f => f());
  };

  const markFold = function (...args) {
    const objects = args.filter(p => typeof p === "object");
    const line = math.core.get_line(args);
    const face_index = args.filter(a => a !== null && !isNaN(a)).shift();
    if (!math.core.is_vector(line.point)
      || !math.core.is_vector(line.vector)) {
      console.warn("markFold was not supplied the correct parameters");
      return;
    }
    const folded = CreaseThrough(_this,
      line.point,
      line.vector,
      face_index,
      "F");
    Object.keys(folded).forEach((key) => { _this[key] = folded[key]; });
    if ("re:construction" in _this === true) {
      if (objects.length > 0 && "axiom" in objects[0] === true) {
        _this["re:construction"].axiom = objects[0].axiom;
        _this["re:construction"].parameters = objects[0].parameters;
      }
    }
    delete _this["faces_re:matrix"];
    didModifyGraph();
  };

  // fold methods
  const valleyFold = function (...args) { // point, vector, face_index) {
    const objects = args.filter(p => typeof p === "object");
    const line = math.core.get_line(args);
    const face_index = args.filter(a => a !== null && !isNaN(a)).shift();
    // console.log("line", line);
    // console.log("face_index", face_index);
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
    const folded = CreaseThrough(_this,
      line.point,
      line.vector,
      face_index,
      "V");
    Object.keys(folded).forEach((key) => { _this[key] = folded[key]; });
    if ("re:construction" in _this === true) {
      if (objects.length > 0 && "axiom" in objects[0] === true) {
        _this["re:construction"].axiom = objects[0].axiom;
        _this["re:construction"].parameters = objects[0].parameters;
      }
      // _this["re:diagrams"] = [
      //  Diagram.build_diagram_frame(_this)
      // ];
    }
    delete _this["faces_re:matrix"];
    didModifyGraph();

    // todo, need to grab the crease somehow
    // const crease = component.crease(this, [diff.edges_new[0] - edges_remove_count]);
    // didModifyGraph();
    // return crease;
  };

  // const markFold = function () {
  //   let line = math.core.get_line(arguments);
  //   let c = component.crease(this, MakeCrease.crease_line(_this, line.point, line.vector));
  //   didModifyGraph();
  //   return c;
  // };

  // const crease = function () {
  //   let o = Array.from(arguments)
  //     .filter(el => typeof el === "object" && el !== null)
  //     .shift();  // for now don't handle multiple inputs
  //   if (o !== undefined) {
  //     if ("point" in o && "vector" in o) {
  //       let c = component.crease(this, MakeCrease.crease_line(_this, o.point, o.vector));
  //       didModifyGraph();
  //       return c;
  //     }
  //   }
  // };

  const addVertexOnEdge = function (x, y, oldEdgeIndex) {
    add_vertex_on_edge(_this, x, y, oldEdgeIndex);
    didModifyGraph();
  };

  // const creaseLine = function () {
  //   let crease = component.crease(this, MakeCrease.crease_line(_this, ...arguments));
  //   didModifyGraph();
  //   return crease;
  // };
  // const creaseRay = function () {
  //   let crease = component.crease(this, MakeCrease.creaseRay(_this, ...arguments));
  //   didModifyGraph();
  //   return crease;
  // };
  const creaseSegment = function () {
    const diff = addEdge(_this, ...arguments);
    if (diff === undefined) { return undefined; }
    if (diff.edges_index_map != null) {
      Object.keys(diff.edges_index_map)
        .forEach((i) => {
          _this.edges_assignment[i] = _this
            .edges_assignment[diff.edges_index_map[i]];
        });
    }
    const edges_remove_count = (diff.edges_to_remove != null)
      ? diff.edges_to_remove.length : 0;
    if (diff.edges_to_remove != null) {
      diff.edges_to_remove.slice()
        .sort((a, b) => b - a) // reverse order
        .forEach((i) => {
          _this.edges_vertices.splice(i, 1);
          _this.edges_assignment.splice(i, 1);
        });
    }
    // _this.edges_assignment.push("F");
    const crease = component.crease(this, [diff.edges_new[0] - edges_remove_count]);
    didModifyGraph();
    return crease;
  };
  const creaseThroughLayers = function (point, vector, face) {
    RabbitEar.fold.origami.crease_folded(_this, point, vector, face);
    didModifyGraph();
  };
  const kawasaki = function () {
    const crease = component.crease(this, Kawasaki.kawasaki_collapse(_this, ...arguments));
    didModifyGraph();
    return crease;
  };

  Object.defineProperty(proto, "getFoldedForm", { value: getFoldedForm });
  Object.defineProperty(proto, "boundary", { get: getBoundary });
  Object.defineProperty(proto, "vertices", { get: getVertices });
  Object.defineProperty(proto, "edges", { get: getEdges });
  Object.defineProperty(proto, "faces", { get: getFaces });
  Object.defineProperty(proto, "clear", { value: clear });
  Object.defineProperty(proto, "clean", { value: clean });
  Object.defineProperty(proto, "load", { value: load });
  Object.defineProperty(proto, "copy", { value: copy });
  Object.defineProperty(proto, "bind", { value: bind });
  Object.defineProperty(proto, "json", { get: json });
  Object.defineProperty(proto, "nearestVertex", { value: nearestVertex });
  Object.defineProperty(proto, "nearestEdge", { value: nearestEdge });
  Object.defineProperty(proto, "nearestFace", { value: nearestFace });
  Object.defineProperty(proto, "svg", { value: svg });
  Object.defineProperty(proto, "valleyFold", { value: valleyFold });
  Object.defineProperty(proto, "markFold", { value: markFold });
  Object.defineProperty(proto, "addVertexOnEdge", { value: addVertexOnEdge });
  // Object.defineProperty(proto, "crease", { value: crease });
  // Object.defineProperty(proto, "creaseLine", { value: creaseLine });
  // Object.defineProperty(proto, "creaseRay", { value: creaseRay });
  Object.defineProperty(proto, "creaseSegment", { value: creaseSegment });
  Object.defineProperty(proto, "creaseThroughLayers", {
    value: creaseThroughLayers
  });
  Object.defineProperty(proto, "kawasaki", { value: kawasaki });


  // callbacks for when the crease pattern has been altered
  proto.onchange = [];

  proto.__rabbit_ear = RabbitEar;

  return Object.freeze(proto);
};

/** A graph is a set of nodes and edges connecting them */
const CreasePattern = function (...args) {
  const proto = Prototype();
  const graph = Object.create(proto);
  proto.bind(graph);

  // parse arguments, look for an input .fold file
  // todo: which key should we check to verify .fold? coords /=/ abstract CPs
  const foldObjs = args
    .filter(el => typeof el === "object" && el !== null)
    .filter(el => Validate.possibleFoldObject(el));
    // .filter(el => el.vertices_coords != null);
  // unit square is the default base if nothing else is provided
  graph.load((foldObjs.shift() || Create.square()));

  return graph;
};

CreasePattern.square = function () {
  return CreasePattern(Create.rectangle(1, 1));
};
CreasePattern.rectangle = function (width = 1, height = 1) {
  return CreasePattern(Create.rectangle(width, height));
};
CreasePattern.regularPolygon = function (sides, radius = 1) {
  if (sides == null) {
    console.warn("regularPolygon requires number of sides parameter");
  }
  return CreasePattern(Create.regular_polygon(sides, radius));
};

export default CreasePattern;
