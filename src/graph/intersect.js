/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import {
  make_edges_vector,
  make_edges_coords,
  make_edges_bounding_box,
} from "./make";
import { get_edges_edges_span } from "./span";
/**
 * @description return the indices of edges which overlap the segment
 * @param {object} a FOLD graph
 * @param {number[]} point1, the first point of the segment
 * @param {number[]} point2, the second point of the segment
 * @returns {number[]} array of edge indices which overlap the segment
 */
export const make_edges_segment_intersection = ({ vertices_coords, edges_vertices, edges_coords }, point1, point2, epsilon = math.core.EPSILON) => {
  if (!edges_coords) {
    edges_coords = make_edges_coords({ vertices_coords, edges_vertices });
  }
  const segment_box = math.core.bounding_box([point1, point2], epsilon);
  const segment_vector = math.core.subtract2(point2, point1);
  // convert each edge into a bounding box, do bounding-box intersection
  // with the segment, filter these results, then run actual intersection
  // algorithm on this subset.
  return make_edges_bounding_box({ vertices_coords, edges_vertices, edges_coords }, epsilon)
    .map(box => math.core.overlap_bounding_boxes(segment_box, box))
    .map((overlap, i) => overlap ? (math.core.intersect_line_line(
      segment_vector,
      point1,
      math.core.subtract2(edges_coords[i][1], edges_coords[i][0]),
      edges_coords[i][0],
      math.core.include_s,
      math.core.include_s,
      epsilon)) : undefined);
};
/**
 * this method compares every edge against every edge (n^2) to see if the
 * segments exclusively intersect each other (touching endpoints doesn't count)
 *
 * @param {object} FOLD graph. only requires { edges_vector, edges_origin }
 * if they don't exist this will build them from { vertices_coords, edges_vertices }
 *
 * @param {number} epsilon, optional
 *
 * @returns {number[][][]} NxN matrix comparing indices, undefined in the case of
 * no intersection, a point object in array form if yes, and this array is stored
 * in 2 PLACES! both [i][j] and [j][i], however it is stored by reference,
 * it is the same js object.
 *
 *     0  1  2  3
 * 0 [  , x,  ,  ]
 * 1 [ x,  ,  , x]
 * 2 [  ,  ,  ,  ]
 * 3 [  , x,  ,  ]
 */
export const make_edges_edges_intersection = function ({
  vertices_coords, edges_vertices, edges_vector, edges_origin
}, epsilon = math.core.EPSILON) {
  if (!edges_vector) {
    edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
  }
  if (!edges_origin) {
    edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
  }
  const edges_intersections = edges_vector.map(() => []);
  const span = get_edges_edges_span({ vertices_coords, edges_vertices }, epsilon);
  for (let i = 0; i < edges_vector.length - 1; i += 1) {
    for (let j = i + 1; j < edges_vector.length; j += 1) {
      if (span[i][j] !== true) {
        // this setter is unnecessary but otherwise the result is filled with
        // both undefined and holes. this makes it consistent
        edges_intersections[i][j] = undefined;
        continue;
      }
      edges_intersections[i][j] = math.core.intersect_line_line(
        edges_vector[i],
        edges_origin[i],
        edges_vector[j],
        edges_origin[j],
        math.core.exclude_s,
        math.core.exclude_s,
        epsilon
      );
      edges_intersections[j][i] = edges_intersections[i][j];
    }
  }
  return edges_intersections;
};
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
