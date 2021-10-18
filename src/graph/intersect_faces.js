/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import { shouldNotBeHere } from "../environment/debug";
/**
 * @description intersect a CONVEX face with a line and return the location
 * of the intersections as components of the graph. this is an EXCLUSIVE
 * intersection. line collinear to the edge counts as no intersection.
 * there are 5 cases:
 * - no intersection (undefined)
 * - intersect one vertex (undefined)
 * - intersect two vertices (valid, or undefined if neighbors)
 * - intersect one vertex and one edge (valid)
 * - intersect two edges (valid)
 * @param {object} FOLD object
 * @param {number} the index of the face
 * @param {number[]} the vector component describing the line
 * @param {number[]} the point component describing the line
 * @param {number} epsilon, optional
 * @returns {object | undefined} "vertices" and "edges" keys, indices of the
 * components which intersect the line. or undefined if no intersection
 */
export const intersect_convex_face_line = ({ vertices_coords, edges_vertices, faces_vertices, faces_edges }, face, vector, point, epsilon = math.core.EPSILON) => {
  // give us back the indices in the faces_vertices[face] array
  // we can count on these being sorted (important later)
  const face_vertices_indices = faces_vertices[face]
    .map(v => vertices_coords[v])
    .map(coord => math.core.overlap_line_point(vector, point, coord, () => true, epsilon))
    .map((overlap, i) => overlap ? i : undefined)
    .filter(i => i !== undefined);
  // o-----o---o  we have to test against cases like this, where more than two
  // |         |  vertices lie along one line. 
  // o---------o
  const vertices = face_vertices_indices.map(i => faces_vertices[face][i]);
  // concat a duplication of the array where the second array's vertices'
  // indices' are all increased by the faces_vertices[face].length.
  // ask every neighbor pair if they are 1 away from each other, if so, the line
  // lies along an outside edge of the convex poly, return "no intersection".
  // the concat is needed to detect neighbors across the end-beginning loop.
  const vertices_are_neighbors = face_vertices_indices
    .concat(face_vertices_indices.map(i => i + faces_vertices[face].length))
    .map((n, i, arr) => arr[i + 1] - n === 1)
    .reduce((a, b) => a || b, false);
  // if vertices are neighbors
  // because convex polygon, if collinear vertices lie along an edge,
  // it must be an outside edge. this case returns no intersection.
  if (vertices_are_neighbors) { return undefined; }
  if (vertices.length > 1) { return { vertices, edges: [] }; }
  // run the line-segment intersection on every side of the face polygon
  const edges = faces_edges[face]
    .map(edge => edges_vertices[edge]
      .map(v => vertices_coords[v]))
    .map(seg => math.core.intersect_line_line(
      vector,
      point,
      math.core.subtract(seg[1], seg[0]),
      seg[0],
      math.core.include_l,
      math.core.exclude_s,
      epsilon
    )).map((coords, face_edge_index) => ({
      coords,
      edge: faces_edges[face][face_edge_index],
    }))
    // remove edges with no intersection
    .filter(el => el.coords !== undefined)
    // remove edges which share a vertex with a previously found vertex.
    // these edges are because the intersection is near a vertex but also
    // intersects the edge very close to the end.
    .filter(el => !(vertices
      .map(v => edges_vertices[el.edge].includes(v))
      .reduce((a, b) => a || b, false)));
  // only return the case with 2 intersections. for example, only 1 vertex
  // intersection implies outside the polygon, collinear with one vertex.
  return (edges.length + vertices.length === 2
    ? { vertices, edges }
    : undefined);
};
