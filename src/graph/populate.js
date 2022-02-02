/**
 * Rabbit Ear (c) Robby Kraft
 */
import {
  make_vertices_vertices,
  make_vertices_edges_unsorted,
  make_vertices_edges, // todo resolve this duplicate work
  make_vertices_faces,
  make_edges_edges,
  make_edges_faces_unsorted,
  make_edges_foldAngle,
  make_edges_assignment,
  // make_edges_vector,
  make_faces_faces,
  make_faces_edges_from_vertices,
  make_faces_vertices_from_edges,
  make_planar_faces,
} from "./make";
import {
  edge_assignment_to_foldAngle,
  edge_foldAngle_to_assignment,
} from "../fold/spec";

/**
 * @description populate() has been one of the hardest methods to
 * nail down, not to write, moreso in what it should do, and what
 * function it serves in the greater library.
 * Currently, it is run once when a user imports their crease pattern
 * for the first time, preparing it for use with methods like
 * "split_face" or "flat_fold", which expect a well-populated graph.
 */
//
// big todo: populate assumes the graph is planar and rebuilds planar faces
//

// try best not to lose information
const build_assignments_if_needed = (graph) => {
  const len = graph.edges_vertices.length;
  // we know that edges_vertices exists
  if (!graph.edges_assignment) { graph.edges_assignment = []; }
  if (!graph.edges_foldAngle) { graph.edges_foldAngle = []; }
  // complete the shorter array to match the longer one
  if (graph.edges_assignment.length > graph.edges_foldAngle.length) {
    for (let i = graph.edges_foldAngle.length; i < graph.edges_assignment.length; i += 1) {
      graph.edges_foldAngle[i] = edge_assignment_to_foldAngle(graph.edges_assignment[i]);
    }
  }
  if (graph.edges_foldAngle.length > graph.edges_assignment.length) {
    for (let i = graph.edges_assignment.length; i < graph.edges_foldAngle.length; i += 1) {
      graph.edges_assignment[i] = edge_foldAngle_to_assignment(graph.edges_foldAngle[i]);
    }
  }
  // two arrays should be at the same length now. even if they are not complete
  for (let i = graph.edges_assignment.length; i < len; i += 1) {
    graph.edges_assignment[i] = "U";
    graph.edges_foldAngle[i] = 0;
  }
};
/**
 * @param {object} a FOLD object
 * @param {boolean} reface should be set to "true" to force the algorithm into
 * rebuilding the faces from scratch (walking edge to edge in the plane).
 */
const build_faces_if_needed = (graph, reface) => {
  // if faces_vertices does not exist, we need to build it.
  // todo: if faces_edges exists but not vertices (unusual but possible),
  // then build faces_vertices from faces_edges and call it done.
  if (reface === undefined && !graph.faces_vertices && !graph.faces_edges) {
    reface = true;
  }
  // build planar faces (no Z) if the user asks for it or if faces do not exist.
  // todo: this is making a big assumption that the faces are even planar
  // to begin with.
  if (reface && graph.vertices_coords) {
    const faces = make_planar_faces(graph);
    graph.faces_vertices = faces.map(face => face.vertices);
    graph.faces_edges = faces.map(face => face.edges);
    // graph.faces_sectors = faces.map(face => face.angles);
    return;
  }
  // if both faces exist, and no request to be rebuilt, exit.
  if (graph.faces_vertices && graph.faces_edges) { return; }
  // between the two: faces_vertices and faces_edges,
  // if only one exists, build the other.
  if (graph.faces_vertices && !graph.faces_edges) {
    graph.faces_edges = make_faces_edges_from_vertices(graph);
  } else if (graph.faces_edges && !graph.faces_vertices) {
    graph.faces_vertices = make_faces_vertices_from_edges(graph);
  } else {
    // neither array exists, set placeholder empty arrays.
    graph.faces_vertices = [];
    graph.faces_edges = [];
  }
};
/**
 * this function attempts to rebuild useful geometries in your graph.
 * right now let's say it's important to have:
 * - vertices_coords
 * - either edges_vertices or faces_vertices - todo: this isn't true yet.
 * - either edges_foldAngle or edges_assignment
 *
 * this WILL REWRITE components that aren't the primary source keys,
 * like vertices_vertices.
 *
 * if you do have edges_assignment instead of edges_foldAngle the origami
 * will be limited to flat-foldable.
 */
const populate = (graph, reface) => {
  if (typeof graph !== "object") { return graph; }
  if (!graph.edges_vertices) { return graph; }
  graph.vertices_edges = make_vertices_edges_unsorted(graph);
  graph.vertices_vertices = make_vertices_vertices(graph);
  graph.vertices_edges = make_vertices_edges(graph);
  // todo consider adding vertices_sectors, these are used for
  // planar graphs (crease patterns) for walking faces
  // todo, what is the reason to have edges_vector?
  // if (graph.vertices_coords) {
  //   graph.edges_vector = make_edges_vector(graph);
  // }
  // make sure "edges_foldAngle" and "edges_assignment" are done.
  build_assignments_if_needed(graph);
  // make sure "faces_vertices" and "faces_edges" are built.
  build_faces_if_needed(graph, reface);
  // depending on the presence of vertices_vertices, this will
  // run the simple algorithm (no radial sorting) or the proper one.
  graph.vertices_faces = make_vertices_faces(graph);
  graph.edges_faces = make_edges_faces_unsorted(graph);
  graph.faces_faces = make_faces_faces(graph);
  return graph;
};

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
//     const vertices_edges = make_vertices_edges_unsorted(graph);
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
