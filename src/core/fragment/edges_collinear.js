import math from "../../../include/math";

/**
 * when an edge and its two vertices are added to a planar graph
 * they need to be resolved.
 *
 * this method will inspect the new edge(s) endpoints for the specific
 * case that they lie collinear along an existing edge.
 * (we need to compare the new vertices against every edge)
 *
 * the intended result is the other edge should be split into two.
 *
 * this method will simply return an Array() size matched to the edges_
 * arrays, with mostly empty contents, but in the case of a collinear
 * vertex, this index in the array will contain that vertex's index.
 */

// "exclusive" means it excludes the area around the endpoints
// otherwise, this includes any point within an epsilon range of the edge
const point_on_edge_exclusive = function (point, edge0, edge1, epsilon = math.core.EPSILON) {
  const edge0_1 = [edge0[0] - edge1[0], edge0[1] - edge1[1]];
  const edge0_p = [edge0[0] - point[0], edge0[1] - point[1]];
  const edge1_p = [edge1[0] - point[0], edge1[1] - point[1]];
  const dEdge = Math.sqrt(edge0_1[0] * edge0_1[0] + edge0_1[1] * edge0_1[1]);
  const dP0 = Math.sqrt(edge0_p[0] * edge0_p[0] + edge0_p[1] * edge0_p[1]);
  const dP1 = Math.sqrt(edge1_p[0] * edge1_p[0] + edge1_p[1] * edge1_p[1]);
  return Math.abs(dEdge - dP0 - dP1) < epsilon * 2;
};

const make_edges_collinearVertices = function (
  graph,
  edges_coords,
  potential_collinear_vertices_indices,
  epsilon = math.core.EPSILON
) {
  const collinear_vertices = edges_coords
    .map(e => potential_collinear_vertices_indices
      .filter(vi => point_on_edge_exclusive(
        graph.vertices_coords[vi], e[0], e[1], epsilon
      )));
  // as of now, an edge can contain its own vertices as collinear.
  // need to remove these.
  // todo: is there a better way? when we build the array originally?
  return collinear_vertices
    .map((cv, i) => cv
      .filter(vi => graph.edges_vertices[i].indexOf(vi) === -1));
};

export default make_edges_collinearVertices;
