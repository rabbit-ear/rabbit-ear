/**
 * Graph - a flat-array, index-based graph with faces, edges, and vertices
 * with ability for vertices to exist in Euclidean space.
 * The naming scheme for keys follows the FOLD format.
 */
import math from "../math";
import setup from "./component_setup";
import {
  transpose_graph_arrays,
  transpose_graph_array_at_index,
  fold_keys,
  keys,
  singularize,
  file_spec,
  file_creator,
} from "../core/keys";
import clean from "../core/clean";
// import rebuild from "../core/rebuild";
import populate from "../core/populate";
import {
//   bounding_rect,
  get_boundary,
} from "../core/boundary";
import transform from "../core/affine";
import {
  nearest_vertex,
  nearest_edge,
  face_containing_point,
} from "../core/nearest";
import { clone } from "../core/javascript";
// import changed from "./changed";

const GraphProto = {};
GraphProto.prototype = Object.create(Object.prototype);
// GraphProto.prototype.changed = changed();

/**
 * methods that follow the form: func(graph, ...args)
 */
const methods = {
  clean,
  populate,
  // rebuild
};
Object.keys(methods).forEach(key => {
  GraphProto.prototype[key] = function () {
    methods[key](this, ...arguments);
    // this.changed.update(this.clean);
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
  // this.changed.update(this.load);
};
/**
 * this clears all components from the graph, leaving other keys untouched.
 */
GraphProto.prototype.clear = function () {
  fold_keys.graph.forEach(key => delete this[key]);
  fold_keys.orders.forEach(key => delete this[key]);
  // avoiding all "file_" keys, but file_frames will contain geometry
  delete this.file_frames;
  // this.changed.update(this.clear);
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
/**
 * transformations
 */
["translate", "scale", "rotateZ", "matrix"].forEach(key => {
  GraphProto.prototype[key] = function () {
    return transform[key](this, ...arguments);
    // this.changed.update(this.translate);
  }
});

export default GraphProto.prototype;
