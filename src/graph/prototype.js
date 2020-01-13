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
import planarClean from "../FOLD/planarClean";
import join from "../FOLD/join";
import rebuild from "../FOLD/rebuild";
import populate from "../FOLD/populate";
import * as Transform from "../FOLD/affine";
import {
  nearest_vertex,
  nearest_edge,
  face_containing_point,
  implied_vertices_count
} from "../FOLD/query";
import { clone } from "../FOLD/object";

const vertex_degree = function (v, i) {
  const graph = this;
  Object.defineProperty(v, "degree", {
    get: () => (graph.vertices_vertices && graph.vertices_vertices[i]
      ? graph.vertices_vertices[i].length
      : null)
  });
};

const edge_coords = function (e, i) {
  const graph = this;
  Object.defineProperty(e, "coords", {
    get: () => {
      if (!graph.edges_vertices
        || !graph.edges_vertices[i]
        || !graph.vertices_coords) {
        return undefined;
      }
      return graph.edges_vertices[i].map(v => graph.vertices_coords[v]);
    }
  });
}

const face_simple = function (f, i) {
  const graph = this;
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

const face_coords = function (f, i) {
  const graph = this;
  Object.defineProperty(f, "coords", {
    get: () => {
      if (!graph.faces_vertices
        || !graph.faces_vertices[i]
        || !graph.vertices_coords) {
        return undefined;
      }
      return graph.faces_vertices[i].map(v => graph.vertices_coords[v]);
    }
  });
}

const setup_vertex = function (v, i) {
  vertex_degree.call(this, v, i);
};

const setup_edge = function (e, i) {
  edge_coords.call(this, e, i);
};

const setup_face = function (f, i) {
  face_simple.call(this, f, i);
  face_coords.call(this, f, i);
};

const Prototype = function (proto = {}) {
  /**
   * @param {object} is a FOLD object.
   * @param {options}
   *   "append" import will first, clear FOLD keys. "append":true prevents this clearing
   */
  proto.load = function (object, options = {}) {
    if (options.append !== true) {
      keys.forEach(key => delete this[key]);
    }
    // allow overwriting of file_spec and file_creator if included in import
    Object.assign(this, { file_spec, file_creator }, clone(object));
  };
  /**
   * this performs a planar join, merging the two graphs, fragmenting, cleaning.
   */
  proto.join = function (object, epsilon) {
    join(this, object, epsilon);
  };
  /**
   * this clears all components from the graph, leaving other keys untouched.
   */
  proto.clear = function () {
    fold_keys.graph.forEach(key => delete this[key]);
  };
  /**
   * export
   * @returns {this} a deep copy of this object
   */
  proto.copy = function () {
    return Object.assign(Object.create(Prototype()), clone(this));
  };
  /**
   * modifiers
   */
  proto.clean = function () {
    clean(this);
  };
  proto.planarClean = function () {
    planarClean(this);
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
   * transformations
   */
  proto.translate = function (...args) {
    Transform.transform_translate(this, ...args);
  };
  // proto.rotate = function (...args) {
  //   Transform.transform_rotate(this, ...args);
  // };
  proto.scale = function (...args) {
    Transform.transform_scale(this, ...args);
  };
  /**
   * graph components
   */
  const getVertices = function () {
    const transposed = transpose_geometry_arrays(this, "vertices");
    const vertices = transposed.length !== 0
      ? transposed
      : Array.from(Array(implied_vertices_count(this))).map(() => ({}));
    vertices.forEach(setup_vertex.bind(this));
    return vertices;
  };
  const getEdges = function () {
    const edges = transpose_geometry_arrays(this, "edges");
    edges.forEach(setup_edge.bind(this));
    return edges;
  };
  const getFaces = function () {
    const faces = transpose_geometry_arrays(this, "faces");
    faces.forEach(setup_face.bind(this));
    return faces;
  };
  /**
   * graph components based on Euclidean distance
   */
  proto.nearestVertex = function (...args) {
    const index = nearest_vertex(this, math.core.get_vector(...args));
    const result = transpose_geometry_array_at_index(this, "vertices", index);
    setup_vertex.call(this, result, index);
    result.index = index;
    return result;
  };
  proto.nearestEdge = function (...args) {
    const index = nearest_edge(this, math.core.get_vector(...args));
    const result = transpose_geometry_array_at_index(this, "edges", index);
    setup_edge.call(this, result, index);
    result.index = index;
    return result;
  };
  proto.nearestFace = function (...args) {
    const index = face_containing_point(this, math.core.get_vector(...args));
    if (index === undefined) { return undefined; }
    // todo, if point isn't inside a face, there can still exist a nearest face
    const result = transpose_geometry_array_at_index(this, "faces", index);
    setup_face.call(this, result, index);
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

  Object.defineProperty(proto, "vertices", { get: getVertices });
  Object.defineProperty(proto, "edges", { get: getEdges });
  Object.defineProperty(proto, "faces", { get: getFaces });
  return Object.freeze(proto);
};

export default Prototype;