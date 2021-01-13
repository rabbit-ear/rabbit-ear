/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import setup from "./components";
import {
  fold_keys,
  keys,
  singularize,
  file_spec,
  file_creator,
} from "../graph/fold_keys";
import {
  filter_keys_with_prefix,
  transpose_graph_arrays,
  transpose_graph_array_at_index,
} from "../graph/fold_spec";
import clean from "../graph/clean/clean";
import populate from "../graph/populate";
import fragment from "../graph/fragment";
import assign from "../graph/assign";
import subgraph from "../graph/subgraph";
import {
//   bounding_rect,
  get_boundary,
} from "../graph/boundary";
import transform from "../graph/affine";
import {
  make_vertices_vertices_vector,
  make_vertices_coords_folded,
} from "../graph/make";
import {
  nearest_vertex,
  nearest_edge,
  face_containing_point,
} from "../graph/nearest";
import clone from "../graph/clone";
import svg from "../svg/draw";

// import changed from "./changed";
/**
 * Graph - a flat-array, index-based graph with faces, edges, and vertices
 * with ability for vertices to exist in Euclidean space.
 * The naming scheme for keys follows the FOLD format.
 */
const Graph = {};
Graph.prototype = Object.create(Object.prototype);
Graph.prototype.constructor = Graph;
/**
 * methods where "graph" is the first parameter, followed by ...arguments
 * func(graph, ...args)
 */
const graphMethods = Object.assign({
  clean,
  populate,
  fragment,
  subgraph,
  assign,
  svg,
},
  transform,
);

Object.keys(graphMethods).forEach(key => {
  Graph.prototype[key] = function () {
    return graphMethods[key](this, ...arguments);
  }
});
/**
 * export
 * @returns {this} a deep copy of this object
 */
Graph.prototype.copy = function () {
  return Object.assign(Object.create(Graph.prototype), clone(this));
};
/**
 * @param {object} is a FOLD object.
 * @param {options}
 *   "append" import will first, clear FOLD keys. "append":true prevents this clearing
 */
Graph.prototype.load = function (object, options = {}) {
  if (typeof object !== "object") { return; }
  if (options.append !== true) {
    keys.forEach(key => delete this[key]);
  }
  // allow overwriting of file_spec and file_creator if included in import
  Object.assign(this, { file_spec, file_creator }, clone(object));
};
/**
 * this clears all components from the graph, leaving other keys untouched.
 */
Graph.prototype.clear = function () {
  fold_keys.graph.forEach(key => delete this[key]);
  fold_keys.orders.forEach(key => delete this[key]);
  // avoiding all "file_" keys, but file_frames will contain geometry
  delete this.file_frames;
}
Graph.prototype.folded = function () {
  const vertices_coords = make_vertices_coords_folded(this, ...arguments);
  return Object.assign(
    Object.create(Graph.prototype),
    Object.assign(clone(this), { vertices_coords }, { frame_classes: ["foldedForm"] }));
};

;
/**
 * graph components
 */
// bind "vertices", "edges", or "faces" to "this"
// then we can pass in this function directly to map()
const shortenKeys = function (el, i, arr) {
  const object = Object.create(null);
  Object.keys(el).forEach((k) => {
    object[k.substring(this.length + 1)] = el[k];
  });
  return object;
};
// bind the FOLD graph to "this"
const getComponent = function (key) {
  return transpose_graph_arrays(this, key)
    .map(shortenKeys.bind(key))
    .map(setup[key].bind(this));
};

["vertices", "edges", "faces"]
  .forEach(key => Object.defineProperty(Graph.prototype, key, {
    get: function () { return getComponent.call(this, key); }
  }));

// // get junctions
// Object.defineProperty(Graph.prototype, "junctions", {
//   get: function () {
//     return make_vertices_vertices_vector(this)
//       .map(vectors => math.junction(...vectors));
//   }
// });

// todo: get boundaries, plural
// get boundary. only if the edges_assignment
Object.defineProperty(Graph.prototype, "boundary", {
  get: function () {
    const boundary = get_boundary(this);
    const poly = math.polygon(boundary.vertices.map(v => this.vertices_coords[v]));
    Object.keys(boundary).forEach(key => { poly[key] = boundary[key]; });
    return poly;
  }
});
/**
 * graph components based on Euclidean distance
 */
const nearestMethods = {
  vertices: nearest_vertex,
  edges: nearest_edge,
  faces: face_containing_point,
};

// // bind FOLD graph to "this"
// // key is "vertices" "edges" or "faces"
// const nearestElement = function (key, ...args) {
//   const point = math.core.get_vector(...args);
//   const index = nearestMethods[key](this, point);
//   const result = transpose_graph_array_at_index(this, key, index);
//   setup[key].call(this, result, index);
//   result.index = index;
//   return result;
// };
// Graph.prototype.nearest = function () {
//   const nears = Object.create(null);
//   ["vertices", "edges", "faces"]
//     .forEach(key => Object.defineProperty(nears, singularize[key], {
//       get: () => nearestElement.call(this, key, ...arguments)
//     }));
//   return nears;
// };

Graph.prototype.nearest = function () {
  const point = math.core.get_vector(arguments);
  const nears = Object.create(null);
  const cache = {};
  ["vertices", "edges", "faces"].forEach(key => {
    Object.defineProperty(nears, singularize[key], {
      get: () => {
        if (cache[key] !== undefined) { return cache[key]; }
        cache[key] = nearestMethods[key](this, point);
        return cache[key];
      }
    });
    filter_keys_with_prefix(this, key).forEach(fold_key =>
      Object.defineProperty(nears, fold_key, {
        get: () => this[fold_key][nears[singularize[key]]]
      }));
  });
  return nears;
};

export default Graph.prototype;

