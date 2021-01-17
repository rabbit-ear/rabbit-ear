/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
/**
 * CONVEX face only.
 */
export const intersect_face_with_line = ({ vertices_coords, edges_vertices, faces_vertices, faces_edges }, face, vector, origin) => {
  // give us back the indices in the faces_vertices[face] array
  const face_vertices_indices = faces_vertices[face]
    .map(v => vertices_coords[v])
    .map(coord => math.core.overlap_line_point(vector, origin, coord))
    .map((collinear, i) => collinear ? i : undefined)
    .filter(i => i !== undefined)
    .slice(0, 2); // if more than 2, make it 2. (straight edge in convex poly) (if less, untouched)
  // convert to a better return object
  const vertices = face_vertices_indices.map(face_vertex_index => ({
    vertex: faces_vertices[face][face_vertex_index],
    face_vertex_index,
  }));
  
  // if we have 2 unique intersection points we are done
  if (vertices.length > 1) {
    // if vertices are neighbors
    // because convex polygon, if collinear along an edge we can exclude it.
    const non_loop_distance = face_vertices_indices[1] - face_vertices_indices[0];
    // include the case where vertices are neighbors across the end of the array
    const index_distance = non_loop_distance < 0
      ? non_loop_distance + faces_vertices[face].length
      : non_loop_distance;
    if (index_distance === 1) { return undefined; }
    return { vertices, edges: [] };
  }
  const edges = faces_edges[face]
    .map(edge => edges_vertices[edge]
      .map(v => vertices_coords[v]))
    .map(seg => [math.core.subtract(seg[1], seg[0]), seg[0]])
    .map(vec_origin => math.core.intersect_line_line(
      vector, origin, ...vec_origin, math.core.include_l, math.core.exclude_s
    )).map((coords, face_edge_index) => ({
      coords,
      face_edge_index,
      edge: faces_edges[face][face_edge_index],
    }))
    .filter(el => el.coords !== undefined)
    .slice(0, 2); // make 2 if more than 2.

  // in the case of one vertex and one edge return them both
  if (vertices.length > 0 && edges.length > 0) {
    return { vertices, edges };
  }
  // two edges only
  if (edges.length > 1) {
    return { vertices: [], edges };
  }
  // no intersection or invalid case like outside collinear along one vertex only.
  return undefined;
};
