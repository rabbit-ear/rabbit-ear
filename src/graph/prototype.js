/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import setup from "./prototype_components";
import {
  transpose_graph_arrays,
  transpose_graph_array_at_index,
  fold_keys,
  keys,
  singularize,
  file_spec,
  file_creator,
} from "./keys";
import clean from "./clean";
// import rebuild from "./rebuild";
import populate from "./populate";
import {
//   bounding_rect,
  get_boundary,
} from "./boundary";
import transform from "./affine";
import {
  nearest_vertex,
  nearest_edge,
  face_containing_point,
} from "./nearest";
import { clone } from "./javascript";
// import changed from "./changed";
/**
 * Graph - a flat-array, index-based graph with faces, edges, and vertices
 * with ability for vertices to exist in Euclidean space.
 * The naming scheme for keys follows the FOLD format.
 */

const GraphProto = {};
GraphProto.prototype = Object.create(Object.prototype);
/**
 * methods that follow the form: func(graph, ...args)
 */
const graphMethods = {
  clean,
  populate,
  // rebuild
};
Object.keys(graphMethods).forEach(key => {
  GraphProto.prototype[key] = function () {
    graphMethods[key](this, ...arguments);
  }
});
/**
 * transformations
 */
Object.keys(transform).forEach(key => {
  GraphProto.prototype[key] = function () {
    return transform[key](this, ...arguments);
  }
});
/**
 * export
 * @returns {this} a deep copy of this object
 */
GraphProto.prototype.copy = function () {
  return Object.assign(Object.create(GraphProto), clone(this));
};
/**
 * @param {object} is a FOLD object.
 * @param {options}
 *   "append" import will first, clear FOLD keys. "append":true prevents this clearing
 */
GraphProto.prototype.load = function (object, options = {}) {
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
GraphProto.prototype.clear = function () {
  fold_keys.graph.forEach(key => delete this[key]);
  fold_keys.orders.forEach(key => delete this[key]);
  // avoiding all "file_" keys, but file_frames will contain geometry
  delete this.file_frames;
};
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
  .forEach(key => Object.defineProperty(GraphProto.prototype, key, {
    get: function () { return getComponent.call(this, key); }
  }));

// get boundary. only if the edges_assignment
Object.defineProperty(GraphProto.prototype, "boundary", {
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

// bind FOLD graph to "this"
// key is "vertices" "edges" or "faces"
const nearestElement = function (key, ...args) {
  const point = math.core.get_vector(...args);
  const index = nearestMethods[key](this, point);
  const result = transpose_graph_array_at_index(this, key, index);
  setup[key].call(this, result, index);
  result.index = index;
  return result;
};
GraphProto.prototype.nearest = function () {
  const nears = Object.create(null);
  ["vertices", "edges", "faces"]
    .forEach(key => Object.defineProperty(nears, singularize[key], {
      get: () => nearestElement.call(this, key, ...arguments)
    }));
  return nears;
};

export default GraphProto.prototype;
