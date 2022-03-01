import math from "../../math";
import { make_faces_winding } from "../../graph/faces_winding";
import { make_faces_faces_overlap } from "../../graph/overlap";
/**
 * @description given a folded graph, find all trios of faces which overlap
 * each other, meaning there exists at least one point that lies at the
 * intersection of all three faces.
 * @returns {number[][]} list of arrays containing three face indices.
 */
const make_transitivity_trios = (graph, overlap_matrix, faces_winding, epsilon = math.core.EPSILON) => {
  if (!overlap_matrix) {
    overlap_matrix = make_faces_faces_overlap(graph, epsilon);
  }
  if (!faces_winding) {
    faces_winding = make_faces_winding(graph);
  }
  // prepare a list of all faces in the graph as lists of vertices
  // also, make sure they all have the same winding (reverse if necessary)
  const polygons = graph.faces_vertices
    .map(face => face
      .map(v => graph.vertices_coords[v]));
  polygons.forEach((face, i) => {
    if (!faces_winding[i]) { face.reverse(); }
  });
  const matrix = graph.faces_vertices.map(() => []);
  for (let i = 0; i < matrix.length - 1; i++) {
    for (let j = i + 1; j < matrix.length; j++) {
      if (!overlap_matrix[i][j]) { continue; }
      const polygon = math.core.intersect_polygon_polygon(polygons[i], polygons[j], epsilon);
      if (polygon) { matrix[i][j] = polygon; }
    }
  }
  const trios = [];
  for (let i = 0; i < matrix.length - 1; i++) {
    for (let j = i + 1; j < matrix.length; j++) {
      if (!matrix[i][j]) { continue; }
      for (let k = j + 1; k < matrix.length; k++) {
        if (i === k || j === k) { continue; }
        if (!overlap_matrix[i][k] || !overlap_matrix[j][k]) { continue; }
        const polygon = math.core.intersect_polygon_polygon(matrix[i][j], polygons[k], epsilon);
        if (polygon) { trios.push([i, j, k].sort((a, b) => a - b)); }
      }
    }
  }
  return trios;
};

export default make_transitivity_trios;
