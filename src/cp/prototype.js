/**
 * Crease Pattern - a flat-array, index-based graph with faces, edges, and vertices
 * that exist in 2D space, edges resolved so there are no edge crossings.
 * The naming scheme for keys follows the FOLD format.
 */
import math from "../math";
import GraphProto from "../graph/prototype";
import fragment from "../core/fragment";
import { get_boundary } from "../core/boundary";
// import join from "../core/join";

const CreasePatternProto = {};
CreasePatternProto.prototype = Object.create(GraphProto);

const arcResolution = 32;

/**
 * methods that follow the form: func(graph, ...args)
 */
// const methods = {
//   clean,
//   populate,
//   // rebuild
// };
// Object.keys(methods).forEach(key => {
//   CreasePatternProto.prototype[key] = function () {
//     methods[key](this, ...arguments);
//     // this.changed.update(this.clean);
//   }
// });

/**
 * this performs a planar join, merging the two graphs, fragmenting, cleaning.
 */
// CreasePatternProto.prototype.join = function (object, epsilon) {
//   join(this, object, epsilon);
//   // this.changed.update(this.join);
// };
// CreasePatternProto.fragment = function (epsilon = math.core.EPSILON) {
//   fragment(this, epsilon);
//   this.changed.update(this.fragment);
// };
CreasePatternProto.prototype.fragment = function () {
  fragment(this, ...arguments);
  // this.changed.update(this.fragment);
};

const add_segment = function () {
  const segment = math.core.get_segment(arguments);
  const vertices_coords = segment;
  if (!this.vertices_coords) { this.vertices_coords = []; }
  if (!this.edges_vertices) { this.edges_vertices = []; }
  const len = this.vertices_coords.length;
  const edge_vertices = [len, len + 1];
  this.vertices_coords.push(...vertices_coords);
  this.edges_vertices.push(edge_vertices);
  this.fragment(math.core.EPSILON, [this.edges_vertices.length - 1]);
};

CreasePatternProto.prototype.addSegments = function () {
  const segments = math.core.semi_flatten_arrays(arguments)
    .map(el => math.core.get_segment(el));
  // console.log("segs", segments);
  const vertices_coords = segments.reduce((a, b) => a.concat(b), []);
  if (!this.vertices_coords) { this.vertices_coords = []; }
  if (!this.edges_vertices) { this.edges_vertices = []; }
  const len = this.vertices_coords.length;
  const edges_vertices = Array.from(Array(segments.length))
    .map((_, i) => [len + i * 2, len + i * 2 + 1]);
  const new_edges_indices = Array.from(Array(segments.length))
    .map((_, i) => this.edges_vertices.length + i);
  this.vertices_coords.push(...vertices_coords);
  this.edges_vertices.push(...edges_vertices);
  this.fragment(math.core.EPSILON, new_edges_indices);
};

// todo. this should become make boundaries, plural.
const check_boundary = (graph) => {
  if (!graph.boundaries_edges || !graph.boundaries_vertices) {
    const boundary = get_boundary(graph);
    if (!graph.boundaries_vertices) {
      graph.boundaries_vertices = [boundary.vertices];
    }
    if (!graph.boundaries_edges) {
      graph.boundaries_edges = [boundary.edges];
    }
  }
};

["segment", "ray", "line"].forEach((fName) => {
  CreasePatternProto.prototype[fName] = function () {
    check_boundary(this);
    const primitive = math[fName](...arguments);
    if (!primitive) { return; }
    const poly = this.boundaries_vertices[0].map(v => this.vertices_coords[v]);
    const clip = math.core[`clip_${fName}_in_convex_poly_exclusive`](poly, primitive.vector, primitive.origin);
    this.addSegment(clip);
  };
});

["circle", "ellipse", "rect", "polygon"].forEach((fName) => {
  CreasePatternProto.prototype[fName] = function () {
    const primitive = math[fName](...arguments);
    if (!primitive) { return; }
    this.addSegments(primitive.segments(arcResolution));
  };
});

export default CreasePatternProto.prototype;
