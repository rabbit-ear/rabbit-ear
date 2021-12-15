import math from "../math";
import {
  make_edges_vector,
  make_faces_winding
} from "./make";

const make_edges_subset_faces_overlap = ({ vertices_coords, edges_vertices, edges_vector, edges_faces, faces_edges, faces_vertices }, edges, epsilon) => {
};

const make_edges_faces_overlap = ({ vertices_coords, edges_vertices, edges_vector, edges_faces, faces_edges, faces_vertices }, epsilon) => {
  if (!edges_vector) {
    edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
  }
  const faces_winding = make_faces_winding({ vertices_coords, faces_vertices });
  // use graph vertices_coords for edges vertices
  const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
  // convert parallel into NOT parallel.
  const matrix = edges_vertices
    .map(() => Array.from(Array(faces_vertices.length)));

  edges_faces.forEach((faces, e) => faces
    .forEach(f => { matrix[e][f] = false; }));

  edges_faces.forEach((faces, e) => faces
    .forEach(f => { matrix[e][f] = false; }));

  const edges_vertices_coords = edges_vertices
    .map(verts => verts.map(v => vertices_coords[v]));
  const faces_vertices_coords = faces_vertices
    .map(verts => verts.map(v => vertices_coords[v]))
    .map((polygon, f) => faces_winding[f] ? polygon : polygon.reverse());

  matrix.forEach((row, e) => row.forEach((val, f) => {
    if (val === false) { return; }
    // both segment endpoints, true if either one of them is inside the face.
    const point_in_poly = edges_vertices_coords[e]
      .map(point => math.core.overlap_convex_polygon_point(
        faces_vertices_coords[f],
        point,
        math.core.exclude,
        epsilon
      )).reduce((a, b) => a || b, false);
    if (point_in_poly) { matrix[e][f] = true; return; }
    const edge_intersect = math.core.intersect_convex_polygon_line(
      faces_vertices_coords[f],
      edges_vector[e],
      edges_origin[e],
      math.core.exclude_s,
      math.core.exclude_s,
      epsilon
    );
    if (edge_intersect) { matrix[e][f] = true; return; }
    matrix[e][f] = false;
  }));
  return matrix;
};

export default make_edges_faces_overlap;
