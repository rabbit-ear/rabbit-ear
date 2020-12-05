/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import GraphProto from "./graph";
import { get_boundary } from "../graph/boundary";
import add_vertices from "../graph/add/add_vertices";
import add_edges from "../graph/add/add_edges";
/**
 * Crease Pattern - a flat-array, index-based graph with faces, edges, and vertices
 * that exist in 2D space, edges resolved so there are no edge crossings.
 * The naming scheme for keys follows the FOLD format.
 */
const CreasePatternProto = {};
CreasePatternProto.prototype = Object.create(GraphProto);

const arcResolution = 96;
/**
 * @usage bind graph to this
 * @param {number[][]} endpoint coords in this form: [ [x,y(,z)], [x,y(,z)] ]
 * @returns undefined
 */
// const add_segment = function () {
//   const vertices_coords = Array.from(...arguments)
//   const new_vertices = add_vertices(this, { vertices_coords });
//   const new_edges = add_edges(this, { edges_vertices: [ new_vertices ] });
//   finish_new_edges(this, new_edges);
//   fragment(this, math.core.EPSILON, new_edges);
// };
/**
 * @usage bind graph to this
 * @param {number[][]} segments with endpoint coords in this form:
 *   [ [ [x,y], [x,y] ], [ [x,y], [x,y] ], ]
 * @returns undefined
 */
const add_segments = function () {
  const vertices_coords = Array.from(...arguments)
    .reduce((a, b) => a.concat(b), []);
  const new_vertices = add_vertices(this, vertices_coords);
  const edges_vertices = Array.from(Array(new_vertices.length/2))
    .map((_, i) => [ new_vertices[i * 2], new_vertices[i * 2 + 1] ]);
  const new_edges = add_edges(this, { edges_vertices });
  finish_new_edges(this, new_edges);
  fragment(this, math.core.EPSILON, new_edges);
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

// todo. this should become make boundaries, plural.
const make_boundary = (graph) => {
  const boundary = get_boundary(graph);
  graph.boundaries_vertices = [boundary.vertices];
  graph.boundaries_edges = [boundary.edges];
};
const remove_boundary = (graph) => {
  delete graph.boundaries_vertices;
  delete graph.boundaries_edges;
};

const finish_new_edges = (graph, new_edges) => {
  if (graph.edges_assignment) {
    new_edges.forEach(i => { graph.edges_assignment[i] = "U"; });
  }
  if (graph.edges_foldAngle) {
    new_edges.forEach(i => { graph.edges_foldAngle[i] = 0; });
  }
};

const clip_segments_in_poly = (poly, segments) => segments
  .map(seg => math.core.clip_segment_in_convex_poly_exclusive(poly, ...seg))
  .filter(a => a !== undefined);

["segment", "ray", "line"].forEach((fName) => {
  CreasePatternProto.prototype[fName] = function () {
    make_boundary(this);
    const primitive = arguments[0] instanceof math[fName]
      ? arguments[0]
      : math[fName](...arguments);
    if (!primitive) { return; }
    const poly = this.boundaries_vertices[0].map(v => this.vertices_coords[v]);
    const params = fName === "segment"
      ? primitive.points
      : [primitive.vector, primitive.origin];
    const clip = math.core[`clip_${fName}_in_convex_poly_exclusive`](poly, ...params);
    add_segments.call(this, [ clip ]);
    remove_boundary(this);
  };
});

["circle", "ellipse", "rect", "polygon"].forEach((fName) => {
  CreasePatternProto.prototype[fName] = function () {
    make_boundary(this);
    const primitive = arguments[0] instanceof math[fName]
      ? arguments[0]
      : math[fName](...arguments);
    if (!primitive) { return; }
    const poly = this.boundaries_vertices[0].map(v => this.vertices_coords[v]);
    const segments = clip_segments_in_poly(poly, primitive.segments(arcResolution));
    add_segments.call(this, segments);
    remove_boundary(this);
  };
});

export default CreasePatternProto.prototype;
