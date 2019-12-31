/**
 * rebuild a graph back up by only using vertices_coords and edges_vertices
 */

import math from "../../include/math";
import FOLDConvert from "../../include/fold/convert";
import remove from "./remove";
import {
  get_duplicate_vertices,
  get_duplicate_edges,
  get_duplicate_edges_old
} from "./query";
import fragment from "./fragment";
import Validate from "./validate";
import {
  make_vertices_edges,
  make_vertices_faces,
  make_edges_edges,
  make_edges_faces,
  make_edges_length,
  make_faces_faces
} from "./make";
import {
  edge_assignment_to_foldAngle
} from "./keys";

/**
 * This function requires:
 * - graph must be an object {}
 * - vertices_coords and edges_vertices be defined.
 *
 */
// export const complete = function (graph) {
//   if (graph.vertices_coords == null
//     || graph.edges_vertices == null) { return; }
//   if (graph.vertices_vertices == null) {
//     FOLDConvert.edges_vertices_to_vertices_vertices_sorted(graph);
//   }
//   if (graph.faces_vertices == null) {
//     FOLDConvert.vertices_vertices_to_faces_vertices(graph);
//   }
//   if (graph.faces_edges == null) {
//     FOLDConvert.faces_vertices_to_faces_edges(graph);
//   }
//   if (graph.edges_faces == null) {
//     graph.edges_faces = make_edges_faces(graph);
//   }
//   if (graph.vertices_faces == null) {
//     graph.vertices_faces = make_vertices_faces(graph);
//   }
//   if (graph.edges_length == null) {
//     graph.edges_length = make_edges_length(graph);
//   }
//   if (graph.edges_foldAngle == null
//     && graph.edges_assignment != null) {
//     graph.edges_foldAngle = graph.edges_assignment
//       .map(a => edge_assignment_to_foldAngle(a));
//   }
//   if (graph.edges_assignment == null
//     && graph.edges_foldAngle != null) {
//     graph.edges_assignment = graph.edges_foldAngle.map((a) => {
//       if (a === 0) return "F";
//       if (a < 0) return "M";
//       if (a > 0) return "V";
//       return "U";
//     });
//     // todo, this does not find borders, we need an algorithm to walk around
//   }
//   if (graph.faces_faces == null) {
//     graph.faces_faces = make_faces_faces(graph);
//   }
//   if (graph.vertices_edges == null) {
//     graph.vertices_edges = make_vertices_edges(graph);
//   }
// };

export const complete = function (graph) {
  if (graph.vertices_vertices == null) {
    if (graph.vertices_coords && graph.edges_vertices) {
      FOLDConvert.edges_vertices_to_vertices_vertices_sorted(graph);
    } else if (graph.edges_vertices) {
      FOLDConvert.edges_vertices_to_vertices_vertices_unsorted(graph);
    }
  }
  if (graph.faces_vertices == null) {
    if (graph.vertices_coords && graph.vertices_vertices) {
      // todo, this can be rebuilt to remove vertices_coords dependency
      FOLDConvert.vertices_vertices_to_faces_vertices(graph);
    }
  }
  if (graph.faces_edges == null) {
    if (graph.faces_vertices) {
      FOLDConvert.faces_vertices_to_faces_edges(graph);
    }
  }
  if (graph.edges_faces == null) {
    const edges_faces = make_edges_faces(graph);
    if (edges_faces !== undefined) {
      graph.edges_faces = edges_faces;
    }
  }
  if (graph.vertices_faces == null) {
    const vertices_faces = make_vertices_faces(graph);
    if (vertices_faces !== undefined) {
      graph.vertices_faces = vertices_faces;
    }
  }
  if (graph.edges_length == null) {
    const edges_length = make_edges_length(graph);
    if (edges_length !== undefined) {
      graph.edges_length = edges_length;
    }
  }
  if (graph.edges_foldAngle == null
    && graph.edges_assignment != null) {
    graph.edges_foldAngle = graph.edges_assignment
      .map(a => edge_assignment_to_foldAngle(a));
  }
  if (graph.edges_assignment == null
    && graph.edges_foldAngle != null) {
    graph.edges_assignment = graph.edges_foldAngle.map((a) => {
      if (a === 0) { return "F"; }
      if (a < 0) { return "M"; }
      if (a > 0) { return "V"; }
      return "U";
    });
    // todo, this does not find borders, we need an algorithm to walk around
  }
  if (graph.faces_faces == null) {
    const faces_faces = make_faces_faces(graph);
    if (faces_faces !== undefined) {
      graph.faces_faces = faces_faces;
    }
  }
  if (graph.vertices_edges == null) {
    const vertices_edges = make_vertices_edges(graph);
    if (vertices_edges !== undefined) {
      graph.vertices_edges = vertices_edges;
    }
  }
  if (graph.edges_edges == null) {
    const edges_edges = make_edges_edges(graph);
    if (edges_edges !== undefined) {
      graph.edges_edges = edges_edges;
    }
  }
};

