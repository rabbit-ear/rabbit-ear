/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import GraphProto from "./graph";
import { get_boundary } from "../graph/boundary";
import add_vertices from "../graph/add/add_vertices";
import add_edges from "../graph/add/add_edges";
/**
 * Planar Graph - a flat-array, index-based graph with faces, edges, and vertices
 * that exist in 2D space, edges resolved so there are no edge crossings.
 * The naming scheme for keys follows the FOLD format.
 */
const PlanarGraphProto = {};
PlanarGraphProto.prototype = Object.create(GraphProto);

const arcResolution = 32;

PlanarGraphProto.prototype.addSegment = function () {
  const segment = math.core.get_segment(arguments);
  const vertices_coords = segment;
  if (!this.vertices_coords) { this.vertices_coords = []; }
  if (!this.edges_vertices) { this.edges_vertices = []; }
  const len = this.vertices_coords.length;
  const edge_vertices = [len, len + 1];
  this.vertices_coords.push(...vertices_coords);
  this.edges_vertices.push(edge_vertices);
  this.fragment();
};

PlanarGraphProto.prototype.addSegments = function () {
  const segments = math.core.semi_flatten_arrays(arguments)
    .map(el => math.core.get_segment(el));
  console.log("segs", segments);
  const vertices_coords = segments.reduce((a, b) => a.concat(b), []);
  if (!this.vertices_coords) { this.vertices_coords = []; }
  if (!this.edges_vertices) { this.edges_vertices = []; }
  const len = this.vertices_coords.length;
  const edges_vertices = Array.from(Array(segments.length))
    .map((_, i) => [len + i * 2, len + i * 2 + 1]);
  this.vertices_coords.push(...vertices_coords);
  this.edges_vertices.push(...edges_vertices);
  this.fragment();
};

["circle", "ellipse", "rect", "polygon"].forEach((fName) => {
  PlanarGraphProto.prototype[fName] = function () {
    const primitive = math[fName](...arguments);
    if (!primitive) { return; }
    this.addSegments(primitive.segments(arcResolution));
  };
});

export default PlanarGraphProto.prototype;
