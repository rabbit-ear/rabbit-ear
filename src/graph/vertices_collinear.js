/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import { get_edges_vertices_span } from "./span";
/**
 * check each vertex against each edge, we want to know if a vertex is
 * lying collinear along an edge, the usual intention is to substitute
 * the edge with 2 edges that include the collinear vertex.
 */
/**
 * this DOES NOT return vertices that are already connected
 * between two adjacent and collinear edges, in a valid graph
 *    O------------O------------O
 * for this you want: ___________ method
 */
/**
 * edges_collinear_vertices is a list of lists where for every edge there is a
 * list filled with vertices that lies collinear to the edge, where
 * collinearity only counts if the vertex lies between the edge's endpoints,
 * excluding the endpoints themselves.
 * 
 * @returns {number[][]} size matched to the edges_ arrays, with an empty array
 * unless a vertex lies collinear, the edge's array will contain that vertex's index.
 */
export const get_vertices_edges_overlap = ({ vertices_coords, edges_vertices, edges_coords }, epsilon = math.core.EPSILON) => {
  if (!edges_coords) {
    edges_coords = edges_vertices.map(ev => ev.map(v => vertices_coords[v]));
  }
  const edges_span_vertices = get_edges_vertices_span({
    vertices_coords, edges_vertices, edges_coords
  }, epsilon);
  // todo, consider pushing values into a results array instead of modifying,
  // then filtering the existing one
  for (let e = 0; e < edges_coords.length; e += 1) {
    for (let v = 0; v < vertices_coords.length; v += 1) {
      if (!edges_span_vertices[e][v]) { continue; }
      edges_span_vertices[e][v] = math.core.overlap_line_point(
        math.core.subtract(edges_coords[e][1], edges_coords[e][0]),
        edges_coords[e][0],
        vertices_coords[v],
        math.core.exclude_s,
        epsilon
      );
    }
  }
  return edges_span_vertices
    .map(verts => verts
      .map((vert, i) => vert ? i : undefined)
      .filter(i => i !== undefined));
};