/**
 * this is the big rebuild-all-arrays function.
 * vertices_coords and edges_vertices are the seeds everything else is rebuilt.
 * todo: specify "keys" parameter to update certain keys only
 */
export const rebuild = function (graph, epsilon = math.core.EPSILON) {
  // it's not exactly clear what "clean" should do
  // it definitely validates the graph and adds geometry arrays if needed
  // it probably also adds file_spec: 1.1, and frame_attributes and _classes

  // these are the geometry arrays which will be rebuilt
  ["vertices_vertices", "vertices_edges", "vertices_faces",
    "edges_faces", "edges_edges",
    "faces_vertices", "faces_edges", "faces_faces"].filter(a => a in graph)
    .forEach(key => delete graph[key]);

  Object.keys(graph)
    .filter(s => s.includes("re:"))
    .forEach(key => delete graph[key]);

  // this needs to chop edges that have line endpoints collear to them
  const rebuilt = fragment(graph, epsilon);
  // remove(rebuilt, "edges", Object.keys(get_duplicate_edges(rebuilt)));
  remove(rebuilt, "edges", get_duplicate_edges_old(rebuilt));
  FOLDConvert.edges_vertices_to_vertices_vertices_sorted(rebuilt);
  FOLDConvert.vertices_vertices_to_faces_vertices(rebuilt);
  FOLDConvert.faces_vertices_to_faces_edges(rebuilt);

  rebuilt.edges_faces = make_edges_faces(rebuilt);
  rebuilt.vertices_faces = make_vertices_faces(rebuilt);

  rebuilt.edges_length = make_edges_length(rebuilt);

  Object.assign(graph, rebuilt);

  if (!Validate.edges_assignment(graph)) {
    graph.edges_assignment = Array(graph.edges_vertices.length).fill("F");
  }

  if ("file_spec" in graph === false) { graph.file_spec = 1.1; }
  if ("frame_attributes" in graph === false) {
    graph.frame_attributes = ["2D"];
  }
  if ("frame_classes" in graph === false) {
    graph.frame_classes = ["creasePattern"];
  }
};

// export const clean = function (graph, keys) {
//   if ("vertices_coords" in graph === false
//     || "edges_vertices" in graph === false) {
//     console.warn("clean requires vertices_coords and edges_vertices");
//     return;
//   }
//   if (keys == null) {
//     convert.edges_vertices_to_faces_vertices_edges(graph);
//     // todo, these are not arranged counter-clockwise
//     const edges_faces = make_edges_faces(graph);
//     graph.edges_faces = edges_faces;
//   } else {
//     console.warn("clean() certain keys only not yet implemented");
//   }
// };

// export function clip_line(fold, linePoint, lineVector) {
//  function len(a,b){
//    return Math.sqrt(Math.pow(a[0]-b[0],2) + Math.pow(a[1]-b[1],2));
//  }

//  let edges = fold.edges_vertices
//    .map(ev => ev.map(e => fold.vertices_coords[e]));

//  return [lineVector, [-lineVector[0], -lineVector[1]]]
//    .map(lv => edges
//      .map(e => math.core.intersection.ray_edge(linePoint, lv, e[0], e[1]))
//      .filter(i => i != null)
//      .map(i => ({intersection:i, length:len(i, linePoint)}))
//      .sort((a, b) => a.length - b.length)
//      .map(el => el.intersection)
//      .shift()
//    ).filter(p => p != null);
// }
