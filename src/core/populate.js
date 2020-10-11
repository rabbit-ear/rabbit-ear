/**
 * this function attempts to rebuild useful geometries in your graph.
 * right now let's say it's important to have:
 * - vertices_coords
 * - either edges_vertices or faces_vertices
 * - either edges_foldAngle or edges_assignment
 *
 * this WILL REWRITE components that aren't the primary source keys,
 * like vertices_vertices.
 * the idea is many of these keys can be easily forgotten as the more
 * important parts of the graph get build up. hence, overwriting these keys.
 *
 * if you do have edges_assignment instead of edges_foldAngle the origami
 * will be limited to flat-foldable.
 */

 /**
 * old description:
 * populate() will assess each graph component that is missing and
 * attempt to create as many as possible.
 *
 * this WILL NOT rewrite components, if a key exists, it will leave it alone
 *
 * example: to make populate() rebuild faces_vertices, run ahead of time:
 *  - delete graph.faces_vertices
 * so that the query evalutes to == null (undefined)
 */

// import FOLDConvert from "../../include/fold/convert";
import {
  make_vertices_vertices,
  make_vertices_edges,
  make_vertices_faces,
  make_vertices_sectors,
  make_edges_edges,
  make_edges_faces,
  make_edges_foldAngle,
  make_edges_assignment,
  make_edges_length,
  make_edges_vector,
  make_faces_faces,
  make_faces_matrix,
  make_planar_faces,
} from "./make";
import {
  edge_assignment_to_foldAngle
} from "./keys";

const populate = (graph) => {
  if (typeof graph !== "object") { return; }
  graph.vertices_edges = make_vertices_edges(graph);
  // graph.edges_edges = make_edges_edges(graph);
  graph.vertices_vertices = make_vertices_vertices(graph);
  graph.edges_vector = make_edges_vector(graph);
  graph.vertices_sectors = make_vertices_sectors(graph);
  if (graph.edges_foldAngle) {
    graph.edges_assignment = make_edges_assignment(graph);
  } else if (graph.edges_assignment) {
    graph.edges_foldAngle = make_edges_foldAngle(graph);
  }
  const faces = make_planar_faces(graph);
  graph.faces_vertices = faces.map(face => face.vertices);
  graph.faces_edges = faces.map(face => face.edges);
  graph.faces_angles = faces.map(face => face.angles);
  graph.vertices_faces = make_vertices_faces(graph);
  graph.faces_faces = make_faces_faces(graph);
  graph.faces_matrix = make_faces_matrix(graph);
  return graph;
}

// const populate = function (graph) {
//   if (typeof graph !== "object") { return; }
//   if (graph.vertices_vertices == null) {
//     if (graph.vertices_coords && graph.edges_vertices) {
//       FOLDConvert.edges_vertices_to_vertices_vertices_sorted(graph);
//     } else if (graph.edges_vertices) {
//       FOLDConvert.edges_vertices_to_vertices_vertices_unsorted(graph);
//     }
//   }
//   if (graph.faces_vertices == null) {
//     if (graph.vertices_coords && graph.vertices_vertices) {
//       // todo, this can be rebuilt to remove vertices_coords dependency
//       FOLDConvert.vertices_vertices_to_faces_vertices(graph);
//     }
//   }
//   if (graph.faces_edges == null) {
//     if (graph.faces_vertices) {
//       FOLDConvert.faces_vertices_to_faces_edges(graph);
//     }
//   }
//   if (graph.edges_faces == null) {
//     const edges_faces = make_edges_faces(graph);
//     if (edges_faces !== undefined) {
//       graph.edges_faces = edges_faces;
//     }
//   }
//   if (graph.vertices_faces == null) {
//     const vertices_faces = make_vertices_faces(graph);
//     if (vertices_faces !== undefined) {
//       graph.vertices_faces = vertices_faces;
//     }
//   }
//   if (graph.edges_length == null) {
//     const edges_length = make_edges_length(graph);
//     if (edges_length !== undefined) {
//       graph.edges_length = edges_length;
//     }
//   }
//   if (graph.edges_foldAngle == null
//     && graph.edges_assignment != null) {
//     graph.edges_foldAngle = graph.edges_assignment
//       .map(a => edge_assignment_to_foldAngle(a));
//   }
//   if (graph.edges_assignment == null
//     && graph.edges_foldAngle != null) {
//     graph.edges_assignment = graph.edges_foldAngle.map((a) => {
//       if (a === 0) { return "F"; }
//       if (a < 0) { return "M"; }
//       if (a > 0) { return "V"; }
//       return "U";
//     });
//     // todo, this does not find borders, we need an algorithm to walk around
//   }
//   if (graph.faces_faces == null) {
//     const faces_faces = make_faces_faces(graph);
//     if (faces_faces !== undefined) {
//       graph.faces_faces = faces_faces;
//     }
//   }
//   if (graph.vertices_edges == null) {
//     const vertices_edges = make_vertices_edges(graph);
//     if (vertices_edges !== undefined) {
//       graph.vertices_edges = vertices_edges;
//     }
//   }
//   if (graph.edges_edges == null) {
//     const edges_edges = make_edges_edges(graph);
//     if (edges_edges !== undefined) {
//       graph.edges_edges = edges_edges;
//     }
//   }
// };

export default populate;
